'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarPlus, Download, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useAuthAccess } from '@/components/auth-context'
import { RetroplanningGantt } from '@/components/strategie/RetroplanningGantt'
import { RETROPLANNING_PLATFORMS, type RetroplanningCalendarEntry } from '@/lib/retroplanning-platforms'
import { getRetroplanningPlatformColor } from '@/lib/retroplanning-platform-colors'
import {
  defaultRetroplanningPdfFilename,
  exportStrategieRetroplanningPdf,
} from '@/lib/retroplanning-pdf'
import {
  buildRetroplanningSaveContent,
  getDefaultRetroplanningSaveName,
} from '@/lib/retroplanning-saves'
import {
  createRetroplanningSave,
  getRetroplanningSaveById,
  updateRetroplanningSave,
} from '@/lib/retroplanning-saves-storage'
import { SavedRecordLoadingBanner } from '@/components/ui/saved-record-loading-banner'
import { cn } from '@/lib/utils'

/** Durée par défaut entre date de début et date de fin (modifiable ensuite). */
const DEFAULT_OPERATION_DURATION_DAYS = 7

/** Grille alignée en-têtes / champs (desktop). */
const DRAFT_ROW_GRID =
  'grid grid-cols-1 md:grid-cols-[minmax(9.5rem,1fr)_minmax(12rem,2.5fr)_10.75rem_10.75rem_minmax(11.5rem,auto)_2.75rem] gap-3 md:gap-x-3 md:gap-y-2 md:items-end'

type DraftRow = {
  id: string
  platform: string
  operationName: string
  startDate: string
  endDate: string
}

function todayIso(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, (m ?? 1) - 1, d ?? 1)
  date.setDate(date.getDate() + days)
  const ny = date.getFullYear()
  const nm = String(date.getMonth() + 1).padStart(2, '0')
  const nd = String(date.getDate()).padStart(2, '0')
  return `${ny}-${nm}-${nd}`
}

function countInclusiveOperationDays(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate || endDate < startDate) return null
  const [sy, sm, sd] = startDate.split('-').map(Number)
  const [ey, em, ed] = endDate.split('-').map(Number)
  const start = new Date(sy, (sm ?? 1) - 1, sd ?? 1).getTime()
  const end = new Date(ey, (em ?? 1) - 1, ed ?? 1).getTime()
  return Math.round((end - start) / 86_400_000) + 1
}

type OperationRow = DraftRow & {
  /** Affichée dans le Gantt ; les modifications de la ligne se répercutent en direct. */
  inCalendar: boolean
}

function newOperationRow(): OperationRow {
  return { ...newDraftRow(), inCalendar: false }
}

function rowToCalendarEntry(row: OperationRow): RetroplanningCalendarEntry | null {
  const name = row.operationName.trim()
  if (!row.inCalendar || !name || !row.startDate || !row.endDate) return null
  if (row.endDate < row.startDate) return null
  return {
    id: row.id,
    platform: row.platform,
    operationName: name,
    startDate: row.startDate,
    endDate: row.endDate,
  }
}

function newDraftRow(): DraftRow {
  const start = todayIso()
  return {
    id: crypto.randomUUID(),
    platform: 'META',
    operationName: '',
    startDate: start,
    endDate: addDaysIso(start, DEFAULT_OPERATION_DURATION_DAYS),
  }
}

export function StrategieRetroplanningView() {
  const searchParams = useSearchParams()
  const retroIdFromUrl = searchParams.get('retro')
  const { userName } = useAuthAccess()

  const [operationRows, setOperationRows] = useState<OperationRow[]>(() => [newOperationRow()])
  const [rowError, setRowError] = useState<string | null>(null)

  const calendarEntries = useMemo(
    () =>
      operationRows
        .map(rowToCalendarEntry)
        .filter((entry): entry is RetroplanningCalendarEntry => entry !== null),
    [operationRows],
  )

  const [savedRetroId, setSavedRetroId] = useState<string | null>(null)
  const [savedRetroName, setSavedRetroName] = useState('')
  const [loadingRetro, setLoadingRetro] = useState(false)

  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfFileName, setPdfFileName] = useState(defaultRetroplanningPdfFilename)
  const [pdfClientName, setPdfClientName] = useState('')
  const [pdfComment, setPdfComment] = useState('')
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveNameInput, setSaveNameInput] = useState('')
  const [savingRetro, setSavingRetro] = useState(false)

  const personName = userName?.trim() || 'Utilisateur'

  const applyRetroContent = useCallback(
    (content: {
      entries: RetroplanningCalendarEntry[]
      documentComment?: string
      clientName?: string
    }) => {
      setOperationRows([
        ...content.entries.map((entry) => ({
          id: entry.id,
          platform: entry.platform,
          operationName: entry.operationName,
          startDate: entry.startDate,
          endDate: entry.endDate,
          inCalendar: true,
        })),
        newOperationRow(),
      ])
      setPdfComment(content.documentComment ?? '')
      setPdfClientName(content.clientName ?? '')
      setRowError(null)
    },
    [],
  )

  useEffect(() => {
    if (!retroIdFromUrl) return
    let cancelled = false
    setLoadingRetro(true)
    void getRetroplanningSaveById(retroIdFromUrl)
      .then((record) => {
        if (cancelled) return
        if (!record) {
          alert('Rétroplanning introuvable ou accès non autorisé.')
          return
        }
        applyRetroContent(record.content)
        setSavedRetroId(record.id)
        setSavedRetroName(record.name)
        setPdfFileName(`${record.name.replace(/\s+/g, '_')}.pdf`)
      })
      .catch((e) => {
        if (!cancelled) {
          alert(e instanceof Error ? e.message : 'Impossible de charger le rétroplanning.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingRetro(false)
      })
    return () => {
      cancelled = true
    }
  }, [retroIdFromUrl, applyRetroContent])

  const updateOperationRow = useCallback((id: string, patch: Partial<OperationRow>) => {
    setOperationRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        const next = { ...row, ...patch }
        if (patch.startDate !== undefined && patch.startDate) {
          next.endDate = addDaysIso(patch.startDate, DEFAULT_OPERATION_DURATION_DAYS)
        }
        return next
      }),
    )
    setRowError(null)
  }, [])

  const addOperationRow = useCallback(() => {
    setOperationRows((prev) => [...prev, newOperationRow()])
    setRowError(null)
  }, [])

  const removeOperationRow = useCallback((id: string) => {
    setOperationRows((prev) => {
      if (prev.length <= 1) return [newOperationRow()]
      return prev.filter((row) => row.id !== id)
    })
    setRowError(null)
  }, [])

  const addRowToCalendar = useCallback((row: OperationRow) => {
    const name = row.operationName.trim()
    if (!name) {
      setRowError('Indiquez un nom d’opération avant d’ajouter au calendrier.')
      return
    }
    if (!row.startDate || !row.endDate) {
      setRowError('Renseignez les dates de début et de fin.')
      return
    }
    if (row.endDate < row.startDate) {
      setRowError('La date de fin doit être postérieure ou égale à la date de début.')
      return
    }

    updateOperationRow(row.id, { inCalendar: true, operationName: name })
    setRowError(null)
  }, [updateOperationRow])

  const removeFromCalendar = useCallback((id: string) => {
    updateOperationRow(id, { inCalendar: false })
  }, [updateOperationRow])

  const openPdfDialog = useCallback(() => {
    if (calendarEntries.length === 0) {
      setRowError('Ajoutez au moins une opération au calendrier avant d’exporter le PDF.')
      return
    }
    setPdfFileName((prev) => prev || defaultRetroplanningPdfFilename())
    setPdfDialogOpen(true)
  }, [calendarEntries.length])

  const openSaveDialog = useCallback(() => {
    if (calendarEntries.length === 0) {
      setRowError('Ajoutez au moins une opération au calendrier avant de sauvegarder.')
      return
    }
    setSaveNameInput(
      savedRetroId && savedRetroName
        ? savedRetroName
        : getDefaultRetroplanningSaveName(calendarEntries.length),
    )
    setSaveDialogOpen(true)
  }, [calendarEntries.length, savedRetroId, savedRetroName])

  const handleConfirmPdf = useCallback(async () => {
    if (!pdfFileName.trim()) return
    setDownloadingPdf(true)
    try {
      await exportStrategieRetroplanningPdf({
        filename: pdfFileName.trim(),
        personName,
        clientName: pdfClientName,
        documentComment: pdfComment,
        entries: calendarEntries,
      })
      setPdfDialogOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Impossible de générer le PDF.')
    } finally {
      setDownloadingPdf(false)
    }
  }, [pdfFileName, personName, pdfClientName, pdfComment, calendarEntries])

  const handleConfirmSave = useCallback(async () => {
    const name = saveNameInput.trim()
    if (!name || calendarEntries.length === 0) return

    setSavingRetro(true)
    try {
      const content = buildRetroplanningSaveContent({
        entries: calendarEntries,
        documentComment: pdfComment,
        clientName: pdfClientName,
      })

      const record = savedRetroId
        ? await updateRetroplanningSave({
            id: savedRetroId,
            name,
            operationsCount: calendarEntries.length,
            content,
          })
        : await createRetroplanningSave({
            name,
            operationsCount: calendarEntries.length,
            content,
          })

      setSavedRetroId(record.id)
      setSavedRetroName(record.name)
      setSaveDialogOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Impossible de sauvegarder le rétroplanning.')
    } finally {
      setSavingRetro(false)
    }
  }, [saveNameInput, calendarEntries, pdfComment, pdfClientName, savedRetroId])

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[90rem] flex-col px-4 py-6 md:px-8 md:py-8">
      <header className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Stratégie — Rétroplanning</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Saisissez vos opérations par plateforme, visualisez le Gantt, exportez en PDF ou sauvegardez dans Mon
          espace.
        </p>
        {savedRetroId && !loadingRetro ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Rétroplanning chargé : <span className="font-medium text-foreground">{savedRetroName}</span>
          </p>
        ) : null}
      </header>

      {loadingRetro ? (
        <SavedRecordLoadingBanner
          className="mb-6 shrink-0"
          label="Chargement du rétroplanning…"
          description="Récupération de votre planning sauvegardé depuis Mon espace."
        />
      ) : null}

      <Card className={cn('mb-6 shrink-0 border-[#E94C16]/20', loadingRetro && 'pointer-events-none opacity-50')}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Saisie des opérations</CardTitle>
          <CardDescription>
            Chaque ligne reste modifiable après ajout au calendrier : le Gantt se met à jour en direct.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {operationRows.map((row, index) => {
            const operationDays = countInclusiveOperationDays(row.startDate, row.endDate)
            return (
            <div
              key={row.id}
              className={cn(
                'rounded-lg border bg-muted/20 p-3 md:p-3',
                DRAFT_ROW_GRID,
                row.inCalendar && 'border-[#E94C16]/35 bg-[#E94C16]/[0.04]',
              )}
            >
              <div className="space-y-1.5 min-w-0">
                <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:block">
                  Plateforme
                  {operationDays != null ? (
                    <span className="ml-1.5 normal-case font-semibold text-foreground">
                      · {operationDays} j
                    </span>
                  ) : null}
                </Label>
                <Select
                  value={row.platform}
                  onValueChange={(value) => updateOperationRow(row.id, { platform: value })}
                >
                  <SelectTrigger className="h-9 w-full bg-background">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: getRetroplanningPlatformColor(row.platform) }}
                        aria-hidden
                      />
                      <SelectValue placeholder="Plateforme" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {RETROPLANNING_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: getRetroplanningPlatformColor(platform) }}
                            aria-hidden
                          />
                          {platform}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:block">
                  Nom de l&apos;opération
                </Label>
                <Input
                  className="h-9 w-full bg-background"
                  placeholder="Ex. Lancement été"
                  value={row.operationName}
                  onChange={(e) => updateOperationRow(row.id, { operationName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 min-w-[10.75rem]">
                <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:block">
                  Date de début
                </Label>
                <Input
                  type="date"
                  className="h-9 w-full min-w-[10.75rem] bg-background px-2.5"
                  value={row.startDate}
                  onChange={(e) => updateOperationRow(row.id, { startDate: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 min-w-[10.75rem]">
                <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:block">
                  Date de fin
                </Label>
                <Input
                  type="date"
                  className="h-9 w-full min-w-[10.75rem] bg-background px-2.5"
                  value={row.endDate}
                  min={row.startDate}
                  onChange={(e) => updateOperationRow(row.id, { endDate: e.target.value })}
                />
              </div>

              {row.inCalendar ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 w-full whitespace-nowrap border-[#E94C16]/40 text-[#E94C16] hover:bg-[#E94C16]/10 md:w-auto"
                  onClick={() => removeFromCalendar(row.id)}
                >
                  Retirer du calendrier
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 w-full whitespace-nowrap bg-[#E94C16] hover:bg-[#d44314] text-white md:w-auto"
                  onClick={() => addRowToCalendar(row)}
                >
                  <CalendarPlus className="h-4 w-4 mr-1.5 shrink-0" />
                  Ajouter au calendrier
                </Button>
              )}

              <div className="flex md:justify-end">
                {operationRows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOperationRow(row.id)}
                    aria-label="Supprimer la ligne"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : index === operationRows.length - 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-dashed"
                    onClick={addOperationRow}
                    aria-label="Ajouter une ligne"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
            )
          })}

          {operationRows.length > 1 ? (
            <div className="flex justify-center pt-1">
              <Button type="button" variant="outline" size="sm" className="border-dashed" onClick={addOperationRow}>
                <Plus className="h-4 w-4 mr-1.5" />
                Ajouter une ligne
              </Button>
            </div>
          ) : null}

          {rowError ? (
            <p className="text-sm text-destructive font-medium" role="alert">
              {rowError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <section className={cn('flex min-h-0 flex-1 flex-col gap-3 pb-2', loadingRetro && 'pointer-events-none opacity-50')}>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Calendrier — Gantt</h2>
            <p className="text-sm text-muted-foreground">
              Visualisation chronologique des opérations ajoutées au calendrier.
            </p>
          </div>
          {calendarEntries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={openPdfDialog}>
                <Download className="h-4 w-4 mr-1.5" />
                Télécharger le PDF
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#E94C16] hover:bg-[#d44314] text-white"
                onClick={openSaveDialog}
              >
                <Save className="h-4 w-4 mr-1.5" />
                {savedRetroId ? 'Mettre à jour' : 'Sauvegarder'}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-[min(58vh,720px)] flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-muted/10 p-1">
          {calendarEntries.length > 0 ? (
            <RetroplanningGantt entries={calendarEntries} onRemove={removeFromCalendar} />
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground max-w-md">
                Aucune opération dans le calendrier. Complétez une ligne ci-dessus puis cliquez sur{' '}
                <span className="font-medium text-foreground">Ajouter au calendrier</span>.
              </p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le rétroplanning en PDF</DialogTitle>
            <DialogDescription>
              Le PDF reprend le diagramme de Gantt et la liste des opérations planifiées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-filename">Nom du fichier *</Label>
              <Input
                id="retro-pdf-filename"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                placeholder="Retroplanning.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-client">Nom client (optionnel)</Label>
              <Input
                id="retro-pdf-client"
                value={pdfClientName}
                onChange={(e) => setPdfClientName(e.target.value)}
                placeholder="Ex. Client X"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="retro-pdf-comment"
                value={pdfComment}
                onChange={(e) => setPdfComment(e.target.value)}
                rows={3}
                placeholder="Commentaire affiché en tête du PDF"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmPdf()}
              disabled={!pdfFileName.trim() || downloadingPdf}
              className="bg-[#E94C16] hover:bg-[#d44314] text-white"
            >
              {downloadingPdf ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {savedRetroId ? 'Mettre à jour le rétroplanning' : 'Sauvegarder le rétroplanning'}
            </DialogTitle>
            <DialogDescription>
              Le planning sera sauvegardé dans Mon espace. Seul vous pourrez y accéder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="save-retro-name">Nom du rétroplanning *</Label>
              <Input
                id="save-retro-name"
                value={saveNameInput}
                onChange={(e) => setSaveNameInput(e.target.value)}
                placeholder="Ex. Rétroplanning Client X"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmSave()}
              disabled={!saveNameInput.trim() || savingRetro}
              className="bg-[#E94C16] hover:bg-[#d44314] text-white"
            >
              {savingRetro ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savedRetroId ? 'Mettre à jour' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
