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

type BirthdayRow = {
  id: string
  name: string
  month: number
  day: number
}

type Draft = { id?: string; name: string; month: number; day: number }

const EMPTY_DRAFT = (): Draft => {
  const now = new Date()
  return { name: '', month: now.getMonth() + 1, day: now.getDate() }
}

export function BirthdaysAdminPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<BirthdayRow[]>([])
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('month', { ascending: true })
        .order('day', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      setRows(
        (data || []).map((row) => ({
          id: String(row.id),
          name: String(row.name || ''),
          month: Number(row.month),
          day: Number(row.day),
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
      [row.name, `${row.day}/${row.month}`].join(' ').toLowerCase().includes(q)
    )
  }, [filter, rows])

  const saveDraft = async () => {
    if (!draft) return
    if (!draft.name.trim()) {
      toast({ title: 'Le nom est obligatoire', variant: 'destructive' })
      return
    }
    if (draft.month < 1 || draft.month > 12 || draft.day < 1 || draft.day > 31) {
      toast({ title: 'Date invalide', variant: 'destructive' })
      return
    }
    const payload = {
      name: draft.name.trim(),
      month: draft.month,
      day: draft.day,
    }
    setSaving(true)
    try {
      if (draft.id) {
        const { error } = await supabase.from('birthdays').update(payload).eq('id', draft.id)
        if (error) throw error
        toast({ title: 'Anniversaire mis à jour' })
      } else {
        const { error } = await supabase.from('birthdays').insert(payload)
        if (error) throw error
        toast({ title: 'Anniversaire ajouté' })
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

  const removeRow = async (row: BirthdayRow) => {
    if (!window.confirm(`Supprimer l’anniversaire de ${row.name} ?`)) return
    const { error } = await supabase.from('birthdays').delete().eq('id', row.id)
    if (error) {
      toast({ title: 'Suppression impossible', description: error.message, variant: 'destructive' })
      return
    }
    if (draft?.id === row.id) setDraft(null)
    toast({ title: 'Anniversaire supprimé' })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Ajoute quelqu’un (prénom / nom + date) pour l’afficher sur la Home le jour J.
        </p>
        <Button onClick={() => setDraft(EMPTY_DRAFT())} className="shrink-0">
          <Plus className="h-4 w-4" />
          Ajouter quelqu’un
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle>Liste ({rows.length})</CardTitle>
            <CardDescription>Anniversaires récurrents chaque année.</CardDescription>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer par nom ou date…"
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
                Aucun anniversaire trouvé.
              </p>
            ) : (
              <ul className="divide-y">
                {filtered.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium">{row.name}</p>
                      <Badge variant="outline">
                        {String(row.day).padStart(2, '0')}/{String(row.month).padStart(2, '0')}
                      </Badge>
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
                <CardTitle>{draft?.id ? 'Modifier' : 'Ajouter quelqu’un'}</CardTitle>
                <CardDescription>Table `birthdays`.</CardDescription>
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
                Clique sur « Ajouter quelqu’un » ou « Modifier » pour commencer.
              </p>
            ) : (
              <>
                <Field label="Nom">
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Prénom Nom"
                  />
                </Field>
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
