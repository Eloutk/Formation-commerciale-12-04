'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  getUpcomingPreviewDays,
} from '@/lib/admin-upcoming-preview'
import supabase from '@/utils/supabase/client'
import { UpcomingAdminPreview } from '@/components/mon-espace/UpcomingAdminPreview'

type DailyQuestionRow = {
  id: string
  cycle_day: number
  category: string
  question: string
  options: string[]
  correct_index: number
  explanation: string
}

type Draft = Omit<DailyQuestionRow, 'id'> & { id?: string }

const EMPTY_DRAFT = (): Draft => ({
  cycle_day: 1,
  category: '',
  question: '',
  options: ['', '', '', ''],
  correct_index: 0,
  explanation: '',
})

function validateDraft(draft: Draft): string | null {
  const options = draft.options.map((o) => o.trim()).filter(Boolean)
  if (!Number.isFinite(draft.cycle_day) || draft.cycle_day < 1 || draft.cycle_day > 365) {
    return 'Le cycle_day doit être entre 1 et 365.'
  }
  if (!draft.category.trim()) return 'La catégorie est obligatoire.'
  if (!draft.question.trim()) return 'La question est obligatoire.'
  if (!draft.explanation.trim()) return 'L’explication est obligatoire.'
  if (options.length < 3 || options.length > 4) return 'Indique 3 ou 4 propositions.'
  if (draft.correct_index < 0 || draft.correct_index >= options.length) {
    return 'Choisis une bonne réponse parmi les propositions.'
  }
  return null
}

export function DailyQuestionsAdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<DailyQuestionRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .order('cycle_day', { ascending: true })
      if (error) throw error
      setRows(
        (data || []).map((row) => ({
          id: String(row.id),
          cycle_day: Number(row.cycle_day),
          category: String(row.category || ''),
          question: String(row.question || ''),
          options: Array.isArray(row.options) ? row.options.map(String) : [],
          correct_index: Number(row.correct_index),
          explanation: String(row.explanation || ''),
        }))
      )
    } catch (err) {
      toast({
        title: 'Chargement impossible',
        description: err instanceof Error ? err.message : 'Erreur Supabase',
        variant: 'destructive',
      })
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      [String(row.cycle_day), row.category, row.question, ...row.options]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [filter, rows])

  const openCreate = () => {
    const used = new Set(rows.map((r) => r.cycle_day))
    let next = 1
    while (used.has(next) && next <= 365) next += 1
    setDraft({ ...EMPTY_DRAFT(), cycle_day: next <= 365 ? next : 1 })
  }

  const openEdit = (row: DailyQuestionRow) => {
    setDraft({
      ...row,
      options: [...row.options, '', '', '', ''].slice(0, 4),
    })
  }

  const saveDraft = async () => {
    if (!draft) return
    const errorMsg = validateDraft(draft)
    if (errorMsg) {
      toast({ title: 'Formulaire incomplet', description: errorMsg, variant: 'destructive' })
      return
    }
    const options = draft.options.map((o) => o.trim()).filter(Boolean)
    const payload = {
      cycle_day: draft.cycle_day,
      category: draft.category.trim(),
      question: draft.question.trim(),
      options,
      correct_index: draft.correct_index,
      explanation: draft.explanation.trim(),
    }
    setSaving(true)
    try {
      if (draft.id) {
        const { error } = await supabase.from('daily_questions').update(payload).eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Question mise à jour' })
      } else {
        const { error } = await supabase.from('daily_questions').insert(payload)
        if (error) throw error
        toast({ title: 'Question créée' })
      }
      setDraft(null)
      await load()
    } catch (err) {
      toast({
        title: 'Enregistrement impossible',
        description: err instanceof Error ? err.message : 'Erreur Supabase',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const removeRow = async (row: DailyQuestionRow) => {
    if (!window.confirm(`Supprimer la question du jour ${row.cycle_day} ?`)) return
    const { error } = await supabase.from('daily_questions').delete().eq('id', row.id)
    if (error) {
      toast({ title: 'Suppression impossible', description: error.message, variant: 'destructive' })
      return
    }
    if (draft?.id === row.id) setDraft(null)
    toast({ title: 'Question supprimée' })
    await load()
  }

  const filledOptions = draft
    ? draft.options.map((o) => o.trim()).filter(Boolean)
    : []

  const upcomingSlots = useMemo(() => {
    const days = getUpcomingPreviewDays(2)
    return days.map((day) => {
      const row = rows.find((r) => r.cycle_day === day.cycleDay) ?? null
      return {
        day,
        content: row ? (
          <div className="space-y-1.5">
            <p className="font-medium">{row.question}</p>
            <p className="text-xs text-muted-foreground">
              {row.category} · bonne réponse :{' '}
              <strong className="text-foreground">
                {row.options[row.correct_index] ?? '—'}
              </strong>
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
              {row.options.map((opt, i) => (
                <li key={`${row.id}-${i}`} className={i === row.correct_index ? 'text-foreground' : ''}>
                  {opt}
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-7"
              onClick={() => openEdit(row)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aucune question pour le cycle_day {day.cycleDay}.
          </p>
        ),
      }
    })
  }, [rows])

  return (
    <div className="space-y-4">
      <UpcomingAdminPreview slots={upcomingSlots} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Une question par `cycle_day` (1–365). Modifier le texte, les options et la bonne réponse.
        </p>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nouvelle question
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle>Liste ({rows.length})</CardTitle>
            <CardDescription>Filtre par jour, catégorie ou libellé.</CardDescription>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer…"
              className="mt-2"
            />
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement…
              </div>
            ) : filtered.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                Aucune question trouvée.
              </p>
            ) : (
              <ul className="divide-y">
                {filtered.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">J{row.cycle_day}</Badge>
                        <Badge variant="secondary">{row.category}</Badge>
                      </div>
                      <p className="line-clamp-2 text-sm font-medium">{row.question}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        ✓ {row.options[row.correct_index] || '—'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => void removeRow(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{draft?.id ? 'Modifier la question' : 'Nouvelle question'}</CardTitle>
                <CardDescription>
                  {draft ? 'Enregistrement dans `daily_questions`.' : 'Sélectionne ou crée une question.'}
                </CardDescription>
              </div>
              {draft ? (
                <Button variant="ghost" size="icon" onClick={() => setDraft(null)}>
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            {!draft ? (
              <p className="text-sm text-muted-foreground">
                Clique sur « Modifier » ou « Nouvelle question » pour commencer.
              </p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Cycle day (1–365)">
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={draft.cycle_day}
                      onChange={(e) =>
                        setDraft({ ...draft, cycle_day: Number(e.target.value) || 1 })
                      }
                    />
                  </Field>
                  <Field label="Catégorie">
                    <Input
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Question">
                  <Textarea
                    rows={3}
                    value={draft.question}
                    onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  />
                </Field>
                <div className="space-y-2">
                  <Label>Propositions (3 ou 4)</Label>
                  {draft.options.map((option, index) => (
                    <Input
                      key={`opt-${index}`}
                      value={option}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => {
                        const next = [...draft.options]
                        next[index] = e.target.value
                        setDraft({ ...draft, options: next })
                      }}
                    />
                  ))}
                </div>
                <Field label="Bonne réponse">
                  <Select
                    value={
                      filledOptions[draft.correct_index] !== undefined
                        ? String(draft.correct_index)
                        : undefined
                    }
                    onValueChange={(value) =>
                      setDraft({ ...draft, correct_index: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la bonne réponse" />
                    </SelectTrigger>
                    <SelectContent>
                      {filledOptions.map((option, index) => (
                        <SelectItem key={`${index}-${option}`} value={String(index)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Explication">
                  <Textarea
                    rows={3}
                    value={draft.explanation}
                    onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void saveDraft()} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Enregistrer
                  </Button>
                  <Button variant="outline" onClick={() => setDraft(null)} disabled={saving}>
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
