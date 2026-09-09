'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import supabase from '@/utils/supabase/client'

type WorldDayRow = {
  id: number
  month: number
  day: number
  label: string
}

type Draft = { id?: number; month: number; day: number; label: string }

const EMPTY_DRAFT = (): Draft => {
  const now = new Date()
  return { month: now.getMonth() + 1, day: now.getDate(), label: '' }
}

export function WorldDaysAdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<WorldDayRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('world_days')
        .select('*')
        .order('month', { ascending: true })
        .order('day', { ascending: true })
      if (error) throw error
      setRows(
        (data || []).map((row) => ({
          id: Number(row.id),
          month: Number(row.month),
          day: Number(row.day),
          label: String(row.label || ''),
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
      [`${row.day}/${row.month}`, row.label].join(' ').toLowerCase().includes(q)
    )
  }, [filter, rows])

  const saveDraft = async () => {
    if (!draft) return
    if (!draft.label.trim()) {
      toast({ title: 'Libellé obligatoire', variant: 'destructive' })
      return
    }
    if (draft.month < 1 || draft.month > 12 || draft.day < 1 || draft.day > 31) {
      toast({ title: 'Date invalide', variant: 'destructive' })
      return
    }
    const payload = {
      month: draft.month,
      day: draft.day,
      label: draft.label.trim(),
    }
    setSaving(true)
    try {
      if (draft.id != null) {
        const { error } = await supabase.from('world_days').update(payload).eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Journée mise à jour' })
      } else {
        const { error } = await supabase.from('world_days').insert(payload)
        if (error) throw error
        toast({ title: 'Journée ajoutée' })
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

  const removeRow = async (row: WorldDayRow) => {
    if (!window.confirm(`Supprimer « ${row.label} » (${row.day}/${row.month}) ?`)) return
    const { error } = await supabase.from('world_days').delete().eq('id', row.id)
    if (error) {
      toast({ title: 'Suppression impossible', description: error.message, variant: 'destructive' })
      return
    }
    if (draft?.id === row.id) setDraft(null)
    toast({ title: 'Journée supprimée' })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Ajoute ou corrige les journées mondiales affichées sur la Home.
        </p>
        <Button onClick={() => setDraft(EMPTY_DRAFT())} className="shrink-0">
          <Plus className="h-4 w-4" />
          Nouvelle journée
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle>Liste ({rows.length})</CardTitle>
            <CardDescription>Plusieurs libellés possibles le même jour.</CardDescription>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer (date ou libellé)…"
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
                Aucune journée trouvée.
              </p>
            ) : (
              <ul className="divide-y">
                {filtered.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {String(row.day).padStart(2, '0')}/{String(row.month).padStart(2, '0')}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{row.label}</p>
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
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{draft?.id != null ? 'Modifier' : 'Nouvelle journée'}</CardTitle>
                <CardDescription>Table `world_days`.</CardDescription>
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
                Clique sur « Modifier » ou « Nouvelle journée » pour commencer.
              </p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Jour">
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={draft.day}
                      onChange={(e) => setDraft({ ...draft, day: Number(e.target.value) || 1 })}
                    />
                  </Field>
                  <Field label="Mois">
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={draft.month}
                      onChange={(e) => setDraft({ ...draft, month: Number(e.target.value) || 1 })}
                    />
                  </Field>
                </div>
                <Field label="Libellé">
                  <Input
                    value={draft.label}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                    placeholder="Journée mondiale…"
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
