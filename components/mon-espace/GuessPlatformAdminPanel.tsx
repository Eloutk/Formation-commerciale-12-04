'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { UpcomingAdminPreview } from '@/components/mon-espace/UpcomingAdminPreview'
import {
  getUpcomingPreviewDays,
  pickByCycleRotation,
} from '@/lib/admin-upcoming-preview'
import { parseJsonStringArray } from '@/lib/guess-platform'
import supabase from '@/utils/supabase/client'

type Difficulty = 'facile' | 'intermediaire' | 'difficile'

type GuessQuestionRow = {
  id: string
  sort_order: number
  title: string
  correct_answer: string
  answer_options: string[]
  clues: string[]
  explanation: string
  category: string
  difficulty: Difficulty
  is_active: boolean
  created_at?: string
}

type DraftQuestion = Omit<GuessQuestionRow, 'id' | 'created_at'> & { id?: string }

const EMPTY_DRAFT = (): DraftQuestion => ({
  sort_order: 1,
  title: 'Devine la plateforme',
  correct_answer: '',
  answer_options: ['', '', '', ''],
  clues: ['', '', ''],
  explanation: '',
  category: 'Social',
  difficulty: 'facile',
  is_active: true,
})

function normalizeRow(row: Record<string, unknown>): GuessQuestionRow {
  return {
    id: String(row.id),
    sort_order: Number(row.sort_order),
    title: String(row.title || 'Devine la plateforme'),
    correct_answer: String(row.correct_answer || ''),
    answer_options: parseJsonStringArray(row.answer_options),
    clues: parseJsonStringArray(row.clues),
    explanation: String(row.explanation || ''),
    category: String(row.category || ''),
    difficulty: (row.difficulty as Difficulty) || 'facile',
    is_active: Boolean(row.is_active),
    created_at: row.created_at ? String(row.created_at) : undefined,
  }
}

function validateDraft(draft: DraftQuestion): string | null {
  const options = draft.answer_options.map((o) => o.trim()).filter(Boolean)
  const clues = draft.clues.map((c) => c.trim()).filter(Boolean)
  if (!draft.title.trim()) return 'Le titre est obligatoire.'
  if (!draft.correct_answer.trim()) return 'La bonne réponse est obligatoire.'
  if (!draft.explanation.trim()) return 'L’explication est obligatoire.'
  if (!draft.category.trim()) return 'La catégorie est obligatoire.'
  if (options.length < 3 || options.length > 4) return 'Indique 3 ou 4 propositions.'
  if (clues.length < 3 || clues.length > 4) return 'Indique 3 ou 4 indices.'
  if (!options.includes(draft.correct_answer.trim())) {
    return 'La bonne réponse doit figurer dans les propositions.'
  }
  if (!Number.isFinite(draft.sort_order) || draft.sort_order < 1) {
    return 'L’ordre d’affichage doit être un entier ≥ 1.'
  }
  return null
}

export function GuessPlatformAdminPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<GuessQuestionRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<DraftQuestion | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('guess_platform_questions')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setRows((data || []).map((row) => normalizeRow(row as Record<string, unknown>)))
    } catch (err) {
      toast({
        title: 'Chargement impossible',
        description:
          err instanceof Error
            ? err.message
            : 'Vérifie que le SQL guess-platform a bien été exécuté.',
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
      [row.correct_answer, row.category, row.difficulty, row.title, ...row.clues]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [filter, rows])

  const openCreate = () => {
    const nextOrder = rows.reduce((max, row) => Math.max(max, row.sort_order), 0) + 1
    setDraft({ ...EMPTY_DRAFT(), sort_order: nextOrder })
  }

  const openEdit = (row: GuessQuestionRow) => {
    setDraft({
      ...row,
      answer_options: [...row.answer_options, '', '', '', ''].slice(0, 4),
      clues: [...row.clues, '', '', '', ''].slice(0, 4),
    })
  }

  const saveDraft = async () => {
    if (!draft) return
    const errorMsg = validateDraft(draft)
    if (errorMsg) {
      toast({ title: 'Formulaire incomplet', description: errorMsg, variant: 'destructive' })
      return
    }

    const options = draft.answer_options.map((o) => o.trim()).filter(Boolean)
    const clues = draft.clues.map((c) => c.trim()).filter(Boolean)
    const payload = {
      sort_order: draft.sort_order,
      title: draft.title.trim(),
      correct_answer: draft.correct_answer.trim(),
      answer_options: options,
      clues,
      explanation: draft.explanation.trim(),
      category: draft.category.trim(),
      difficulty: draft.difficulty,
      is_active: draft.is_active,
    }

    setSaving(true)
    try {
      if (draft.id) {
        const { error } = await supabase
          .from('guess_platform_questions')
          .update(payload)
          .eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Devinette mise à jour' })
      } else {
        const { error } = await supabase.from('guess_platform_questions').insert(payload)
        if (error) throw error
        toast({ title: 'Devinette créée' })
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

  const toggleActive = async (row: GuessQuestionRow) => {
    const { error } = await supabase
      .from('guess_platform_questions')
      .update({ is_active: !row.is_active })
      .eq('id', row.id)
    if (error) {
      toast({ title: 'Modification impossible', description: error.message, variant: 'destructive' })
      return
    }
    await load()
  }

  const removeRow = async (row: GuessQuestionRow) => {
    if (
      !window.confirm(
        `Supprimer la devinette « ${row.correct_answer} » (#${row.sort_order}) ? Les réponses liées seront aussi supprimées.`
      )
    ) {
      return
    }
    const { error } = await supabase.from('guess_platform_questions').delete().eq('id', row.id)
    if (error) {
      toast({ title: 'Suppression impossible', description: error.message, variant: 'destructive' })
      return
    }
    if (draft?.id === row.id) setDraft(null)
    toast({ title: 'Devinette supprimée' })
    await load()
  }

  const upcomingSlots = useMemo(() => {
    const active = rows.filter((row) => row.is_active)
    return getUpcomingPreviewDays(2).map((day) => {
      const row = pickByCycleRotation(active, day.cycleDay)
      return {
        day,
        content: row ? (
          <div className="space-y-1.5">
            <p className="font-medium">{row.title || row.correct_answer}</p>
            <p className="text-xs text-muted-foreground">
              #{row.sort_order} · {row.difficulty} · réponse :{' '}
              <strong className="text-foreground">{row.correct_answer}</strong>
            </p>
            <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
              {row.clues.map((clue, i) => (
                <li key={`${row.id}-c-${i}`}>{clue}</li>
              ))}
            </ol>
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
          <p className="text-muted-foreground">Aucune devinette active.</p>
        ),
      }
    })
  }, [rows])

  const body = (
    <div className="space-y-4">
      <UpcomingAdminPreview slots={upcomingSlots} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!embedded ? (
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
                <Search className="h-6 w-6" aria-hidden />
              </span>
              Devine la plateforme
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Gérez les devinettes du mini-jeu Home. Toute modification est enregistrée directement
              dans Supabase.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Gérez les devinettes du mini-jeu Home (réponses, indices, explications).
          </p>
        )}
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nouvelle devinette
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
              <CardTitle>Liste ({rows.length})</CardTitle>
              <CardDescription>
                L’ordre (`sort_order`) détermine la rotation quotidienne.
              </CardDescription>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrer (réponse, catégorie, indice…)"
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
                  Aucune devinette trouvée.
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
                          <span className="text-xs text-muted-foreground">#{row.sort_order}</span>
                          <p className="truncate font-medium">{row.correct_answer}</p>
                          <Badge variant="outline" className="capitalize">
                            {row.difficulty}
                          </Badge>
                          <Badge variant={row.is_active ? 'default' : 'secondary'}>
                            {row.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {row.category} · {row.clues[0]}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 pr-1">
                          <Switch
                            checked={row.is_active}
                            onCheckedChange={() => void toggleActive(row)}
                            aria-label="Activer / désactiver"
                          />
                        </div>
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
                  <CardTitle>{draft?.id ? 'Modifier la devinette' : 'Nouvelle devinette'}</CardTitle>
                  <CardDescription>
                    {draft
                      ? 'Les champs sont enregistrés dans `guess_platform_questions`.'
                      : 'Sélectionne une devinette ou crée-en une nouvelle.'}
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
                  Clique sur « Modifier » ou « Nouvelle devinette » pour commencer.
                </p>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ordre (sort_order)">
                      <Input
                        type="number"
                        min={1}
                        value={draft.sort_order}
                        onChange={(e) =>
                          setDraft({ ...draft, sort_order: Number(e.target.value) || 1 })
                        }
                      />
                    </Field>
                    <Field label="Difficulté">
                      <Select
                        value={draft.difficulty}
                        onValueChange={(value) =>
                          setDraft({ ...draft, difficulty: value as Difficulty })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facile">Facile</SelectItem>
                          <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                          <SelectItem value="difficile">Difficile</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Titre">
                    <Input
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    />
                  </Field>

                  <Field label="Catégorie">
                    <Input
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      placeholder="Social, Google, Audio…"
                    />
                  </Field>

                  <div className="space-y-2">
                    <Label>Propositions (3 ou 4)</Label>
                    {draft.answer_options.map((option, index) => (
                      <Input
                        key={`opt-${index}`}
                        value={option}
                        placeholder={`Proposition ${index + 1}`}
                        onChange={(e) => {
                          const next = [...draft.answer_options]
                          next[index] = e.target.value
                          setDraft({ ...draft, answer_options: next })
                        }}
                      />
                    ))}
                  </div>

                  <Field label="Bonne réponse (doit matcher une proposition)">
                    <Select
                      value={
                        draft.answer_options
                          .map((o) => o.trim())
                          .filter(Boolean)
                          .includes(draft.correct_answer)
                          ? draft.correct_answer
                          : undefined
                      }
                      onValueChange={(value) => setDraft({ ...draft, correct_answer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la bonne réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        {draft.answer_options
                          .map((o) => o.trim())
                          .filter(Boolean)
                          .map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="space-y-2">
                    <Label>Indices (3 ou 4, du plus ambigu au plus explicite)</Label>
                    {draft.clues.map((clue, index) => (
                      <Textarea
                        key={`clue-${index}`}
                        value={clue}
                        rows={2}
                        placeholder={`Indice ${index + 1}`}
                        onChange={(e) => {
                          const next = [...draft.clues]
                          next[index] = e.target.value
                          setDraft({ ...draft, clues: next })
                        }}
                      />
                    ))}
                  </div>

                  <Field label="Explication pédagogique">
                    <Textarea
                      rows={3}
                      value={draft.explanation}
                      onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                    />
                  </Field>

                  <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-xs text-muted-foreground">
                        Seules les actives tournent sur la Home.
                      </p>
                    </div>
                    <Switch
                      checked={draft.is_active}
                      onCheckedChange={(checked) => setDraft({ ...draft, is_active: checked })}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => void saveDraft()} disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Enregistrer dans Supabase
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

  if (embedded) return body

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl">{body}</div>
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
