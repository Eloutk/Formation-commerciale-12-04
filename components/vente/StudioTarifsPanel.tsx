'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  STUDIO_TARIFS_ROWS,
  STUDIO_TARIFS_SECTIONS,
  STUDIO_TARIFS_VALIDATION_NOTE,
  computeStudioTarifsGrid,
  createInitialStudioTarifsState,
  formatStudioEuro,
  formatStudioPrestationLabel,
  getStudioTarifsSelectionBlockReason,
  getStudioTarifsRequiredRows,
  parseStudioQuantity,
  type StudioTarifsRow,
  type StudioTarifsSectionId,
  type StudioTarifsSelectionState,
} from '@/lib/studio-tarifs-grid'
import {
  buildStudioTarifsSaveContent,
  getDefaultStudioTarifsSaveName,
  type StudioTarifsSaveContent,
} from '@/lib/studio-tarifs-saves'
import {
  getStudioBudgetRequestHref,
  sendStudioBudgetRequest,
  STUDIO_VIDEO_BUDGET_MONDAY_URL,
  usesStudioBudgetSlackRequest,
} from '@/lib/studio-budget-request'
import {
  createStudioTarifsSave,
  getStudioTarifsSaveById,
  updateStudioTarifsSave,
} from '@/lib/studio-tarifs-saves-storage'
import { VENTE2_STUDIO_TARIFS_HREF } from '@/lib/nav-config'
import { formatUserRoleLabel } from '@/lib/roles'
import { useAuthAccess } from '@/components/auth-context'
import { Clapperboard, ChevronDown, ChevronUp, Download, ExternalLink, ImageIcon, Loader2, PenTool, Palette, RotateCcw, Save, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { downloadStudioTarifsPdf } from '@/components/vente/StudioTarifsPdfDocument'
import { buildStudioTarifsPdfLine } from '@/lib/studio-tarifs-pdf-lines'

const STUDIO_SECTION_ICONS: Record<StudioTarifsSectionId, LucideIcon> = {
  video: Clapperboard,
  graphisme: PenTool,
  fixe: ImageIcon,
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      />
      <path
        fill="#36C5F0"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      />
      <path
        fill="#2EB67D"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      />
      <path
        fill="#ECB22E"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.528 2.528 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    </svg>
  )
}

function sanitizeStudioPdfFilename(name: string): string {
  const withoutExtension = name.trim().replace(/\.pdf$/i, '')
  const sanitized = withoutExtension
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_\s]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return sanitized || 'devis-studio'
}

function MultilineText({ text }: { text: string }) {
  const parts = text.split('\n').filter(Boolean)
  if (parts.length <= 1) return <span>{text}</span>
  return (
    <span className="block space-y-1">
      {parts.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </span>
  )
}

function PrestationCell({ row }: { row: StudioTarifsRow }) {
  return (
    <div className="space-y-0.5">
      <span className="font-medium text-foreground">{row.label}</span>
      {row.variant ? (
        <span className="block text-sm text-foreground/70">{row.variant}</span>
      ) : null}
    </div>
  )
}

function createSectionBudgetRequestRow(sectionId: StudioTarifsSectionId): StudioTarifsRow {
  const sectionLabel =
    STUDIO_TARIFS_SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId
  return {
    id: `demande-budget-${sectionId}`,
    sectionId,
    label: sectionLabel,
    explanation: '',
    kind: 'on_demand',
  }
}

function formatStudioQuantityValue(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value)
}

function StudioQuantityInput({
  value,
  onChange,
  disabled,
  label,
  className,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  label: string
  className?: string
}) {
  const adjust = (delta: number) => {
    const parsed = parseStudioQuantity(value)
    const current = parsed > 0 ? parsed : 1
    const next = Math.max(1, current + delta)
    onChange(formatStudioQuantityValue(next))
  }

  const parsed = parseStudioQuantity(value)
  const canDecrease = !disabled && (parsed > 1 || value.trim() === '')

  return (
    <div
      className={cn(
        'flex h-9 items-stretch overflow-hidden rounded-md border border-border bg-background',
        disabled && 'opacity-60',
        className,
      )}
    >
      <Input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 text-center tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label={label}
      />
      <div className="flex w-3.5 shrink-0 flex-col border-l border-border">
        <button
          type="button"
          className="flex flex-1 items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          onClick={() => adjust(1)}
          disabled={disabled}
          aria-label={`Augmenter ${label}`}
        >
          <ChevronUp className="h-2.5 w-2.5" aria-hidden />
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center border-t border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          onClick={() => adjust(-1)}
          disabled={!canDecrease}
          aria-label={`Diminuer ${label}`}
        >
          <ChevronDown className="h-2.5 w-2.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function StudioSummaryOnDemandLabel({
  row,
  onSlackRequest,
}: {
  row: StudioTarifsRow
  onSlackRequest: (row: StudioTarifsRow) => void
}) {
  const mondayHref = getStudioBudgetRequestHref(row)
  const className =
    'shrink-0 text-sm font-semibold tabular-nums text-[#E94C16] underline-offset-2 hover:underline'

  if (mondayHref) {
    return (
      <a
        href={mondayHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title="Ouvrir l’approche budgétaire vidéo (Monday)"
      >
        Sur demande
      </a>
    )
  }

  if (usesStudioBudgetSlackRequest(row)) {
    return (
      <button
        type="button"
        onClick={() => onSlackRequest(row)}
        className={className}
        title="Demander une approche budgétaire (Slack)"
      >
        Sur demande
      </button>
    )
  }

  return <span className={className}>Sur demande</span>
}

function formatStudioSummaryQuantity(row: StudioTarifsRow, quantity: number): string | null {
  if (row.kind !== 'priced' || quantity <= 0) return null
  return Number.isInteger(quantity)
    ? String(quantity)
    : quantity.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
}

type StudioTarifsTableProps = {
  sectionId: StudioTarifsSectionId
  lines: ReturnType<typeof computeStudioTarifsGrid>['lines']
  state: StudioTarifsSelectionState
  onToggle: (id: string, checked: boolean) => void
  onQuantityChange: (id: string, value: string) => void
}

function StudioTarifsTable({
  sectionId,
  lines,
  state,
  onToggle,
  onQuantityChange,
}: StudioTarifsTableProps) {
  const sectionLines = lines.filter((line) => line.row.sectionId === sectionId)
  if (sectionLines.length === 0) return null

  return (
    <>
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b-2 border-border bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800">
              <TableHead className="w-10 max-w-10 border-r border-border/60 px-1 text-center text-xs font-semibold text-foreground">
                Besoin
              </TableHead>
              <TableHead className="min-w-[180px] border-r border-border/60 font-semibold text-foreground">
                Prestation
              </TableHead>
              <TableHead className="w-[60px] border-r border-border/60 font-semibold text-foreground">
                Nombre
              </TableHead>
              <TableHead className="min-w-[220px] border-r border-border/60 font-semibold text-foreground">
                Explication
              </TableHead>
              <TableHead className="min-w-[160px] font-semibold text-foreground">
                Conditions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectionLines.map(({ row, selected }, index) => {
              const entry = state[row.id]!
              const isPriced = row.kind === 'priced'
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    'border-border hover:bg-muted/40',
                    index % 2 === 1 && 'bg-muted/20',
                    selected && 'bg-[#E94C16]/10 hover:bg-[#E94C16]/12',
                  )}
                >
                  <TableCell className="w-10 max-w-10 px-1 text-center border-r border-border/50">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => onToggle(row.id, checked === true)}
                        aria-label={`Sélectionner ${row.label}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="border-r border-border/50">
                    <PrestationCell row={row} />
                  </TableCell>
                  <TableCell className="border-r border-border/50">
                    {isPriced ? (
                      <StudioQuantityInput
                        value={entry.quantity}
                        onChange={(nextValue) => onQuantityChange(row.id, nextValue)}
                        disabled={!selected}
                        label={`Quantité pour ${row.label}`}
                        className="w-[3rem]"
                      />
                    ) : (
                      <span className="text-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="border-r border-border/50 text-sm text-foreground/80">
                    <MultilineText text={row.explanation} />
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80">
                    {row.conditions ? <MultilineText text={row.conditions} /> : '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {sectionLines.map(({ row, selected }) => {
          const entry = state[row.id]!
          const isPriced = row.kind === 'priced'
          return (
            <Card
              key={row.id}
              className={cn(
                'border-border bg-card shadow-sm',
                selected && 'border-[#E94C16]/50 bg-[#E94C16]/10',
              )}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected}
                    onCheckedChange={(checked) => onToggle(row.id, checked === true)}
                    aria-label={`Sélectionner ${row.label}`}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <PrestationCell row={row} />
                    {row.explanation ? (
                      <p className="text-sm text-foreground/80">
                        <MultilineText text={row.explanation} />
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="rounded-md border border-border/70 bg-muted/30 p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      Nombre
                    </p>
                    {isPriced ? (
                      <StudioQuantityInput
                        value={entry.quantity}
                        onChange={(nextValue) => onQuantityChange(row.id, nextValue)}
                        disabled={!selected}
                        label={`Quantité pour ${row.label}`}
                        className="w-full max-w-[8rem]"
                      />
                    ) : (
                      <span className="text-foreground/50">—</span>
                    )}
                  </div>
                  {row.conditions ? (
                    <div className="col-span-2 rounded-md border border-border/70 bg-muted/30 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/70">
                        Conditions
                      </p>
                      <p className="text-foreground/80">
                        <MultilineText text={row.conditions} />
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}

export function StudioTarifsPanel() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Chargement des tarifs studio…
        </div>
      }
    >
      <StudioTarifsPanelInner />
    </Suspense>
  )
}

function StudioTarifsPanelInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { role, userName } = useAuthAccess()
  const studioIdFromUrl = searchParams.get('studio')

  const [activeSection, setActiveSection] = useState<StudioTarifsSectionId>('video')
  const [state, setState] = useState<StudioTarifsSelectionState>(() =>
    createInitialStudioTarifsState(),
  )
  const [savedId, setSavedId] = useState<string | null>(null)
  const [savedName, setSavedName] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveNameInput, setSaveNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [comment, setComment] = useState('')
  const [exportingPdf, setExportingPdf] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfFileNameInput, setPdfFileNameInput] = useState('')
  const [budgetRequestDialogOpen, setBudgetRequestDialogOpen] = useState(false)
  const [budgetRequestSectionId, setBudgetRequestSectionId] =
    useState<StudioTarifsSectionId>('graphisme')
  const [budgetRequestRow, setBudgetRequestRow] = useState<StudioTarifsRow | null>(null)
  const [budgetNeedDescription, setBudgetNeedDescription] = useState('')
  const [budgetAttachment, setBudgetAttachment] = useState<File | null>(null)
  const [submittingBudgetRequest, setSubmittingBudgetRequest] = useState(false)
  const [selectionBlockedDialogOpen, setSelectionBlockedDialogOpen] = useState(false)
  const [selectionBlockedDialogRow, setSelectionBlockedDialogRow] =
    useState<StudioTarifsRow | null>(null)
  const [selectionBlockedDialogMessage, setSelectionBlockedDialogMessage] = useState('')
  const [selectionBlockedRequiredIds, setSelectionBlockedRequiredIds] = useState<string[]>([])

  const computed = useMemo(() => computeStudioTarifsGrid(state), [state])
  const selectedSummaryBySection = useMemo(
    () =>
      STUDIO_TARIFS_SECTIONS.map((section) => {
        const lines = computed.lines.filter(
          ({ selected, linePrice, row }) =>
            row.sectionId === section.id &&
            selected &&
            (linePrice > 0 || row.kind === 'on_demand'),
        )
        const subtotal = lines.reduce(
          (sum, { linePrice, row }) => (row.kind === 'on_demand' ? sum : sum + linePrice),
          0,
        )
        return { section, lines, subtotal }
      }).filter((group) => group.lines.length > 0),
    [computed.lines],
  )
  const activeSectionMeta = STUDIO_TARIFS_SECTIONS.find((section) => section.id === activeSection)
  const activeSectionLineCount = STUDIO_TARIFS_ROWS.filter(
    (row) => row.sectionId === activeSection,
  ).length
  const slackBudgetSections = useMemo(
    () => ['graphisme', 'fixe'] as const satisfies readonly StudioTarifsSectionId[],
    [],
  )
  const slackBudgetRowsForDialog = useMemo(
    () =>
      STUDIO_TARIFS_ROWS.filter(
        (row) =>
          row.sectionId === budgetRequestSectionId && usesStudioBudgetSlackRequest(row),
      ),
    [budgetRequestSectionId],
  )

  const onToggle = (id: string, checked: boolean) => {
    const row = STUDIO_TARIFS_ROWS.find((entry) => entry.id === id)
    if (checked && row) {
      const blockReason = getStudioTarifsSelectionBlockReason(row, state)
      if (blockReason) {
        setSelectionBlockedDialogRow(row)
        setSelectionBlockedDialogMessage(blockReason)
        setSelectionBlockedRequiredIds(
          (row.requiresAnySelected ?? []).filter((id) => state[id]?.selected),
        )
        setSelectionBlockedDialogOpen(true)
        return
      }
    }

    setState((current) => {
      const entry = current[id]!
      const quantity =
        checked && !entry.quantity.trim() ? '1' : entry.quantity
      const next: StudioTarifsSelectionState = {
        ...current,
        [id]: { ...entry, selected: checked, quantity },
      }

      if (!checked) {
        for (const dependent of STUDIO_TARIFS_ROWS) {
          if (!dependent.requiresAnySelected?.includes(id)) continue
          const dependentEntry = next[dependent.id]
          if (!dependentEntry?.selected) continue
          if (getStudioTarifsSelectionBlockReason(dependent, next)) {
            next[dependent.id] = { ...dependentEntry, selected: false }
          }
        }
      }

      return next
    })
  }

  const onQuantityChange = (id: string, value: string) => {
    setState((current) => ({
      ...current,
      [id]: { ...current[id]!, quantity: value },
    }))
  }

  const closeSelectionBlockedDialog = () => {
    setSelectionBlockedDialogOpen(false)
    setSelectionBlockedDialogRow(null)
    setSelectionBlockedDialogMessage('')
    setSelectionBlockedRequiredIds([])
  }

  const toggleSelectionBlockedRequired = (id: string, checked: boolean) => {
    setSelectionBlockedRequiredIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((entryId) => entryId !== id),
    )
  }

  const handleConfirmSelectionBlockedDialog = () => {
    if (!selectionBlockedDialogRow) return

    const requiredIds = selectionBlockedDialogRow.requiresAnySelected ?? []
    if (requiredIds.length > 0 && selectionBlockedRequiredIds.length === 0) {
      alert('Cochez au moins une prestation Créa - Fixe associée.')
      return
    }

    setState((current) => {
      const next: StudioTarifsSelectionState = { ...current }

      for (const id of requiredIds) {
        const entry = next[id]
        if (!entry) continue
        const shouldSelect = selectionBlockedRequiredIds.includes(id)
        const quantity = shouldSelect && !entry.quantity.trim() ? '1' : entry.quantity
        next[id] = { ...entry, selected: shouldSelect, quantity }
      }

      const blockedEntry = next[selectionBlockedDialogRow.id]
      if (blockedEntry && selectionBlockedRequiredIds.length > 0) {
        const quantity = !blockedEntry.quantity.trim() ? '1' : blockedEntry.quantity
        next[selectionBlockedDialogRow.id] = {
          ...blockedEntry,
          selected: true,
          quantity,
        }
      }

      return next
    })

    closeSelectionBlockedDialog()
  }

  const openRowBudgetRequestDialog = (row: StudioTarifsRow) => {
    if (!usesStudioBudgetSlackRequest(row)) return
    setBudgetRequestSectionId(row.sectionId)
    setBudgetRequestRow(row)
    setBudgetNeedDescription('')
    setBudgetAttachment(null)
    setBudgetRequestDialogOpen(true)
  }

  const openSectionBudgetRequestDialog = () => {
    const section =
      activeSection === 'graphisme' || activeSection === 'fixe'
        ? activeSection
        : 'graphisme'
    const rows = STUDIO_TARIFS_ROWS.filter(
      (row) => row.sectionId === section && usesStudioBudgetSlackRequest(row),
    )
    setBudgetRequestSectionId(section)
    setBudgetRequestRow(rows[0] ?? createSectionBudgetRequestRow(section))
    setBudgetNeedDescription('')
    setBudgetAttachment(null)
    setBudgetRequestDialogOpen(true)
  }

  const handleBudgetRequestSectionChange = (sectionId: StudioTarifsSectionId) => {
    const rows = STUDIO_TARIFS_ROWS.filter(
      (row) => row.sectionId === sectionId && usesStudioBudgetSlackRequest(row),
    )
    setBudgetRequestSectionId(sectionId)
    setBudgetRequestRow(rows[0] ?? createSectionBudgetRequestRow(sectionId))
  }

  const closeBudgetRequestDialog = () => {
    if (submittingBudgetRequest) return
    setBudgetRequestDialogOpen(false)
    setBudgetRequestRow(null)
    setBudgetNeedDescription('')
    setBudgetAttachment(null)
  }

  const handleConfirmBudgetRequest = async () => {
    if (!budgetRequestRow || submittingBudgetRequest) return

    setSubmittingBudgetRequest(true)
    try {
      await sendStudioBudgetRequest({
        row: budgetRequestRow,
        needDescription: budgetNeedDescription,
        attachment: budgetAttachment,
        userName,
      })
      alert('Demande envoyée aux créas sur Slack (#demande-studio).')
      setBudgetRequestDialogOpen(false)
      setBudgetRequestRow(null)
      setBudgetNeedDescription('')
      setBudgetAttachment(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de l’envoi de la demande.')
    } finally {
      setSubmittingBudgetRequest(false)
    }
  }

  const resetSelection = () => {
    setState(createInitialStudioTarifsState())
    setComment('')
    setSavedId(null)
    setSavedName('')
    router.replace(VENTE2_STUDIO_TARIFS_HREF, { scroll: false })
  }

  const applySavedContent = useCallback(
    (content: StudioTarifsSaveContent, name: string, id: string) => {
      setState(content.state)
      setActiveSection(content.activeSection)
      setComment(content.comment ?? '')
      setSavedId(id)
      setSavedName(name)
    },
    [],
  )

  useEffect(() => {
    if (!studioIdFromUrl) return
    let cancelled = false
    setLoadingSave(true)
    void getStudioTarifsSaveById(studioIdFromUrl)
      .then((record) => {
        if (cancelled || !record) return
        applySavedContent(record.content, record.name, record.id)
      })
      .catch((error) => {
        if (!cancelled) {
          alert(error instanceof Error ? error.message : 'Impossible de charger le devis studio.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSave(false)
      })
    return () => {
      cancelled = true
    }
  }, [studioIdFromUrl, applySavedContent])

  const handleOpenSaveDialog = () => {
    if (computed.selectedCount === 0) {
      alert('Sélectionnez au moins une prestation avant d’enregistrer.')
      return
    }
    setSaveNameInput(
      savedName ||
        getDefaultStudioTarifsSaveName({
          selectedCount: computed.selectedCount,
          totalHT: computed.subtotalJ,
        }),
    )
    setSaveDialogOpen(true)
  }

  const handleOpenPdfDialog = () => {
    if (computed.selectedCount === 0) {
      alert('Sélectionnez au moins une prestation avant de télécharger le PDF.')
      return
    }
    setPdfFileNameInput(
      savedName.trim() ||
        getDefaultStudioTarifsSaveName({
          selectedCount: computed.selectedCount,
          totalHT: computed.subtotalJ,
        }),
    )
    setPdfDialogOpen(true)
  }

  const handleConfirmDownloadPdf = async () => {
    const displayTitle = pdfFileNameInput.trim() || 'Devis studio — Tarifs PDV'
    const safeName = sanitizeStudioPdfFilename(displayTitle)
    const date = new Date().toISOString().split('T')[0]

    setExportingPdf(true)
    try {
      await downloadStudioTarifsPdf({
        title: displayTitle,
        dateLabel: new Date().toLocaleDateString('fr-FR'),
        userName: userName?.trim() || undefined,
        comment: comment.trim() || undefined,
        sections: selectedSummaryBySection.map(({ section, lines, subtotal }) => ({
          label: section.label,
          subtotalLabel: subtotal > 0 ? formatStudioEuro(subtotal) : null,
          lines: lines.map(({ row, linePrice, quantity }) =>
            buildStudioTarifsPdfLine({
              row,
              quantity,
              linePrice,
              subtotalI: computed.subtotalI,
            }),
          ),
        })),
        totalHtLabel: formatStudioEuro(computed.subtotalJ),
        totalTtcLabel: formatStudioEuro(computed.ttc),
        filename: `${safeName}-${date}.pdf`,
      })
      setPdfDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la génération du PDF.')
    } finally {
      setExportingPdf(false)
    }
  }

  const handleConfirmSave = async () => {
    const name = saveNameInput.trim()
    if (!name) return

    setSaving(true)
    try {
      const content = buildStudioTarifsSaveContent({ state, activeSection, comment })
      const wasUpdate = !!savedId
      const record = savedId
        ? await updateStudioTarifsSave({
            id: savedId,
            name,
            summaryTotalHt: computed.subtotalJ,
            summaryTotalTtc: computed.ttc,
            selectedCount: computed.selectedCount,
            content,
          })
        : await createStudioTarifsSave({
            name,
            summaryTotalHt: computed.subtotalJ,
            summaryTotalTtc: computed.ttc,
            selectedCount: computed.selectedCount,
            content,
          })

      setSavedId(record.id)
      setSavedName(record.name)
      setSaveDialogOpen(false)
      router.replace(`${VENTE2_STUDIO_TARIFS_HREF}?studio=${record.id}`, { scroll: false })
      alert(wasUpdate ? 'Devis studio mis à jour dans Mon espace.' : 'Devis studio enregistré dans Mon espace.')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de l’enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1520px] px-6 py-6 md:px-8 md:py-10 lg:px-10">
      <div className="w-full">
        <div className="mb-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Palette className="h-8 w-8 text-[#E94C16]" aria-hidden />
            <Badge variant="secondary" className="text-xs">
              {formatUserRoleLabel(role)}
            </Badge>
          </div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Calculateur Vente 2 — Tarifs studio</h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
            Grille PDV studio Link Academy — cochez les prestations, saisissez les quantités et
            obtenez un total HT/TTC conforme à la grille de référence.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{STUDIO_TARIFS_VALIDATION_NOTE}</p>
        </div>

        {loadingSave ? (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Chargement du devis enregistré…
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_540px]">
          {/* Colonne gauche — grille tarifaire */}
          <div className="space-y-4 min-w-0">
            <Tabs
              value={activeSection}
              onValueChange={(value) => setActiveSection(value as StudioTarifsSectionId)}
              className="w-full"
            >
              <TabsList className="grid h-auto w-full grid-cols-1 gap-1 border-2 border-gray-300 p-1 sm:grid-cols-3">
                {STUDIO_TARIFS_SECTIONS.map(({ id, label }) => {
                  const Icon = STUDIO_SECTION_ICONS[id]
                  return (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className="h-auto min-h-10 gap-2 px-3 py-2.5 data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="text-sm font-medium">{label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            <section aria-labelledby={`studio-section-${activeSection}`}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-[#E94C16]" aria-hidden />
                <h2
                  id={`studio-section-${activeSection}`}
                  className="text-xl font-semibold tracking-tight"
                >
                  {activeSectionMeta?.label}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {activeSectionLineCount} lignes
                </Badge>
              </div>
              <StudioTarifsTable
                sectionId={activeSection}
                lines={computed.lines}
                state={state}
                onToggle={onToggle}
                onQuantityChange={onQuantityChange}
              />
            </section>
          </div>

          {/* Colonne droite — synthèse devis, sticky comme social-media */}
          <div className="min-w-0 lg:w-[500px] xl:w-[540px]">
            <div className="space-y-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Palette className="h-4 w-4 text-[#E94C16]" aria-hidden />
                        Synthèse devis
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-xs leading-relaxed">
                        {savedId ? (
                          <>
                            Enregistré : « {savedName} »
                            {computed.selectedCount > 0
                              ? ` — ${computed.selectedCount} prestation${computed.selectedCount > 1 ? 's' : ''}`
                              : ''}
                          </>
                        ) : computed.selectedCount > 0 ? (
                          `${computed.selectedCount} prestation${computed.selectedCount > 1 ? 's' : ''} sélectionnée${computed.selectedCount > 1 ? 's' : ''}`
                        ) : (
                          'Aucune prestation sélectionnée'
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end">
                      <Button
                        asChild
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-auto whitespace-normal px-2.5 py-1.5 text-[11px] leading-tight"
                      >
                        <a
                          href={STUDIO_VIDEO_BUDGET_MONDAY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1.5 inline h-3 w-3" aria-hidden />
                          Approche budg. vidéo
                        </a>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-auto whitespace-normal px-2.5 py-1.5 text-[11px] leading-tight"
                        disabled={submittingBudgetRequest}
                        onClick={openSectionBudgetRequestDialog}
                      >
                        {submittingBudgetRequest ? (
                          <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin" aria-hidden />
                        ) : (
                          <SlackIcon className="mr-1.5 inline h-3 w-3" />
                        )}
                        Approche budg. graphisme/fixe
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSummaryBySection.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSummaryBySection.map(({ section, lines, subtotal }) => {
                        const SectionIcon = STUDIO_SECTION_ICONS[section.id]
                        return (
                          <div
                            key={section.id}
                            className="overflow-hidden rounded-lg border border-border/70 bg-card"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-3 py-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="h-4 w-1 shrink-0 rounded-full bg-[#E94C16]" aria-hidden />
                                <SectionIcon className="h-3.5 w-3.5 shrink-0 text-[#E94C16]" aria-hidden />
                                <span className="truncate text-xs font-semibold text-foreground">
                                  {section.label}
                                </span>
                              </div>
                              {subtotal > 0 ? (
                                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                                  {formatStudioEuro(subtotal)}
                                </span>
                              ) : null}
                            </div>
                            <ul className="divide-y divide-border/50 text-sm">
                              {lines.map(({ row, linePrice, quantity }) => {
                                const qtyLabel = formatStudioSummaryQuantity(row, quantity)
                                return (
                                <li
                                  key={row.id}
                                  className="flex items-start justify-between gap-2 px-3 py-2.5"
                                >
                                  <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-x-3 gap-y-1">
                                    <span className="min-w-0 text-sm leading-snug text-foreground">
                                      {formatStudioPrestationLabel(row)}
                                    </span>
                                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                                      {qtyLabel ? `× ${qtyLabel}` : ''}
                                    </span>
                                    {row.kind === 'on_demand' ? (
                                      <StudioSummaryOnDemandLabel
                                        row={row}
                                        onSlackRequest={openRowBudgetRequestDialog}
                                      />
                                    ) : (
                                      <span className="shrink-0 text-sm font-semibold tabular-nums text-[#E94C16]">
                                        {formatStudioEuro(linePrice)}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onToggle(row.id, false)}
                                    className="h-6 w-6 shrink-0 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    title="Retirer du devis"
                                    aria-label={`Retirer ${formatStudioPrestationLabel(row)} du devis`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </li>
                                )
                              })}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                      Cochez des prestations dans le tableau pour composer votre devis.
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                      <span className="text-muted-foreground">Total HT</span>
                      <span className="font-semibold tabular-nums">
                        {formatStudioEuro(computed.subtotalJ)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E94C16]/30 bg-[#E94C16]/5 px-3 py-2.5">
                      <span className="font-medium">Total TTC (20 %)</span>
                      <span className="text-base font-bold tabular-nums text-[#E94C16]">
                        {formatStudioEuro(computed.ttc)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-2.5">
                    <Label htmlFor="studio-devis-comment" className="mb-1.5 block text-sm">
                      Commentaire
                    </Label>
                    <Textarea
                      id="studio-devis-comment"
                      placeholder="Commentaire visible sur le PDF"
                      rows={2}
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      className="min-h-0 resize-none bg-background py-1.5 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      title="Télécharger le PDF"
                      className="h-auto min-h-10 w-full flex-col gap-1 bg-[#E94C16] px-1.5 py-2 text-[11px] leading-tight hover:bg-[#d43f12] text-white whitespace-normal"
                      onClick={handleOpenPdfDialog}
                      disabled={loadingSave || exportingPdf || computed.selectedCount === 0}
                    >
                      <Download className="h-4 w-4 shrink-0" aria-hidden />
                      <span>PDF</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto min-h-10 w-full flex-col gap-1 px-1.5 py-2 text-[11px] leading-tight whitespace-normal"
                      onClick={handleOpenSaveDialog}
                      disabled={loadingSave || saving || computed.selectedCount === 0}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                      ) : (
                        <Save className="h-4 w-4 shrink-0" aria-hidden />
                      )}
                      <span>Sauvegarder</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto min-h-10 w-full flex-col gap-1 px-1.5 py-2 text-[11px] leading-tight whitespace-normal"
                      onClick={resetSelection}
                      disabled={computed.selectedCount === 0 && !savedId}
                    >
                      <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
                      <span>Réinitialiser</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {savedId ? 'Mettre à jour le devis studio' : 'Sauvegarder le devis studio'}
            </DialogTitle>
            <DialogDescription>
              Le devis sera sauvegardé dans Mon espace avec les prestations sélectionnées et les
              totaux calculés.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-studio-tarifs-name">Nom du devis *</Label>
              <Input
                id="save-studio-tarifs-name"
                placeholder="Ex. Devis studio Client X"
                value={saveNameInput}
                onChange={(event) => setSaveNameInput(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmSave()}
              disabled={!saveNameInput.trim() || saving}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="mr-2 h-4 w-4" aria-hidden />
              )}
              {savedId ? 'Mettre à jour' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le PDF</DialogTitle>
            <DialogDescription>
              Choisissez le nom du fichier. L’extension <span className="font-medium">.pdf</span>{' '}
              sera ajoutée automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="studio-pdf-filename">Nom du fichier *</Label>
              <Input
                id="studio-pdf-filename"
                placeholder="Ex. Devis studio Client X"
                value={pdfFileNameInput}
                onChange={(event) => setPdfFileNameInput(event.target.value)}
                disabled={exportingPdf}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPdfDialogOpen(false)}
              disabled={exportingPdf}
            >
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmDownloadPdf()}
              disabled={!pdfFileNameInput.trim() || exportingPdf}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {exportingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="mr-2 h-4 w-4" aria-hidden />
              )}
              Télécharger le PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={budgetRequestDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeBudgetRequestDialog()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Demande d’approche budgétaire</DialogTitle>
            <DialogDescription className="space-y-2">
              <span className="block">
                {budgetRequestRow
                  ? formatStudioPrestationLabel(budgetRequestRow)
                  : 'Prestation studio'}
              </span>
              <span className="block text-muted-foreground">
                Décrivez votre besoin : un message sera envoyé aux créas sur Slack (
                <span className="font-medium">#demande-studio</span>).
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="studio-budget-section">Rubrique concernée *</Label>
                <Select
                  value={budgetRequestSectionId}
                  onValueChange={(value) =>
                    handleBudgetRequestSectionChange(value as StudioTarifsSectionId)
                  }
                  disabled={submittingBudgetRequest}
                >
                  <SelectTrigger id="studio-budget-section">
                    <SelectValue placeholder="Choisir une rubrique" />
                  </SelectTrigger>
                  <SelectContent>
                    {slackBudgetSections.map((sectionId) => {
                      const sectionLabel =
                        STUDIO_TARIFS_SECTIONS.find((section) => section.id === sectionId)
                          ?.label ?? sectionId
                      return (
                        <SelectItem key={sectionId} value={sectionId}>
                          {sectionLabel}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            {slackBudgetRowsForDialog.length > 1 ? (
              <div className="space-y-2">
                <Label htmlFor="studio-budget-prestation">Prestation concernée *</Label>
                <Select
                  value={budgetRequestRow?.id ?? ''}
                  onValueChange={(value) => {
                    const row = slackBudgetRowsForDialog.find((entry) => entry.id === value)
                    if (row) setBudgetRequestRow(row)
                  }}
                  disabled={submittingBudgetRequest}
                >
                  <SelectTrigger id="studio-budget-prestation">
                    <SelectValue placeholder="Choisir une prestation" />
                  </SelectTrigger>
                  <SelectContent>
                    {slackBudgetRowsForDialog.map((row) => (
                      <SelectItem key={row.id} value={row.id}>
                        {formatStudioPrestationLabel(row)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="studio-budget-need">Décris ton besoin *</Label>
              <Textarea
                id="studio-budget-need"
                placeholder="Contexte, délais, contraintes, budget indicatif…"
                rows={4}
                value={budgetNeedDescription}
                onChange={(event) => setBudgetNeedDescription(event.target.value)}
                disabled={submittingBudgetRequest}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio-budget-attachment">Joindre un fichier (optionnel)</Label>
              <Input
                id="studio-budget-attachment"
                type="file"
                disabled={submittingBudgetRequest}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null
                  setBudgetAttachment(file)
                }}
              />
              {budgetAttachment ? (
                <p className="text-xs text-muted-foreground">
                  Fichier sélectionné : {budgetAttachment.name} (
                  {(budgetAttachment.size / (1024 * 1024)).toFixed(2)} Mo)
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">PDF, images ou documents — max. 20 Mo</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeBudgetRequestDialog}
              disabled={submittingBudgetRequest}
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
              onClick={() => void handleConfirmBudgetRequest()}
              disabled={!budgetNeedDescription.trim() || submittingBudgetRequest}
            >
              {submittingBudgetRequest ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              Envoyer aux créas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectionBlockedDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeSelectionBlockedDialog()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prestations requises</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1 text-sm text-muted-foreground">
                {selectionBlockedDialogRow ? (
                  <p className="font-medium text-foreground">
                    {formatStudioPrestationLabel(selectionBlockedDialogRow)}
                  </p>
                ) : null}
                <p>{selectionBlockedDialogMessage}</p>
                {selectionBlockedDialogRow &&
                getStudioTarifsRequiredRows(selectionBlockedDialogRow).length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Cochez une ou les deux prestations Créa - Fixe :
                    </p>
                    {getStudioTarifsRequiredRows(selectionBlockedDialogRow).map((requiredRow) => {
                      const checked = selectionBlockedRequiredIds.includes(requiredRow.id)
                      return (
                        <label
                          key={requiredRow.id}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                            checked
                              ? 'border-[#E94C16]/40 bg-[#E94C16]/5'
                              : 'border-border/70 bg-muted/20 hover:bg-muted/40',
                          )}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) =>
                              toggleSelectionBlockedRequired(requiredRow.id, value === true)
                            }
                            className="mt-0.5"
                            aria-label={`Sélectionner ${formatStudioPrestationLabel(requiredRow)}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                              {formatStudioPrestationLabel(requiredRow)}
                            </span>
                            {requiredRow.rateHT !== undefined ? (
                              <span className="mt-0.5 block text-xs tabular-nums text-muted-foreground">
                                {formatStudioEuro(requiredRow.rateHT)} HT / unité
                              </span>
                            ) : null}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ) : selectionBlockedDialogRow?.conditions ? (
                  <p className="rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-xs leading-relaxed">
                    {selectionBlockedDialogRow.conditions}
                  </p>
                ) : null}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeSelectionBlockedDialog}>
              Annuler
            </Button>
            <Button
              type="button"
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
              onClick={handleConfirmSelectionBlockedDialog}
              disabled={
                Boolean(selectionBlockedDialogRow) &&
                getStudioTarifsRequiredRows(selectionBlockedDialogRow!).length > 0 &&
                selectionBlockedRequiredIds.length === 0
              }
            >
              Ajouter au devis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
