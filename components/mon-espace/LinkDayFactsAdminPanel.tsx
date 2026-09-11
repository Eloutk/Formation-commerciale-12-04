'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UpcomingAdminPreview } from '@/components/mon-espace/UpcomingAdminPreview'
import { useToast } from '@/hooks/use-toast'
import {
  formatMonthDayLong,
  formatMonthDayShort,
  isoToMonthDay,
  monthDaySortKeyFromToday,
  monthDayToIso,
} from '@/lib/admin-list-dates'
import { getUpcomingPreviewDays } from '@/lib/admin-upcoming-preview'
import supabase from '@/utils/supabase/client'

type LinkDayFactRow = {
  id: number
  month: number
  day: number
  title: string
  context: string
}

type Draft = { id?: number; month: number; day: number; title: string; context: string }

const EMPTY_DRAFT = (): Draft => {
  const now = new Date()
  return { month: now.getMonth() + 1, day: now.getDate(), title: '', context: '' }
}

export function LinkDayFactsAdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<LinkDayFactRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const today = useMemo(() => new Date(), [])
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('link_day_facts')
        .select('*')
        .order('month', { ascending: true })
        .order('day', { ascending: true })
      if (error) throw error
      setRows(
        (data || []).map((row) => ({
          id: Number(row.id),
          month: Number(row.month),
          day: Number(row.day),
          title: String(row.title || ''),
          context: String(row.context || ''),
        }))
      )
    } catch (err) {
      toast({
        title: 'Chargement impossible',
        description:
          err instanceof Error
            ? err.message
            : 'Exécute supabase/link-day-facts.sql dans Supabase.',
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
    const base = q
      ? rows.filter((row) =>
          [
            formatMonthDayShort(row.month, row.day),
            formatMonthDayLong(row.month, row.day),
            row.title,
            row.context,
          ]
            .join(' ')
            .toLowerCase()
            .includes(q)
        )
      : rows

    return [...base].sort(
      (a, b) =>
        monthDaySortKeyFromToday(a.month, a.day, today) -
        monthDaySortKeyFromToday(b.month, b.day, today)
    )
  }, [filter, rows, today])

  const saveDraft = async () => {
    if (!draft) return
    if (!draft.title.trim()) {
      toast({ title: 'Titre obligatoire', variant: 'destructive' })
      return
    }
    if (draft.month < 1 || draft.month > 12 || draft.day < 1 || draft.day > 31) {
      toast({ title: 'Date invalide', variant: 'destructive' })
      return
    }
    const payload = {
      month: draft.month,
      day: draft.day,
      title: draft.title.trim(),
      context: draft.context.trim(),
    }
    setSaving(true)
    try {
      if (draft.id != null) {
        const { error } = await supabase.from('link_day_facts').update(payload).eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Fait mis à jour' })
      } else {
        const { error } = await supabase.from('link_day_facts').insert(payload)
        if (error) throw error
        toast({ title: 'Fait ajouté' })
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

  const removeRow = async (row: LinkDayFactRow) => {
    if (
      !window.confirm(
        `Supprimer « ${row.title} » (${formatMonthDayLong(row.month, row.day)}) ?`
      )
    ) {
      return
    }
    const { error } = await supabase.from('link_day_facts').delete().eq('id', row.id)
    if (error) {
      toast({ title: 'Suppression impossible', description: error.message, variant: 'destructive' })
      return
    }
    if (draft?.id === row.id) setDraft(null)
    toast({ title: 'Fait supprimé' })
    await load()
  }

  const upcomingSlots = useMemo(() => {
    return getUpcomingPreviewDays(2).map((day) => {
      const match = rows.find((row) => row.month === day.month && row.day === day.day) ?? null
      return {
        day,
        content: match ? (
          <div className="space-y-1.5">
            <p className="font-medium">{match.title}</p>
            {match.context ? (
              <p className="text-xs text-muted-foreground">{match.context}</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-7"
              onClick={() =>
                setDraft({
                  id: match.id,
                  month: match.month,
                  day: match.day,
                  title: match.title,
                  context: match.context,
                })
              }
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun fait Link ce jour-là.</p>
        ),
      }
    })
  }, [rows])

  return (
    <div className="space-y-4">
      <UpcomingAdminPreview slots={upcomingSlots} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Un fait important passé par jour (calendrier Link). Affiché sous la journée mondiale sur
          la Home.
        </p>
        <Button onClick={() => setDraft(EMPTY_DRAFT())} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nouveau fait
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle>Liste ({rows.length})</CardTitle>
            <CardDescription>Aujourd’hui en tête, puis les prochaines dates.</CardDescription>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer (date, titre, contexte)…"
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
                Aucun fait trouvé. Exécute le SQL link-day-facts.sql si la table est vide.
              </p>
            ) : (
              <ul className="divide-y">
                {filtered.map((row) => {
                  const isToday = row.month === todayMonth && row.day === todayDay
                  return (
                    <li
                      key={row.id}
                      className={
                        isToday
                          ? 'flex flex-col gap-3 bg-[#E94C16]/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
                          : 'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
                      }
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              isToday
                                ? 'border-[#E94C16]/40 bg-[#E94C16]/10 capitalize text-[#E94C16]'
                                : 'capitalize'
                            }
                          >
                            {formatMonthDayShort(row.month, row.day)}
                          </Badge>
                          {isToday ? (
                            <Badge className="bg-[#E94C16] text-white hover:bg-[#E94C16]">
                              Aujourd’hui
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium">{row.title}</p>
                        {row.context ? (
                          <p className="line-clamp-2 text-xs text-muted-foreground">{row.context}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setDraft({ ...row })}>
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
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{draft?.id != null ? 'Modifier le fait' : 'Nouveau fait'}</CardTitle>
                <CardDescription>
                  {draft
                    ? formatMonthDayLong(draft.month, draft.day)
                    : 'Date + titre + contexte.'}
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
                Clique sur « Modifier » ou « Nouveau fait » pour commencer.
              </p>
            ) : (
              <>
                <Field label="Date">
                  <Input
                    type="date"
                    value={monthDayToIso(draft.month, draft.day)}
                    onChange={(e) => {
                      if (!e.target.value) return
                      const { month, day } = isoToMonthDay(e.target.value)
                      setDraft({ ...draft, month, day })
                    }}
                  />
                </Field>
                <Field label="Titre (événement)">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Ex: Lancement de Wikipédia (2001)"
                  />
                </Field>
                <Field label="Contexte">
                  <Textarea
                    rows={4}
                    value={draft.context}
                    onChange={(e) => setDraft({ ...draft, context: e.target.value })}
                    placeholder="Pourquoi c’est intéressant pour Link…"
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
