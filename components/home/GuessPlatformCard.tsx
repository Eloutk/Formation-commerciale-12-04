'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, Search, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { homeCard } from '@/components/home/home-card-styles'
import { getCycleDay } from '@/lib/daily-question-cycle'
import { notifyHomePlayAttentionChanged } from '@/lib/home-play-attention'
import {
  isWeekendLocal,
  nextMondayLabel,
  parseJsonStringArray,
  type GuessPlatformQuestion,
  type GuessPlatformResult,
} from '@/lib/guess-platform'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase/client'

type PlayPayload = {
  weekend?: boolean
  message?: string
  question?: GuessPlatformQuestion | null
}

export function GuessPlatformCard({
  onStatsChange,
}: {
  onStatsChange?: () => void
} = {}) {
  const cycleDay = useMemo(() => getCycleDay(), [])
  const weekend = isWeekendLocal()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weekendMessage, setWeekendMessage] = useState<string | null>(null)
  const [question, setQuestion] = useState<GuessPlatformQuestion | null>(null)
  const [hintsShown, setHintsShown] = useState(1)
  const [hintAnimating, setHintAnimating] = useState(false)
  const [result, setResult] = useState<GuessPlatformResult | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: playData, error: playError } = await supabase.rpc('get_guess_platform_play', {
        p_cycle_day: cycleDay,
      })

      if (playError) {
        setError('Le mini-jeu n’est pas encore configuré. Exécute le SQL Supabase, puis recharge.')
        setQuestion(null)
        return
      }

      const play = playData as PlayPayload
      if (play?.weekend) {
        setWeekendMessage(play.message || 'Reviens lundi pour continuer ta série')
        setQuestion(null)
        return
      }

      const q = play?.question
      if (!q) {
        setError('Aucune devinette active pour aujourd’hui.')
        setQuestion(null)
        return
      }

      const normalized: GuessPlatformQuestion = {
        ...q,
        answer_options: parseJsonStringArray(q.answer_options),
        clues: parseJsonStringArray(q.clues),
        clues_count: q.clues_count || parseJsonStringArray(q.clues).length,
      }
      setQuestion(normalized)

      const { data: reviewData } = await supabase.rpc('get_guess_platform_review', {
        p_question_id: normalized.id,
      })
      if (reviewData) {
        const review = normalizeResult(reviewData)
        setResult(review)
        setHintsShown(review.hints_used)
      } else {
        setResult(null)
        setHintsShown(1)
      }
    } catch {
      setError('Impossible de charger le mini-jeu pour le moment.')
    } finally {
      setLoading(false)
    }
  }, [cycleDay])

  useEffect(() => {
    void load()
  }, [load])

  const revealHint = () => {
    if (!question || result) return
    if (hintsShown >= question.clues.length) return
    setHintAnimating(true)
    setHintsShown((n) => n + 1)
    window.setTimeout(() => setHintAnimating(false), 350)
  }

  const submit = async (answer: string) => {
    if (!question || result || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc('submit_guess_platform_answer', {
        p_question_id: question.id,
        p_selected_answer: answer,
        p_hints_used: hintsShown,
      })
      if (rpcError || !data) {
        setError(rpcError?.message || 'Enregistrement impossible. Réessaie.')
        return
      }
      const review = normalizeResult(data)
      setResult(review)
      setHintsShown(review.hints_used)
      notifyHomePlayAttentionChanged()
      onStatsChange?.()
    } finally {
      setSubmitting(false)
    }
  }

  const clues = result?.clues?.length ? result.clues : question?.clues || []
  const options = result?.answer_options?.length
    ? result.answer_options
    : question?.answer_options || []
  const canRevealHint = !result && question && hintsShown < question.clues.length

  return (
    <Card className={homeCard.root}>
      <CardHeader className={homeCard.header}>
        <div className="min-w-0 space-y-0.5">
          <div className={homeCard.titleRow}>
            <Search className={homeCard.titleIcon} />
            <CardTitle className={homeCard.title}>Devine la plateforme</CardTitle>
            {question?.difficulty ? (
              <Badge variant="outline" className={cn(homeCard.badge, 'capitalize')}>
                {question.difficulty}
              </Badge>
            ) : null}
          </div>
          <p className={homeCard.subtitle}>
            +1 pt par partie · +1 pt si tu enchaînes les jours ouvrés
          </p>
        </div>
      </CardHeader>

      <CardContent className={cn(homeCard.content, 'min-h-0')}>
        {loading ? (
          <p className={homeCard.bodyMuted}>Chargement…</p>
        ) : weekend || weekendMessage ? (
          <div className={cn(homeCard.panel, 'border-[#E94C16]/20 bg-[#E94C16]/5')}>
            <p className="font-medium text-[#E94C16]">Jour non ouvré</p>
            <p className={homeCard.bodyMuted}>
              {weekendMessage || `Reviens le prochain jour ouvré (${nextMondayLabel()}).`}
            </p>
          </div>
        ) : error ? (
          <p className={homeCard.bodyMuted}>{error}</p>
        ) : (
          <div className="grid min-h-0 flex-1 gap-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)]">
            <section className="flex min-h-0 flex-col gap-1.5 overflow-hidden rounded-md border border-border/70 bg-[#FAFAFA] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className={cn(homeCard.sectionTitle, '!mb-0')}>
                  Indices
                  <span className="font-normal text-muted-foreground">
                    {hintsShown}/{clues.length || question?.clues.length || 0}
                  </span>
                </p>
                {canRevealHint ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(homeCard.button, 'h-7 shrink-0 px-2')}
                    onClick={revealHint}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Autre indice
                  </Button>
                ) : null}
              </div>
              <ol className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
                {clues.slice(0, hintsShown).map((clue, index) => (
                  <li
                    key={`${index}-${clue.slice(0, 12)}`}
                    className={cn(
                      'rounded-md border border-border/60 bg-card px-2.5 py-2 text-xs leading-snug sm:text-[13px]',
                      hintAnimating &&
                        index === hintsShown - 1 &&
                        'border-[#E94C16]/40 bg-[#E94C16]/5'
                    )}
                  >
                    <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E94C16]/10 text-[10px] font-semibold text-[#E94C16]">
                      {index + 1}
                    </span>
                    {clue}
                  </li>
                ))}
              </ol>
            </section>

            <section className="flex min-h-0 flex-col overflow-hidden">
              {!result ? (
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                  {options.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="outline"
                      disabled={submitting}
                      className={cn(
                        homeCard.button,
                        'h-auto min-h-0 whitespace-normal px-2 py-2 text-[11px] font-medium leading-snug sm:text-xs'
                      )}
                      onClick={() => void submit(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <ResultBlock result={result} />
              )}
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ResultBlock({ result }: { result: GuessPlatformResult }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-md border p-2',
        result.is_correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      )}
    >
      <p className="flex flex-wrap items-center gap-1 text-xs font-medium">
        {result.is_correct ? (
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
        ) : (
          <XCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
        )}
        {result.is_correct ? 'Bonne réponse !' : 'Presque…'}{' '}
        <span className="font-semibold">{result.correct_answer}</span>
      </p>
      <p className="min-h-0 flex-1 overflow-y-auto text-[11px] leading-snug text-foreground">
        {result.explanation}
      </p>
    </div>
  )
}

function normalizeResult(raw: unknown): GuessPlatformResult {
  const data = raw as GuessPlatformResult
  return {
    ...data,
    clues: parseJsonStringArray(data.clues),
    answer_options: parseJsonStringArray(data.answer_options),
  }
}
