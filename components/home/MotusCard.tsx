'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Trophy, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { homeCard } from '@/components/home/home-card-styles'
import { getCycleDay } from '@/lib/daily-question-cycle'
import { notifyHomePlayAttentionChanged } from '@/lib/home-play-attention'
import {
  buildEmptyMotusRows,
  normalizeMotusGuesses,
  stripAccentsUpper,
  type MotusPlayPayload,
  type MotusProgress,
  type MotusQuestion,
  type MotusSubmitResult,
  type MotusTile,
} from '@/lib/motus'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase/client'

const KEYBOARD_ROWS = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'] as const

type MotusCardProps = {
  onStatsChange?: () => void
}

type MotusBestWinner = {
  user_id: string
  first_name: string
}

type MotusBestOfDay = {
  attempts: number | null
  winners: MotusBestWinner[]
}

function formatMotusBestLabel(best: MotusBestOfDay): string | null {
  if (!best.attempts || best.winners.length === 0) return null
  const names = best.winners.map((w) => w.first_name).filter(Boolean)
  if (names.length === 0) return null
  const attemptsLabel = `${best.attempts} essai${best.attempts > 1 ? 's' : ''}`
  if (names.length === 1) return `${names[0]} a réussi en ${attemptsLabel}`
  if (names.length === 2) return `${names[0]} et ${names[1]} ont réussi en ${attemptsLabel}`
  const head = names.slice(0, -1).join(', ')
  const last = names[names.length - 1]
  return `${head} et ${last} ont réussi en ${attemptsLabel}`
}

export function MotusCard({ onStatsChange }: MotusCardProps) {
  const cycleDay = useMemo(() => getCycleDay(), [])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [question, setQuestion] = useState<MotusQuestion | null>(null)
  const [progress, setProgress] = useState<MotusProgress | null>(null)
  const [draft, setDraft] = useState('')
  const [bestOfDay, setBestOfDay] = useState<MotusBestOfDay | null>(null)
  const focusRef = useRef<HTMLDivElement>(null)

  const loadBestOfDay = useCallback(async () => {
    try {
      const { data, error: rpcError } = await supabase.rpc('get_motus_best_of_day', {
        p_cycle_day: cycleDay,
      })
      if (rpcError || !data || typeof data !== 'object') {
        setBestOfDay(null)
        return
      }
      const payload = data as {
        attempts?: number | null
        winners?: MotusBestWinner[]
      }
      setBestOfDay({
        attempts: typeof payload.attempts === 'number' ? payload.attempts : null,
        winners: Array.isArray(payload.winners) ? payload.winners : [],
      })
    } catch {
      setBestOfDay(null)
    }
  }, [cycleDay])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc('get_motus_play', {
        p_cycle_day: cycleDay,
      })
      if (rpcError) {
        setQuestion(null)
        setProgress(null)
        setError('Mot du jour non configuré. Exécute le SQL motus.sql dans Supabase.')
        return
      }
      const payload = data as MotusPlayPayload
      const q = payload?.question ?? null
      setQuestion(q)
      if (payload?.progress) {
        setProgress({
          ...payload.progress,
          guesses: normalizeMotusGuesses(payload.progress.guesses),
          finished: Boolean(payload.progress.finished),
        })
        setDraft(q && !payload.progress.finished ? q.first_letter : '')
      } else if (q) {
        setProgress(null)
        setDraft(q.first_letter)
      } else {
        setProgress(null)
        setError('Aucun mot actif pour aujourd’hui.')
      }
      await loadBestOfDay()
    } catch {
      setError('Impossible de charger le Mot du jour.')
    } finally {
      setLoading(false)
    }
  }, [cycleDay, loadBestOfDay])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!open || !question || progress?.finished) return
    setDraft((prev) => (prev ? prev : question.first_letter))
    const id = window.setTimeout(() => focusRef.current?.focus(), 50)
    return () => window.clearTimeout(id)
  }, [open, question, progress?.finished])

  const finished = Boolean(progress?.finished)
  const solved = Boolean(progress?.solved)
  const currentRowIndex = progress?.guesses.length ?? 0
  const bestLabel = useMemo(
    () => formatMotusBestLabel(bestOfDay || { attempts: null, winners: [] }),
    [bestOfDay]
  )

  const rows = useMemo(() => {
    if (!question) return []
    return buildEmptyMotusRows(
      question.length,
      question.first_letter,
      question.max_attempts,
      progress?.guesses || [],
      finished ? '' : draft
    )
  }, [question, progress, draft, finished])

  const submitGuess = useCallback(async () => {
    if (!question || finished || submitting) return
    const guess = stripAccentsUpper(draft)
    if (guess.length !== question.length) {
      setError(`Le mot doit faire ${question.length} lettres.`)
      return
    }
    if (!guess.startsWith(question.first_letter)) {
      setError(`Le mot doit commencer par ${question.first_letter}.`)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc('submit_motus_guess', {
        p_word_id: question.id,
        p_guess: guess,
      })
      if (rpcError || !data) {
        setError(rpcError?.message || 'Enregistrement impossible.')
        return
      }
      const result = data as MotusSubmitResult
      const nextProgress: MotusProgress = {
        guesses: normalizeMotusGuesses(result.guesses),
        solved: result.solved,
        attempts: result.attempts,
        finished: result.finished,
        points: result.points,
        word: result.word,
      }
      setProgress(nextProgress)
      if (result.finished) {
        setDraft('')
        notifyHomePlayAttentionChanged()
        onStatsChange?.()
        void loadBestOfDay()
      } else {
        setDraft(question.first_letter)
      }
    } finally {
      setSubmitting(false)
    }
  }, [question, finished, submitting, draft, onStatsChange, loadBestOfDay])

  const typeLetter = useCallback(
    (raw: string) => {
      if (!question || finished || submitting) return
      const letter = stripAccentsUpper(raw)
      if (!/^[A-Z]$/.test(letter)) return
      setError(null)
      setDraft((prev) => {
        const base = stripAccentsUpper(prev || question.first_letter)
        const locked = question.first_letter + base.slice(1)
        if (locked.length >= question.length) return locked.slice(0, question.length)
        if (!locked.startsWith(question.first_letter)) {
          return (question.first_letter + letter).slice(0, question.length)
        }
        return (locked + letter).slice(0, question.length)
      })
    },
    [question, finished, submitting]
  )

  const backspace = useCallback(() => {
    if (!question || finished || submitting) return
    setError(null)
    setDraft((prev) => {
      const base = stripAccentsUpper(prev || question.first_letter)
      if (base.length <= 1) return question.first_letter
      return base.slice(0, -1)
    })
  }, [question, finished, submitting])

  useEffect(() => {
    if (!open || finished) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      if (event.key === 'Enter') {
        event.preventDefault()
        void submitGuess()
        return
      }
      if (event.key === 'Backspace') {
        event.preventDefault()
        backspace()
        return
      }
      if (/^[a-zA-ZàâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]$/.test(event.key)) {
        event.preventDefault()
        typeLetter(event.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, finished, submitGuess, backspace, typeLetter])

  return (
    <>
      <Card className={homeCard.root}>
        <CardHeader className={homeCard.header}>
          <div className={homeCard.titleRow}>
            <Type className={homeCard.titleIcon} />
            <CardTitle className={homeCard.title}>Mot du jour</CardTitle>
          </div>
          <p className={homeCard.subtitle}>Motus maison — +1 pt une fois terminé</p>
        </CardHeader>
        <CardContent className={cn(homeCard.content, 'justify-between')}>
          {loading ? (
            <p className={homeCard.bodyMuted}>Chargement…</p>
          ) : error && !question ? (
            <p className={homeCard.bodyMuted}>{error}</p>
          ) : (
            <>
              <div className="space-y-2">
                <p className={homeCard.body}>
                  Trouve le mot en 6 essais. La première lettre est donnée.
                </p>
                {question ? (
                  <p className="text-sm font-semibold tracking-widest text-[#E94C16]">
                    {question.first_letter}
                    {'·'.repeat(Math.max(0, question.length - 1))}
                    <span className="ml-2 text-xs font-normal tracking-normal text-muted-foreground">
                      {question.length} lettres
                    </span>
                  </p>
                ) : null}
                {finished ? (
                  <p className="text-xs font-medium text-[#E94C16]">
                    {solved
                      ? `Bravo ! +${progress?.points ?? 1} pt`
                      : `Terminé — mot : ${progress?.word}`}
                  </p>
                ) : (
                  <p className={homeCard.bodyMuted}>
                    {(progress?.attempts ?? 0) > 0
                      ? `${progress?.attempts}/6 essais`
                      : 'Pas encore joué aujourd’hui'}
                  </p>
                )}
                {bestLabel ? (
                  <p className="flex items-start gap-1.5 text-[11px] leading-snug text-amber-700">
                    <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
                    <span>{bestLabel}</span>
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                className={cn(homeCard.button, 'w-full')}
                onClick={() => setOpen(true)}
                disabled={!question}
              >
                {finished ? 'Voir la partie' : 'Jouer'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-4">
          <DialogHeader>
            <DialogTitle>Mot du jour</DialogTitle>
            <DialogDescription>
              Tape directement dans la grille. Entrée pour valider, Retour arrière pour effacer.
            </DialogDescription>
          </DialogHeader>

          {question ? (
            <div
              ref={focusRef}
              tabIndex={-1}
              className="space-y-4 outline-none"
              aria-label="Grille Mot du jour"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3.5 w-3.5 rounded-sm bg-green-600" aria-hidden />
                  Bien placée
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3.5 w-3.5 rounded-sm bg-[#E94C16]" aria-hidden />
                  Mal placée
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3.5 w-3.5 rounded-sm bg-neutral-400" aria-hidden />
                  Absente
                </span>
              </div>

              <div className="mx-auto grid w-fit gap-1.5">
                {rows.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex gap-1.5">
                    {row.map((tile, colIndex) => (
                      <MotusCell
                        key={`${rowIndex}-${colIndex}`}
                        tile={tile}
                        active={
                          !finished &&
                          rowIndex === currentRowIndex &&
                          colIndex === Math.min(Math.max(draft.length, 1), question.length) - 1
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>

              {finished ? (
                <div
                  className={cn(
                    'rounded-md border px-3 py-2 text-sm',
                    solved ? 'border-green-500 bg-green-50' : 'border-border bg-muted/40'
                  )}
                >
                  {solved ? (
                    <p className="font-medium">
                      Bien joué ! Mot trouvé en {progress?.attempts} essai
                      {(progress?.attempts || 0) > 1 ? 's' : ''}. +{progress?.points ?? 1} pt
                    </p>
                  ) : (
                    <p className="font-medium">
                      Dommage — le mot était <strong>{progress?.word}</strong>. +
                      {progress?.points ?? 1} pt pour avoir joué.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-1.5">
                    {KEYBOARD_ROWS.map((row) => (
                      <div key={row} className="flex flex-wrap justify-center gap-1">
                        {row.split('').map((letter) => (
                          <button
                            key={letter}
                            type="button"
                            className="h-9 min-w-8 rounded-md border border-border/80 bg-card px-2 text-sm font-semibold hover:bg-muted disabled:opacity-50"
                            disabled={submitting}
                            onClick={() => typeLetter(letter)}
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    ))}
                    <div className="flex gap-1.5 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={submitting}
                        onClick={backspace}
                      >
                        ⌫
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={submitting || draft.length !== question.length}
                        onClick={() => void submitGuess()}
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrée'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{error || 'Indisponible.'}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function MotusCell({ tile, active = false }: { tile: MotusTile; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold uppercase transition-colors',
        tile.status === 'correct' && 'border-green-600 bg-green-600 text-white',
        tile.status === 'present' && 'border-[#E94C16] bg-[#E94C16] text-white',
        tile.status === 'absent' && 'border-neutral-400 bg-neutral-400 text-white',
        tile.status === 'tbd' && 'border-[#E94C16]/50 bg-[#E94C16]/10 text-[#E94C16]',
        tile.status === 'empty' && 'border-border/80 bg-card text-muted-foreground',
        active && tile.status !== 'correct' && tile.status !== 'present' && tile.status !== 'absent'
          ? 'ring-2 ring-[#E94C16]/40'
          : null
      )}
    >
      {tile.letter || ''}
    </span>
  )
}
