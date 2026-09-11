'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { UpcomingAdminPreview } from '@/components/mon-espace/UpcomingAdminPreview'
import { useToast } from '@/hooks/use-toast'
import { formatNextRotationPlayLabel } from '@/lib/admin-list-dates'
import {
  getUpcomingPreviewDays,
  pickByCycleRotation,
} from '@/lib/admin-upcoming-preview'
import { todayIsoLocal } from '@/lib/date-local'
import { stripAccentsUpper } from '@/lib/motus'
import supabase from '@/utils/supabase/client'

type MotusWordRow = {
  id: string
  sort_order: number
  word: string
  is_active: boolean
}

type Draft = { id?: string; sort_order: number; word: string; is_active: boolean }

export function MotusAdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<MotusWordRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const todayIso = useMemo(() => todayIsoLocal(), [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('motus_words')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      setRows(
        (data || []).map((row) => ({
          id: String(row.id),
          sort_order: Number(row.sort_order),
          word: String(row.word || ''),
          is_active: Boolean(row.is_active),
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

  const activeOrdered = useMemo(
    () => rows.filter((row) => row.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [rows]
  )

  const rotationIndexById = useMemo(() => {
    const map = new Map<string, number>()
    activeOrdered.forEach((row, index) => map.set(row.id, index))
    return map
  }, [activeOrdered])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const base = q
      ? rows.filter((row) => row.word.toLowerCase().includes(q))
      : rows

    return [...base].sort((a, b) => {
      const aActive = a.is_active ? 0 : 1
      const bActive = b.is_active ? 0 : 1
      if (aActive !== bActive) return aActive - bActive
      const aIdx = rotationIndexById.get(a.id)
      const bIdx = rotationIndexById.get(b.id)
      const aNext =
        aIdx != null ? formatNextRotationPlayLabel(aIdx, activeOrdered.length, todayIso) : null
      const bNext =
        bIdx != null ? formatNextRotationPlayLabel(bIdx, activeOrdered.length, todayIso) : null
      if (aNext && bNext) return aNext.iso.localeCompare(bNext.iso)
      if (aNext) return -1
      if (bNext) return 1
      return a.sort_order - b.sort_order
    })
  }, [filter, rows, rotationIndexById, activeOrdered.length, todayIso])

  const openCreate = () => {
    const nextOrder = rows.reduce((max, row) => Math.max(max, row.sort_order), 0) + 1
    setDraft({ sort_order: nextOrder, word: '', is_active: true })
  }

  const saveDraft = async () => {
    if (!draft) return
    const word = stripAccentsUpper(draft.word)
    if (word.length < 5 || word.length > 8) {
      toast({
        title: 'Mot invalide',
        description: 'Le mot doit faire entre 5 et 8 lettres (A–Z).',
        variant: 'destructive',
      })
      return
    }
    const payload = {
      sort_order: draft.sort_order,
      word,
      is_active: draft.is_active,
    }
    setSaving(true)
    try {
      if (draft.id) {
        const { error } = await supabase.from('motus_words').update(payload).eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Mot mis à jour' })
      } else {
        const { error } = await supabase.from('motus_words').insert(payload)
        if (error) throw error
        toast({ title: 'Mot ajouté' })
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

  const removeRow = async (row: MotusWordRow) => {
    if (
      !window.confirm(
        `Supprimer le mot « ${row.word} » ?\nLes suivants seront décalés pour ne pas laisser de trou dans la rotation.`
      )
    ) {
      return
    }
    setSaving(true)
    try {
      const deletedOrder = row.sort_order
      const { error } = await supabase.from('motus_words').delete().eq('id', row.id)
      if (error) throw error

      const toShift = rows
        .filter((r) => r.id !== row.id && r.sort_order > deletedOrder)
        .sort((a, b) => a.sort_order - b.sort_order)

      for (const item of toShift) {
        const { error: shiftError } = await supabase
          .from('motus_words')
          .update({ sort_order: item.sort_order - 1 })
          .eq('id', item.id)
        if (shiftError) throw shiftError
      }

      if (draft?.id === row.id) setDraft(null)
      toast({
        title: 'Mot supprimé',
        description:
          toShift.length > 0 ? `${toShift.length} mot(s) décalé(s) dans la rotation.` : undefined,
      })
      await load()
    } catch (err) {
      toast({
        title: 'Suppression impossible',
        description: err instanceof Error ? err.message : 'Erreur Supabase',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const upcomingSlots = useMemo(() => {
    return getUpcomingPreviewDays(2).map((day) => {
      const row = pickByCycleRotation(activeOrdered, day.cycleDay)
      return {
        day,
        content: row ? (
          <div className="space-y-1.5">
            <p className="font-medium tracking-wide">
              {row.word}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({row.word.length} lettres)
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              1ʳᵉ lettre : <strong className="text-foreground">{row.word.slice(0, 1)}</strong>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-7"
              onClick={() =>
                setDraft({
                  id: row.id,
                  sort_order: row.sort_order,
                  word: row.word,
                  is_active: row.is_active,
                })
              }
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun mot actif.</p>
        ),
      }
    })
  }, [activeOrdered])

  return (
    <div className="space-y-4">
      <UpcomingAdminPreview slots={upcomingSlots} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Mots 5–8 lettres. Diffusion les jours ouvrés uniquement (week-end : reviens lundi).
        </p>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nouveau mot
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle>Liste ({rows.length})</CardTitle>
            <CardDescription>Date = prochaine diffusion. Aujourd’hui en tête.</CardDescription>
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
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">Aucun mot.</p>
            ) : (
              <ul className="divide-y">
                {filtered.map((row) => {
                  const idx = rotationIndexById.get(row.id)
                  const next =
                    idx != null
                      ? formatNextRotationPlayLabel(idx, activeOrdered.length, todayIso)
                      : null
                  const isToday = Boolean(next?.isToday)
                  return (
                    <li
                      key={row.id}
                      className={
                        isToday
                          ? 'flex flex-col gap-3 bg-[#E94C16]/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
                          : 'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
                      }
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {next ? (
                          <Badge
                            variant="outline"
                            className={
                              isToday
                                ? 'border-[#E94C16]/40 bg-[#E94C16]/10 capitalize text-[#E94C16]'
                                : 'capitalize'
                            }
                          >
                            {next.shortLabel}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                        {isToday ? (
                          <Badge className="bg-[#E94C16] text-white hover:bg-[#E94C16]">
                            Aujourd’hui
                          </Badge>
                        ) : null}
                        <p className="font-semibold tracking-wide">{row.word}</p>
                        <span className="text-xs text-muted-foreground">
                          {row.word.length} lettres
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDraft({
                              id: row.id,
                              sort_order: row.sort_order,
                              word: row.word,
                              is_active: row.is_active,
                            })
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          disabled={saving}
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
                <CardTitle>{draft?.id ? 'Modifier le mot' : 'Nouveau mot'}</CardTitle>
                <CardDescription>Ajouté à la fin de la rotation.</CardDescription>
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
                Clique sur « Nouveau mot » ou « Modifier » pour commencer.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Mot (5–8 lettres)</Label>
                  <Input
                    value={draft.word}
                    onChange={(e) => setDraft({ ...draft, word: e.target.value })}
                    className="uppercase tracking-widest"
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">Actif</p>
                    <p className="text-xs text-muted-foreground">Inclus dans la rotation.</p>
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
