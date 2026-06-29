'use client'

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BarChart3, Check, Copy, HelpCircle, Info, Loader2, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SavedRecordLoadingBanner } from '@/components/ui/saved-record-loading-banner'
import { cn } from '@/lib/utils'
import { useAuthAccess } from '@/components/auth-context'
import {
  SIMULATEUR_DEFAULT_INPUTS,
  SIMULATEUR_PLATFORM_ORDER,
  SIMULATEUR_GLOBAL_PARAMS,
  SIMULATEUR_PLATFORM_PARAMS,
  computeSimulateurMediaLink,
  parseSimulateurDiffusionDays,
  parseSimulateurNumber,
  parseSimulateurPositiveInt,
  type PressureLevel,
  type SimulateurCustomMode,
  type SimulateurInputs,
  type SimulateurPlatformId,
  type SimulateurPlatformRow,
} from '@/lib/simulateur-media-link'
import type { SimulateurMediaSaveContent } from '@/lib/simulateur-media-saves'
import {
  createSimulateurMediaSave,
  getSimulateurMediaSaveById,
  updateSimulateurMediaSave,
} from '@/lib/simulateur-media-saves-storage'
import { STRATEGIE_SOCIAL_HREF } from '@/lib/nav-config'
import { buildCustomStrategyHelpText, buildIdealStrategyHelpText, buildMaxStrategyHelpText, buildSimulateurGlobalNarrativeRecap } from '@/lib/simulateur-media-recap'
import { PressureBadge, PressureScaleLegend } from '@/components/vente/PressureScaleLegend'

type SimulateurResult = ReturnType<typeof computeSimulateurMediaLink>

const cellInputClass = 'h-9 bg-background text-sm tabular-nums'

function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return Math.round(n).toLocaleString('fr-FR')
}

function formatRate(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

function StrategyCell({
  impressions,
  rate,
  saturation,
  clicks,
}: {
  impressions: number | null
  rate: number | null
  saturation: PressureLevel
  clicks: number | null
}) {
  return (
    <div className="space-y-1 text-xs sm:text-sm">
      <div>
        <span className="text-muted-foreground">Impr. </span>
        <span className="font-medium tabular-nums">{formatInt(impressions)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Taux de pénétration </span>
        <span className="font-medium tabular-nums">{formatRate(rate)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-muted-foreground">Pression publicitaire </span>
        <PressureBadge level={saturation} />
      </div>
      <div>
        <span className="text-muted-foreground">Clics </span>
        <span className="font-medium tabular-nums">{clicks !== null ? formatInt(clicks) : '—'}</span>
      </div>
    </div>
  )
}

function needsMetaPotentiel(enabled: Record<SimulateurPlatformId, boolean>): boolean {
  return enabled.meta || enabled.display || enabled.youtube
}

function PlatformResultRow({ row }: { row: SimulateurPlatformRow }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{row.label}</TableCell>
      <TableCell className="tabular-nums">{formatInt(row.potentiel)}</TableCell>
      <TableCell className="tabular-nums">{row.diffusionDays ?? '—'}</TableCell>
      <TableCell>
        <StrategyCell {...row.ideal} />
      </TableCell>
      <TableCell>
        <StrategyCell {...row.max} />
      </TableCell>
    </TableRow>
  )
}

const IDEAL_ANALYSIS_NARRATIVE =
  'Cette stratégie est le meilleur compromis : elle permet de donner suffisamment de visibilité à votre message, sans trop répéter la publicité auprès des mêmes personnes.\n\n👉 La stratégie équilibrée pour maximiser l’efficacité sans surinvestir.'

const MAX_ANALYSIS_NARRATIVE =
  'Cette stratégie permet d’aller chercher un maximum de visibilité, mais elle correspond aussi au seuil haut à ne pas dépasser pour éviter une répétition trop forte du message.\n\n👉 La limite maximale pour pousser la diffusion sans tomber dans la surexposition.'

const CUSTOM_ANALYSIS_NARRATIVE =
  'Cette simulation vous permet d’ajuster la diffusion selon votre budget ou votre objectif, tout en visualisant immédiatement l’impact sur la couverture et la répétition du message.\n\n👉 La stratégie sur mesure pour adapter la campagne à votre niveau d’ambition.'

function AnalysisHelpActions({
  helpText,
  narrativeText,
}: {
  helpText: string
  narrativeText: string
}) {
  const [copied, setCopied] = useState(false)
  const copyText = `${helpText}\n\n${narrativeText}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Impossible de copier le texte.')
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 border-[#E94C16]/40 text-[#E94C16] hover:bg-orange-50"
        onClick={() => void handleCopy()}
        aria-label={copied ? 'Texte copié' : 'Copier le texte'}
        title={copied ? 'Texte copié' : 'Copier le texte'}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 border-[#E94C16]/40 text-[#E94C16] hover:bg-orange-50"
            aria-label="Afficher l’aide"
            title="Afficher l’aide"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-sm space-y-2 text-sm leading-relaxed" align="start">
          {helpText.split('\n').map((line, index) =>
            line ? (
              <p key={index}>{line}</p>
            ) : (
              <div key={index} className="h-1" aria-hidden />
            ),
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function PlatformAnalysisRow({ result }: { result: SimulateurResult }) {
  const enabledRows = result.rows.filter((row) => row.enabled)
  const idealHelpText = buildIdealStrategyHelpText(result.synthesis.ideal, enabledRows)
  const maxHelpText = buildMaxStrategyHelpText(result.synthesis.max, enabledRows)

  return (
    <TableRow className="bg-muted/20 hover:bg-muted/20">
      <TableCell className="font-medium align-top">Analyse</TableCell>
      <TableCell className="align-top" aria-hidden />
      <TableCell className="align-top" aria-hidden />
      <TableCell className="align-top text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <p>
          Cette stratégie est le meilleur compromis : elle permet de donner suffisamment de visibilité à
          votre message, sans trop répéter la publicité auprès des mêmes personnes.
        </p>
        <p className="mt-2 font-medium text-foreground">
          👉 La stratégie équilibrée pour maximiser l&apos;efficacité sans surinvestir.
        </p>
        <AnalysisHelpActions helpText={idealHelpText} narrativeText={IDEAL_ANALYSIS_NARRATIVE} />
      </TableCell>
      <TableCell className="align-top text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <p>
          Cette stratégie permet d&apos;aller chercher un maximum de visibilité, mais elle correspond aussi
          au seuil haut à ne pas dépasser pour éviter une répétition trop forte du message.
        </p>
        <p className="mt-2 font-medium text-foreground">
          👉 La limite maximale pour pousser la diffusion sans tomber dans la surexposition.
        </p>
        <AnalysisHelpActions helpText={maxHelpText} narrativeText={MAX_ANALYSIS_NARRATIVE} />
      </TableCell>
    </TableRow>
  )
}

function CustomAnalysisRow({ result }: { result: SimulateurResult }) {
  const enabledRows = result.rows.filter((row) => row.enabled)
  const helpText = buildCustomStrategyHelpText(result.synthesis.custom, enabledRows)

  return (
    <TableRow className="bg-muted/20 hover:bg-muted/20">
      <TableCell className="font-medium align-top">Analyse</TableCell>
      <TableCell className="align-top" aria-hidden />
      <TableCell className="align-top" aria-hidden />
      <TableCell colSpan={2} className="align-top text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <p>
          Cette simulation vous permet d&apos;ajuster la diffusion selon votre budget ou votre objectif, tout
          en visualisant immédiatement l&apos;impact sur la couverture et la répétition du message.
        </p>
        <p className="mt-2 font-medium text-foreground">
          👉 La stratégie sur mesure pour adapter la campagne à votre niveau d&apos;ambition.
        </p>
        <AnalysisHelpActions helpText={helpText} narrativeText={CUSTOM_ANALYSIS_NARRATIVE} />
      </TableCell>
    </TableRow>
  )
}

function CustomStrategyRow({
  row,
  customMode,
  customValue,
  onCustomValueChange,
}: {
  row: SimulateurPlatformRow
  customMode: SimulateurCustomMode
  customValue: string
  onCustomValueChange: (value: string) => void
}) {
  const valueLabel =
    customMode === 'impressions' ? 'Impressions visées' : 'Clics visés'

  return (
    <TableRow>
      <TableCell className="font-medium">{row.label}</TableCell>
      <TableCell className="tabular-nums">{formatInt(row.potentiel)}</TableCell>
      <TableCell className="tabular-nums">{row.diffusionDays ?? '—'}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <Label htmlFor={`custom-value-${row.id}`} className="text-xs text-muted-foreground">
            {valueLabel}
          </Label>
          <Input
            id={`custom-value-${row.id}`}
            type="number"
            min={0}
            className={cellInputClass}
            value={customValue}
            onChange={(e) => onCustomValueChange(e.target.value)}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground">Taux de pénétration </span>
            <span className="font-medium tabular-nums">{formatRate(row.custom.rate)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground">Pression publicitaire </span>
            <PressureBadge level={row.custom.saturation} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

function SynthesisTable({ synthesis }: { synthesis: SimulateurResult['synthesis'] }) {
  const rows: { label: string; ideal: string; max: string }[] = [
    {
      label: 'Impressions totales',
      ideal: formatInt(synthesis.ideal.totalImpressions),
      max: formatInt(synthesis.max.totalImpressions),
    },
    {
      label: 'Clics totaux estimés',
      ideal: formatInt(synthesis.ideal.totalClicks),
      max: formatInt(synthesis.max.totalClicks),
    },
    {
      label: 'Taux de pénétration estimé (multi-plateformes)',
      ideal: formatRate(synthesis.ideal.globalRate),
      max: formatRate(synthesis.max.globalRate),
    },
    {
      label: 'Niveau de pression global',
      ideal: synthesis.ideal.pressureLevel,
      max: synthesis.max.pressureLevel,
    },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="min-w-[12rem] font-semibold">Indicateur</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">Stratégie idéale</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">Stratégie MAX</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.ideal as PressureLevel} />
                ) : (
                  row.ideal
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.max as PressureLevel} />
                ) : (
                  row.max
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CustomSynthesisTable({
  synthesis,
  customMode,
}: {
  synthesis: SimulateurResult['synthesis']['custom']
  customMode: SimulateurCustomMode
}) {
  const allRows: {
    key: 'impressions' | 'clics' | 'rate' | 'pressure'
    label: string
    value: string
  }[] = [
    {
      key: 'impressions',
      label: 'Impressions totales',
      value: formatInt(synthesis.totalImpressions),
    },
    {
      key: 'clics',
      label: 'Clics totaux estimés',
      value: formatInt(synthesis.totalClicks),
    },
    {
      key: 'rate',
      label: 'Taux de pénétration estimé (multi-plateformes)',
      value: formatRate(synthesis.globalRate),
    },
    {
      key: 'pressure',
      label: 'Niveau de pression global',
      value: synthesis.pressureLevel,
    },
  ]

  const rows = allRows.filter((row) => {
    if (row.key === 'rate' || row.key === 'pressure') return true
    return customMode === 'impressions' ? row.key === 'impressions' : row.key === 'clics'
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="min-w-[12rem] font-semibold">Indicateur</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">
              Stratégie personnalisée
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.value as PressureLevel} />
                ) : (
                  row.value
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function buildCustomAlerts(
  enabled: Record<SimulateurPlatformId, boolean>,
  customValues: Record<SimulateurPlatformId, string>,
): string[] {
  const missing: string[] = []
  for (const { id, label } of SIMULATEUR_PLATFORM_ORDER) {
    if (enabled[id] && parseSimulateurNumber(customValues[id]) === null) {
      missing.push(label)
    }
  }
  if (missing.length === 0) return []
  return [`⚠ Valeur personnalisée manquante pour : ${missing.join(' ')}`]
}

function defaultCustomValues(): Record<SimulateurPlatformId, string> {
  return SIMULATEUR_PLATFORM_ORDER.reduce(
    (acc, { id }) => {
      acc[id] = ''
      return acc
    },
    {} as Record<SimulateurPlatformId, string>,
  )
}

function buildInputsFromState(
  state: FormState,
  custom?: { mode: SimulateurCustomMode; values: Record<SimulateurPlatformId, string> },
): SimulateurInputs | null {
  const diffusionDays = parseSimulateurDiffusionDays(state.diffusionDays)
  if (diffusionDays === null) return null

  const platforms = {} as SimulateurInputs['platforms']
  for (const { id } of SIMULATEUR_PLATFORM_ORDER) {
    platforms[id] = {
      enabled: state.enabled[id],
      customValue: custom
        ? parseSimulateurNumber(custom.values[id])
        : null,
    }
  }

  return {
    diffusionDays,
    customMode: custom?.mode ?? 'impressions',
    potentiels: {
      meta: parseSimulateurPositiveInt(state.potentielMeta),
      linkedin: parseSimulateurPositiveInt(state.potentielLinkedin),
      snapchat: parseSimulateurPositiveInt(state.potentielSnapchat),
      tiktok: parseSimulateurPositiveInt(state.potentielTiktok),
    },
    platforms,
  }
}

type FormState = {
  diffusionDays: string
  potentielMeta: string
  potentielLinkedin: string
  potentielSnapchat: string
  potentielTiktok: string
  enabled: Record<SimulateurPlatformId, boolean>
}

function defaultFormState(): FormState {
  const enabled = {} as Record<SimulateurPlatformId, boolean>
  for (const { id } of SIMULATEUR_PLATFORM_ORDER) {
    enabled[id] = SIMULATEUR_DEFAULT_INPUTS.platforms[id].enabled
  }
  return {
    diffusionDays: '30',
    potentielMeta: '',
    potentielLinkedin: '',
    potentielSnapchat: '',
    potentielTiktok: '',
    enabled,
  }
}

export function SimulateurMediaLinkPanel() {
  return (
    <Suspense
      fallback={
        <SavedRecordLoadingBanner
          className="my-16"
          label="Chargement du simulateur…"
          description="Préparation de l’outil Stratégie — Social Media."
        />
      }
    >
      <SimulateurMediaLinkPanelInner />
    </Suspense>
  )
}

function SimulateurMediaLinkPanelInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const simulateurIdFromUrl = searchParams.get('simulateur')
  const [form, setForm] = useState<FormState>(defaultFormState)
  const [customPanelOpen, setCustomPanelOpen] = useState(false)
  const [customMode, setCustomMode] = useState<SimulateurCustomMode>('impressions')
  const [customValues, setCustomValues] = useState<Record<SimulateurPlatformId, string>>(
    defaultCustomValues,
  )
  const [savedId, setSavedId] = useState<string | null>(null)
  const [savedName, setSavedName] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveNameInput, setSaveNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [copiedRecap, setCopiedRecap] = useState(false)
  const { isAdmin, authReady } = useAuthAccess()
  const showAdminSections = authReady && isAdmin

  const result = useMemo(() => {
    const inputs = buildInputsFromState(form)
    if (!inputs) return null
    return computeSimulateurMediaLink(inputs)
  }, [form])

  const customResult = useMemo(() => {
    if (!customPanelOpen) return null
    const inputs = buildInputsFromState(form, { mode: customMode, values: customValues })
    if (!inputs) return null
    return computeSimulateurMediaLink(inputs)
  }, [form, customPanelOpen, customMode, customValues])

  const customAlerts = useMemo(
    () => (customPanelOpen ? buildCustomAlerts(form.enabled, customValues) : []),
    [customPanelOpen, form.enabled, customValues],
  )

  const recapText = useMemo(() => {
    if (!result) return ''
    return buildSimulateurGlobalNarrativeRecap(result) ?? ''
  }, [result])

  const handleCopyRecap = useCallback(async () => {
    if (!recapText) return
    try {
      await navigator.clipboard.writeText(recapText)
      setCopiedRecap(true)
      window.setTimeout(() => setCopiedRecap(false), 2000)
    } catch {
      alert('Impossible de copier le récapitulatif.')
    }
  }, [recapText])

  const applySavedContent = useCallback((content: SimulateurMediaSaveContent, name: string, id: string) => {
    setForm({
      diffusionDays: content.form.diffusionDays,
      potentielMeta: content.form.potentielMeta,
      potentielLinkedin: content.form.potentielLinkedin,
      potentielSnapchat: content.form.potentielSnapchat,
      potentielTiktok: content.form.potentielTiktok,
      enabled: { ...content.form.enabled },
    })
    setCustomPanelOpen(content.customPanelOpen)
    setCustomMode(content.customMode)
    setCustomValues({ ...content.customValues })
    setSavedId(id)
    setSavedName(name)
  }, [])

  useEffect(() => {
    if (!simulateurIdFromUrl) return
    let cancelled = false
    setLoadingSave(true)
    void getSimulateurMediaSaveById(simulateurIdFromUrl)
      .then((record) => {
        if (cancelled || !record) return
        applySavedContent(record.content, record.name, record.id)
      })
      .catch((e) => {
        if (!cancelled) {
          alert(e instanceof Error ? e.message : 'Impossible de charger la simulation.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSave(false)
      })
    return () => {
      cancelled = true
    }
  }, [simulateurIdFromUrl, applySavedContent])

  const buildSaveContent = (): SimulateurMediaSaveContent => ({
    version: 1,
    form: {
      diffusionDays: form.diffusionDays,
      potentielMeta: form.potentielMeta,
      potentielLinkedin: form.potentielLinkedin,
      potentielSnapchat: form.potentielSnapchat,
      potentielTiktok: form.potentielTiktok,
      enabled: { ...form.enabled },
    },
    customPanelOpen,
    customMode,
    customValues: { ...customValues },
  })

  const summaryImpressions =
    customPanelOpen && customResult
      ? customResult.synthesis.custom.totalImpressions
      : result?.synthesis.ideal.totalImpressions ?? 0

  const handleOpenSaveDialog = () => {
    if (!result) {
      alert('Complétez les paramètres de campagne avant d’enregistrer.')
      return
    }
    const hasPlatform = Object.values(form.enabled).some(Boolean)
    if (!hasPlatform) {
      alert('Activez au moins une plateforme avant d’enregistrer.')
      return
    }
    setSaveNameInput(savedName || 'Simulation média Link')
    setSaveDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    const name = saveNameInput.trim()
    if (!name) {
      alert('Veuillez renseigner un nom pour la simulation.')
      return
    }
    if (!result) return

    setSaving(true)
    try {
      const content = buildSaveContent()
      const wasUpdate = !!savedId
      const record = savedId
        ? await updateSimulateurMediaSave({
            id: savedId,
            name,
            summaryImpressions,
            content,
          })
        : await createSimulateurMediaSave({
            name,
            summaryImpressions,
            content,
          })
      setSavedId(record.id)
      setSavedName(record.name)
      setSaveDialogOpen(false)
      router.replace(`${STRATEGIE_SOCIAL_HREF}?simulateur=${record.id}`)
      alert(
        wasUpdate
          ? 'Simulation mise à jour dans Mon espace.'
          : 'Simulation enregistrée dans Mon espace.',
      )
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  const showMetaPotentiel = needsMetaPotentiel(form.enabled)
  const showLinkedinPotentiel = form.enabled.linkedin
  const showSnapchatPotentiel = form.enabled.snapchat
  const showTiktokPotentiel = form.enabled.tiktok

  return (
    <div className="space-y-8">
      {loadingSave ? (
        <SavedRecordLoadingBanner
          label="Chargement de la simulation enregistrée…"
          description="Récupération de votre stratégie sauvegardée depuis Mon espace."
        />
      ) : null}
      <div className={cn(loadingSave && 'pointer-events-none opacity-50')}>
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent pb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E94C16]/10 text-[#E94C16]">
                  <BarChart3 className="h-5 w-5" aria-hidden />
                </span>
                Simulateur Média — Link
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-relaxed">
                Estimez impressions, taux de pénétration, saturation et clics par plateforme — stratégies
                idéale, MAX et personnalisée.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                className="border-[#E94C16]/40 text-[#E94C16] hover:bg-orange-50"
                onClick={() => void handleCopyRecap()}
                disabled={loadingSave || !result}
              >
                {copiedRecap ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedRecap ? 'Copié' : 'Copier'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-[#E94C16]/40 text-[#E94C16] hover:bg-orange-50"
                onClick={handleOpenSaveDialog}
                disabled={loadingSave || !result}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-10 pt-6">
          {/* Zone à remplir */}
          <section aria-labelledby="sim-inputs-heading">
            <h2 id="sim-inputs-heading" className="mb-4 text-base font-semibold">
              Paramètres de la campagne
            </h2>

            <div className="space-y-3">
              <Label>Plateformes activées</Label>
              <div className="flex flex-wrap gap-2">
                {SIMULATEUR_PLATFORM_ORDER.map(({ id, label }) => (
                  <label
                    key={id}
                    htmlFor={`sim-platform-${id}`}
                    className={cn(
                      'flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm cursor-pointer',
                      form.enabled[id] && 'border-[#E94C16]/40 bg-orange-50/40',
                    )}
                  >
                    <Checkbox
                      id={`sim-platform-${id}`}
                      checked={form.enabled[id]}
                      onCheckedChange={(checked) =>
                        setForm((f) => ({
                          ...f,
                          enabled: { ...f.enabled, [id]: checked === true },
                        }))
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sim-diffusion-days">Durée de diffusion (jours)</Label>
                <Input
                  id="sim-diffusion-days"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  value={form.diffusionDays}
                  onChange={(e) => setForm((f) => ({ ...f, diffusionDays: e.target.value }))}
                />
              </div>
              {showMetaPotentiel && (
                <div className="space-y-2">
                  <Label htmlFor="sim-potentiel-meta">Potentiel Meta</Label>
                  <Input
                    id="sim-potentiel-meta"
                    type="number"
                    min={1}
                    className={cellInputClass}
                    placeholder="Taille audience Meta Ads"
                    value={form.potentielMeta}
                    onChange={(e) => setForm((f) => ({ ...f, potentielMeta: e.target.value }))}
                  />
                  {(form.enabled.display || form.enabled.youtube) && !form.enabled.meta && (
                    <p className="text-xs text-muted-foreground">
                      Utilisé pour Display et YouTube.
                    </p>
                  )}
                </div>
              )}
              {showLinkedinPotentiel && (
                <div className="space-y-2">
                  <Label htmlFor="sim-potentiel-linkedin">Potentiel LinkedIn</Label>
                  <Input
                    id="sim-potentiel-linkedin"
                    type="number"
                    min={1}
                    className={cellInputClass}
                    placeholder="Taille audience LinkedIn Ads"
                    value={form.potentielLinkedin}
                    onChange={(e) => setForm((f) => ({ ...f, potentielLinkedin: e.target.value }))}
                  />
                </div>
              )}
              {showSnapchatPotentiel && (
                <div className="space-y-2">
                  <Label htmlFor="sim-potentiel-snapchat">Potentiel Snapchat</Label>
                  <Input
                    id="sim-potentiel-snapchat"
                    type="number"
                    min={1}
                    className={cellInputClass}
                    placeholder="Taille audience Snapchat Ads"
                    value={form.potentielSnapchat}
                    onChange={(e) => setForm((f) => ({ ...f, potentielSnapchat: e.target.value }))}
                  />
                </div>
              )}
              {showTiktokPotentiel && (
                <div className="space-y-2">
                  <Label htmlFor="sim-potentiel-tiktok">Potentiel TikTok</Label>
                  <Input
                    id="sim-potentiel-tiktok"
                    type="number"
                    min={1}
                    className={cellInputClass}
                    placeholder="Taille audience TikTok Ads"
                    value={form.potentielTiktok}
                    onChange={(e) => setForm((f) => ({ ...f, potentielTiktok: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Alertes */}
          {result && result.alerts.length > 0 && (
            <section aria-labelledby="sim-alerts-heading">
              <h2 id="sim-alerts-heading" className="mb-3 text-base font-semibold">
                Alertes
              </h2>
              <div className="space-y-2">
                {result.alerts.map((alert) => (
                  <Alert key={alert} variant="destructive" className="border-amber-300 bg-amber-50 text-amber-900">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{alert}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </section>
          )}

          {/* Résultats */}
          {result && (
            <>
              <section aria-labelledby="sim-pressure-scale-heading" className="rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
                <h2 id="sim-pressure-scale-heading" className="sr-only">
                  Échelle de pression publicitaire
                </h2>
                <PressureScaleLegend />
              </section>

              <section aria-labelledby="sim-results-heading">
                <h2 id="sim-results-heading" className="mb-4 text-base font-semibold">
                  Résultats par plateforme
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Plateforme</TableHead>
                        <TableHead className="font-semibold">Potentiel</TableHead>
                        <TableHead className="font-semibold">Durée</TableHead>
                        <TableHead className="min-w-[9rem] font-semibold">Stratégie idéale</TableHead>
                        <TableHead className="min-w-[9rem] font-semibold">Stratégie MAX</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.rows.filter((row) => row.enabled).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Activez au moins une plateforme pour afficher les résultats.
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {result.rows
                            .filter((row) => row.enabled)
                            .map((row) => <PlatformResultRow key={row.id} row={row} />)}
                          <PlatformAnalysisRow result={result} />
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section aria-labelledby="sim-synthesis-heading">
                <h2 id="sim-synthesis-heading" className="mb-4 text-base font-semibold">
                  Synthèse globale
                </h2>
                <SynthesisTable synthesis={result.synthesis} />
              </section>

              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    customPanelOpen && 'border-[#E94C16] bg-orange-50/50 text-[#E94C16] hover:bg-orange-50',
                  )}
                  onClick={() => setCustomPanelOpen((open) => !open)}
                >
                  Besoin d&apos;une stratégie personnalisée ?
                </Button>
              </div>

              {customPanelOpen && customResult && (
                <section
                  aria-labelledby="sim-custom-heading"
                  className="rounded-xl border-2 border-[#E94C16]/25 bg-gradient-to-br from-orange-50/40 via-white to-white p-4 sm:p-6 space-y-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 id="sim-custom-heading" className="text-base font-semibold">
                        Stratégie personnalisée
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saisissez vos objectifs par plateforme pour comparer avec les stratégies
                        idéale et MAX — sans modifier ces dernières.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Label htmlFor="sim-custom-mode" className="text-sm text-muted-foreground">
                        Mode de saisie
                      </Label>
                      <Select
                        value={customMode}
                        onValueChange={(v) => setCustomMode(v as SimulateurCustomMode)}
                      >
                        <SelectTrigger id="sim-custom-mode" className="w-[10rem]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="impressions">Impressions</SelectItem>
                          <SelectItem value="clics">Clics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {customAlerts.length > 0 && (
                    <div className="space-y-2">
                      {customAlerts.map((alert) => (
                        <Alert
                          key={alert}
                          variant="destructive"
                          className="border-amber-300 bg-amber-50 text-amber-900"
                        >
                          <Info className="h-4 w-4" />
                          <AlertDescription>{alert}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-border/70 bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="font-semibold">Plateforme</TableHead>
                          <TableHead className="font-semibold">Potentiel</TableHead>
                          <TableHead className="font-semibold">Durée</TableHead>
                          <TableHead className="min-w-[10rem] font-semibold">Votre objectif</TableHead>
                          <TableHead className="min-w-[9rem] font-semibold">Résultats</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customResult.rows.filter((row) => row.enabled).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              Activez au moins une plateforme pour construire votre stratégie.
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {customResult.rows
                              .filter((row) => row.enabled)
                              .map((row) => (
                                <CustomStrategyRow
                                  key={row.id}
                                  row={row}
                                  customMode={customMode}
                                  customValue={customValues[row.id]}
                                  onCustomValueChange={(value) =>
                                    setCustomValues((prev) => ({ ...prev, [row.id]: value }))
                                  }
                                />
                              ))}
                            <CustomAnalysisRow result={customResult} />
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold">Synthèse — stratégie personnalisée</h3>
                    <CustomSynthesisTable
                      synthesis={customResult.synthesis.custom}
                      customMode={customMode}
                    />
                  </div>
                </section>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Documentation & paramètres — réservé aux administrateurs */}
      {showAdminSections && (
      <Accordion type="multiple" className="rounded-xl border border-border/70 px-4">
        <AccordionItem value="doc">
          <AccordionTrigger className="text-sm font-semibold">Documentation — formules</AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
            <div>
              <p className="font-medium text-foreground mb-1">Impressions</p>
              <p>
                Impressions = Potentiel × Part audience × Fréquence mensuelle × (Durée / 30).
                Proratisation linéaire — 365 j génère 12× les impressions d&apos;un mois.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Clics</p>
              <p>
                Clics = Impressions × CTR plateforme. YouTube : aucun clic (format notoriété, CTR = 0).
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Saturation (pression mensuelle)</p>
              <p>
                Saturation = (Part audience × Fréquence mensuelle) / Coef fréquence — indépendant de la
                durée. &lt; 0,5 : Pression faible · 0,5–1 : Pression correcte · 1–1,5 : Bonne pression ·
                1,5–2,2 : Pression forte · &gt; 2,2 : Surpression.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Taux global multi-plateformes</p>
              <p>
                META est la plateforme de référence. Taux = MIN(Plafond ; 1 − (1 − Taux_META) ×
                e^(−k × Σ(Taux_i × Coef_incr_i))). k = {SIMULATEUR_GLOBAL_PARAMS.kConvergence} · Plafond
                = {(SIMULATEUR_GLOBAL_PARAMS.globalRateCap * 100).toFixed(0)} %.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="params">
          <AccordionTrigger className="text-sm font-semibold">
            Paramètres par plateforme (référence Excel)
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plateforme</TableHead>
                    <TableHead>Plafond</TableHead>
                    <TableHead>Coef fréq.</TableHead>
                    <TableHead>Coef incr.</TableHead>
                    <TableHead>Part idéale</TableHead>
                    <TableHead>Fréq idéale</TableHead>
                    <TableHead>Part MAX</TableHead>
                    <TableHead>Fréq MAX</TableHead>
                    <TableHead>CTR idéal</TableHead>
                    <TableHead>CTR MAX</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SIMULATEUR_PLATFORM_ORDER.map(({ id, label }) => {
                    const p = SIMULATEUR_PLATFORM_PARAMS[id]
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{label}</TableCell>
                        <TableCell>{p.penetrationCap}</TableCell>
                        <TableCell>{p.coefFreq}</TableCell>
                        <TableCell>{p.coefIncremental}</TableCell>
                        <TableCell>{p.partIdeal}</TableCell>
                        <TableCell>{p.freqIdeal}</TableCell>
                        <TableCell>{p.partMax}</TableCell>
                        <TableCell>{p.freqMax}</TableCell>
                        <TableCell>{p.ctrIdeal}</TableCell>
                        <TableCell>{p.ctrMax}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      )}
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {savedId ? 'Mettre à jour la simulation' : 'Enregistrer la simulation'}
            </DialogTitle>
            <DialogDescription>
              La simulation sera sauvegardée dans Mon espace avec tous les paramètres et objectifs
              saisis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-simulateur-name">Nom de la simulation *</Label>
              <Input
                id="save-simulateur-name"
                placeholder="Ex. Campagne Client X"
                value={saveNameInput}
                onChange={(e) => setSaveNameInput(e.target.value)}
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savedId ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
