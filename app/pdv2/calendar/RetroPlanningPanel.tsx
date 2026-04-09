'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarDays, Clock, Info, Layers, Plus, Trash2 } from 'lucide-react'
import type { RetroPlatformPhase, RetroPhase } from './types'
import { getPlatformColor } from './colors'
import { cn } from '@/lib/utils'
import { rebalanceRetroSocialSegments, retroStrategyLineKey } from './retroSocialSplits'

const DEFAULT_PHASE_DAYS = 30

/** Un item de la stratégie Social (plateforme + objectif + jours) */
export interface StrategyItemRef {
  platform: string
  objective: string
  days?: number
}

export interface RetroPlanningPanelProps {
  /** Plateformes disponibles (ordre d'affichage) */
  availablePlatforms: readonly string[]
  /** Date de début du planning */
  startDate: string
  onStartDateChange: (date: string) => void
  /** Durée totale en jours (ex. 90 pour environ 3 mois) */
  durationDays: number
  onDurationDaysChange: (days: number) => void
  /** Plateformes et phases configurées */
  platformPhases: RetroPlatformPhase[]
  onPlatformPhasesChange: (config: RetroPlatformPhase[]) => void
  /** Appliquer la répartition sur le calendrier (sources + items auto-répartis) */
  onApplyDistribution: () => void
  /**
   * Mode « partir de 0 » : affiche le nombre de jours réglable juste à côté du nom de chaque phase
   * (plateformes cochées manuellement uniquement).
   */
  fromScratchRetro?: boolean
  /** Si true, afficher les cartes issues de la stratégie Social dans Phases par plateforme */
  linkSocial?: boolean
  /** Items de la stratégie Social active (pour afficher les cartes) */
  strategyItems?: StrategyItemRef[]
  /** Si true, afficher la carte SMS/RCS dans Phases par plateforme */
  linkSms?: boolean
  /** Type SMS ou RCS pour le libellé de la carte */
  smsType?: 'sms' | 'rcs'
  /** Phases spécifiques pour la carte SMS/RCS (si présente) */
  smsPhases?: RetroPhase[]
  /** Mise à jour des phases SMS/RCS */
  onSmsPhasesChange?: (phases: RetroPhase[]) => void
  /** Ajouter une phase (objectif) à une plateforme de la stratégie Social */
  onLinkedSocialPhaseAdd?: (platform: string, objective: string, days: number) => void
  /** Supprimer une phase (objectif) de la stratégie Social */
  onLinkedSocialPhaseRemove?: (platform: string, objective: string) => void
  /** Modifier une phase (objectif) de la stratégie Social */
  onLinkedSocialPhaseUpdate?: (platform: string, objectiveIndex: number, updates: { name?: string; days?: number }) => void
  /**
   * Découpage rétro par ligne Social (clé = platform::objective). Somme des jours = jours de la ligne dans Social media.
   */
  linkedSocialLineSplits?: Record<string, { name: string; days: number }[]>
  onLinkedSocialLineSplitsChange?: (lineKey: string, segments: { name: string; days: number }[]) => void
  /** Durée de référence si une ligne n’a pas de jours renseignés (ex. jours de diffusion stratégie) */
  strategyDaysFallback?: number
  /** Plafond total jours campagne SMS/RCS (somme des phases ≤ cette valeur) */
  smsCampaignTotalDays?: number
}

export function RetroPlanningPanel({
  availablePlatforms,
  startDate,
  onStartDateChange,
  durationDays,
  onDurationDaysChange,
  platformPhases,
  onPlatformPhasesChange,
  onApplyDistribution,
  fromScratchRetro = false,
  linkSocial,
  strategyItems = [],
  linkSms,
  smsType = 'sms',
  smsPhases = [],
  onSmsPhasesChange,
  onLinkedSocialPhaseAdd,
  onLinkedSocialPhaseRemove,
  onLinkedSocialPhaseUpdate,
  linkedSocialLineSplits = {},
  onLinkedSocialLineSplitsChange,
  strategyDaysFallback = 14,
  smsCampaignTotalDays,
}: RetroPlanningPanelProps) {
  const [newPhaseName, setNewPhaseName] = useState<Record<string, string>>({})

  const linkedSocialEditable = Boolean(
    onLinkedSocialPhaseAdd || onLinkedSocialPhaseRemove || onLinkedSocialPhaseUpdate,
  )
  const socialSplitsEditable = Boolean(linkSocial && onLinkedSocialLineSplitsChange)

  /** Uniquement en « Partir de 0 » : date, durée, plateformes et durées de phases sont modifiables ici */
  const paramsEditable = fromScratchRetro

  const rebalanceSmsPhasesToBudget = React.useCallback((phases: RetroPhase[], budget: number): RetroPhase[] => {
    if (phases.length === 0) return phases
    const copy = phases.map((p) => ({ ...p, defaultDays: Math.max(1, p.defaultDays ?? 1) }))
    let sum = copy.reduce((s, p) => s + (p.defaultDays ?? 1), 0)
    if (sum <= budget) {
      if (sum < budget) {
        const li = copy.length - 1
        copy[li] = { ...copy[li]!, defaultDays: (copy[li]!.defaultDays ?? 1) + (budget - sum) }
      }
      return copy
    }
    let over = sum - budget
    for (let i = copy.length - 1; i >= 0 && over > 0; i--) {
      const d = copy[i]!.defaultDays ?? 1
      const room = d - 1
      const dec = Math.min(over, room)
      copy[i] = { ...copy[i]!, defaultDays: d - dec }
      over -= dec
    }
    return copy
  }, [])

  const smsRetroPhasesEditable = Boolean(onSmsPhasesChange && (paramsEditable || linkSms))

  const togglePlatform = (platform: string, checked: boolean) => {
    if (!paramsEditable) return
    if (checked) {
      if (platformPhases.some((p) => p.platform === platform)) return
      onPlatformPhasesChange([...platformPhases, { platform, phases: [] }])
    } else {
      onPlatformPhasesChange(platformPhases.filter((p) => p.platform !== platform))
    }
  }

  const addPhase = (platform: string) => {
    if (!paramsEditable) return
    const name = newPhaseName[platform]?.trim() || `Phase ${(platformPhases.find((p) => p.platform === platform)?.phases.length ?? 0) + 1}`
    setNewPhaseName((prev) => ({ ...prev, [platform]: '' }))
    onPlatformPhasesChange(
      platformPhases.map((p) =>
        p.platform === platform
          ? { ...p, phases: [...p.phases, { name, defaultDays: DEFAULT_PHASE_DAYS }] }
          : p
      )
    )
  }

  const removePhase = (platform: string, phaseIndex: number) => {
    if (!paramsEditable) return
    onPlatformPhasesChange(
      platformPhases.map((p) => {
        if (p.platform !== platform) return p
        const phases = p.phases.filter((_, i) => i !== phaseIndex)
        return { ...p, phases }
      })
    )
  }

  const updatePhaseName = (platform: string, phaseIndex: number, name: string) => {
    if (!paramsEditable) return
    onPlatformPhasesChange(
      platformPhases.map((p) =>
        p.platform === platform
          ? {
              ...p,
              phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, name } : ph)),
            }
          : p
      )
    )
  }

  const updatePhaseDays = (platform: string, phaseIndex: number, days: number) => {
    if (!paramsEditable) return
    onPlatformPhasesChange(
      platformPhases.map((p) =>
        p.platform === platform
          ? {
              ...p,
              phases: p.phases.map((ph, i) => (i === phaseIndex ? { ...ph, defaultDays: Math.max(1, days) } : ph)),
            }
          : p
      )
    )
  }

  // Gestion des phases SMS/RCS (stockées séparément du reste)
  const smsKeyForNewName = `sms-${smsType}`

  const addSmsPhase = () => {
    if (!smsRetroPhasesEditable) return
    const name =
      newPhaseName[smsKeyForNewName]?.trim() || `Phase ${(smsPhases?.length ?? 0) + 1}`
    const next = [...(smsPhases ?? []), { name, defaultDays: DEFAULT_PHASE_DAYS }]
    onSmsPhasesChange!(
      smsCampaignTotalDays != null ? rebalanceSmsPhasesToBudget(next, smsCampaignTotalDays) : next,
    )
    setNewPhaseName((prev) => ({ ...prev, [smsKeyForNewName]: '' }))
  }

  const updateSmsPhaseName = (phaseIndex: number, name: string) => {
    if (!smsRetroPhasesEditable) return
    onSmsPhasesChange!(
      (smsPhases ?? []).map((ph, i) => (i === phaseIndex ? { ...ph, name } : ph)),
    )
  }

  const updateSmsPhaseDays = (phaseIndex: number, days: number) => {
    if (!smsRetroPhasesEditable) return
    const next = (smsPhases ?? []).map((ph, i) =>
      i === phaseIndex ? { ...ph, defaultDays: days } : ph,
    )
    onSmsPhasesChange!(
      smsCampaignTotalDays != null
        ? rebalanceSmsPhasesToBudget(next, smsCampaignTotalDays)
        : next,
    )
  }

  const removeSmsPhase = (phaseIndex: number) => {
    if (!smsRetroPhasesEditable) return
    const next = (smsPhases ?? []).filter((_, i) => i !== phaseIndex)
    onSmsPhasesChange!(
      smsCampaignTotalDays != null && next.length > 0
        ? rebalanceSmsPhasesToBudget(next, smsCampaignTotalDays)
        : next,
    )
  }

  const hasPlatforms = platformPhases.length > 0

  // Cartes issues de la stratégie Social (groupées par plateforme) — affichage lecture seule sans découpage
  const linkedSocialCards: RetroPlatformPhase[] = React.useMemo(() => {
    if (!linkSocial || !strategyItems?.length || socialSplitsEditable) return []
    const byPlatform = new Map<string, { name: string; defaultDays?: number }[]>()
    for (const it of strategyItems) {
      const list = byPlatform.get(it.platform) ?? []
      list.push({ name: it.objective, defaultDays: it.days })
      byPlatform.set(it.platform, list)
    }
    return Array.from(byPlatform.entries()).map(([platform, phases]) => ({ platform, phases }))
  }, [linkSocial, strategyItems, socialSplitsEditable])

  // Carte SMS/RCS si incluse
  const smsPlatformLabel = smsType === 'sms' ? 'SMS' : 'RCS'
  const linkedSmsCard: RetroPlatformPhase | null = linkSms
    ? { platform: smsPlatformLabel, phases: smsPhases ?? [] }
    : null

  const hasLinkedCards =
    linkedSocialCards.length > 0 ||
    linkedSmsCard ||
    (socialSplitsEditable && strategyItems.length > 0)
  const showPhasesSection = hasPlatforms || hasLinkedCards

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-border/50 bg-gradient-to-br from-muted/40 via-background to-background">
        <h3 className="text-base font-semibold text-foreground tracking-tight">Paramétrage du rétroplanning</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
          {paramsEditable
            ? 'Indiquez la période, activez les réseaux concernés, détaillez les phases puis lancez la répartition sur le calendrier.'
            : 'Consultation du calendrier ; pour modifier les paramètres, passez par les onglets concernés ou « Partir de 0 ».'}
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock className="h-3.5 w-3.5 opacity-80" aria-hidden />
            Période de diffusion
          </div>
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex flex-col gap-1.5 min-w-[11rem]">
              <Label htmlFor="retro-start-date" className="text-xs font-medium text-foreground">
                Date de début
              </Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  id="retro-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="h-10 pl-8 text-sm rounded-xl border-border/80 bg-background"
                  disabled={!paramsEditable}
                  title={!paramsEditable ? 'Modifiable uniquement en « Partir de 0 »' : undefined}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-[8.25rem]">
              <Label htmlFor="retro-duration" className="text-xs font-medium text-foreground">
                Durée totale
              </Label>
              <div
                className={cn(
                  'flex h-10 rounded-xl border border-border/80 bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
                  !paramsEditable && 'opacity-60 pointer-events-none',
                )}
              >
                <Input
                  id="retro-duration"
                  type="number"
                  min={1}
                  max={730}
                  value={durationDays}
                  onChange={(e) =>
                    onDurationDaysChange(Math.max(1, Math.min(730, Math.floor(Number(e.target.value) || 1))))
                  }
                  placeholder="90"
                  className="h-10 flex-1 min-w-0 border-0 rounded-none text-sm text-center tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-1"
                  disabled={!paramsEditable}
                  title={
                    !paramsEditable
                      ? 'Modifiable uniquement en « Partir de 0 »'
                      : 'Nombre de jours (ex. 90 ≈ 3 mois)'
                  }
                  aria-describedby="retro-duration-unit"
                />
                <div
                  id="retro-duration-unit"
                  className="flex items-center px-2.5 text-xs font-medium text-muted-foreground bg-muted/50 border-l border-border/60 shrink-0"
                >
                  jours
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Layers className="h-3.5 w-3.5 opacity-80" aria-hidden />
              Plateformes actives
            </div>
            <p className="text-[11px] text-muted-foreground sm:max-w-md sm:text-right leading-relaxed flex items-start gap-1.5 sm:justify-end">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" aria-hidden />
              <span>
                {paramsEditable
                  ? 'Cliquez sur une carte pour l’ajouter ou la retirer. Couleur = même code que sur la frise.'
                  : 'La liste reflète votre configuration actuelle (stratégies liées ou « Partir de 0 »).'}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availablePlatforms.map((platform) => {
              const isSelected = !!platformPhases.find((p) => p.platform === platform)
              const dot = getPlatformColor(platform)
              return (
                <label
                  key={platform}
                  htmlFor={`platform-${platform}`}
                  className={cn(
                    'relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                    'hover:bg-muted/50',
                    isSelected
                      ? 'border-2 shadow-sm bg-background'
                      : 'border-border/70 bg-muted/15 border-dashed',
                    !paramsEditable && 'pointer-events-none opacity-55 cursor-not-allowed',
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: dot,
                          boxShadow: `0 1px 0 0 color-mix(in srgb, ${dot} 35%, transparent)`,
                        }
                      : undefined
                  }
                >
                  <Checkbox
                    id={`platform-${platform}`}
                    className="shrink-0"
                    checked={isSelected}
                    disabled={!paramsEditable}
                    onCheckedChange={(c) => togglePlatform(platform, c === true)}
                  />
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                    style={{ backgroundColor: dot }}
                  />
                  <span className={cn('truncate', isSelected ? 'text-foreground' : 'text-muted-foreground')}>
                    {platform}
                  </span>
                </label>
              )
            })}
          </div>
        </section>

        <section className="space-y-3 pt-1 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Phases par plateforme
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
              {paramsEditable
                ? 'Chaque ligne = une phase sur la frise. Le nom et la durée (en jours) se synchronisent avec le calendrier une fois les barres en place.'
                : 'Les blocs « Stratégie » sont en lecture seule ; modifiez Social media ou SMS selon le cas.'}
            </p>
          </div>
        <div className="max-h-[min(32rem,70vh)] overflow-y-auto pr-1 -mr-1">
          {!showPhasesSection ? (
            <p className="text-sm text-muted-foreground py-4">
              Cochez des plateformes ci-dessus ou incluez une stratégie Social / SMS pour voir les cartes et configurer des phases.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {/* Vos plateformes : éditables uniquement en « Partir de 0 » */}
              {platformPhases.map(({ platform, phases, singleLineDays }) => {
                const accent = getPlatformColor(platform)
                return (
                  <div
                    key={platform}
                    className="group rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="h-1 w-full" style={{ backgroundColor: accent }} />
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                              style={{ backgroundColor: accent }}
                            />
                            <span className="truncate">{platform}</span>
                          </div>
                          {fromScratchRetro && phases.length === 0 && singleLineDays != null ? (
                            <p className="text-[11px] text-muted-foreground mt-1 tabular-nums pl-5">
                              Une barre unique sur la frise · {singleLineDays} jours
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums',
                            phases.length === 0
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary/10 text-primary',
                          )}
                        >
                          {phases.length === 0 ? '1 créneau' : `${phases.length} phase${phases.length > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      {phases.length === 0 && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Découpez la diffusion en plusieurs phases ci-dessous, ou laissez une seule ligne sur le calendrier.
                        </p>
                      )}
                      <ul className="space-y-2">
                        {phases.map((phase, idx) =>
                          paramsEditable ? (
                            <li key={`${platform}-${idx}`} className="flex gap-2 items-stretch">
                              <div
                                className="w-1 rounded-full shrink-0 self-stretch opacity-90"
                                style={{ backgroundColor: accent }}
                                aria-hidden
                              />
                              <div className="flex flex-1 min-w-0 gap-2 items-center rounded-xl border border-border/80 bg-background/80 px-2.5 py-2">
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Phase {idx + 1}
                                  </span>
                                  <Input
                                    className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 font-medium"
                                    value={phase.name}
                                    onChange={(e) => updatePhaseName(platform, idx, e.target.value)}
                                    placeholder="Nom affiché sur la frise"
                                  />
                                </div>
                                <div className="flex h-9 shrink-0 rounded-lg border border-border/70 bg-muted/30 overflow-hidden">
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-9 w-12 border-0 bg-transparent text-center text-sm tabular-nums rounded-none shadow-none focus-visible:ring-0 px-1"
                                    value={phase.defaultDays ?? DEFAULT_PHASE_DAYS}
                                    onChange={(e) =>
                                      updatePhaseDays(
                                        platform,
                                        idx,
                                        Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                      )
                                    }
                                    title="Durée en jours"
                                    aria-label={`Durée en jours pour ${phase.name || 'la phase'}`}
                                  />
                                  <span className="flex items-center px-2 text-[10px] font-semibold text-muted-foreground bg-muted/50 border-l border-border/60">
                                    j
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => removePhase(platform, idx)}
                                  aria-label={`Supprimer ${phase.name || 'la phase'}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ) : (
                            <li
                              key={`${platform}-${idx}`}
                              className="flex items-center gap-2 text-sm text-foreground pl-3 border-l-2 border-muted"
                            >
                              <span className="font-medium">{phase.name}</span>
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {phase.defaultDays ?? DEFAULT_PHASE_DAYS} j
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                      {paramsEditable && (
                        <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 px-3 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
                          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border/60">
                              <Plus className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium text-foreground sm:hidden">Nouvelle phase</span>
                          </div>
                          <Input
                            className="h-9 flex-1 min-w-0 rounded-lg border-border/60 bg-background text-sm"
                            placeholder="Nom de la nouvelle phase…"
                            value={newPhaseName[platform] ?? ''}
                            onChange={(e) =>
                              setNewPhaseName((prev) => ({ ...prev, [platform]: e.target.value }))
                            }
                            onKeyDown={(e) => e.key === 'Enter' && addPhase(platform)}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-9 shrink-0 font-medium"
                            onClick={() => addPhase(platform)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                            Ajouter la phase
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {/* Social : découpage rétro par ligne (somme des jours = jours de la ligne dans l’onglet Social) */}
              {socialSplitsEditable &&
                strategyItems.map((item) => {
                  const lineKey = retroStrategyLineKey(item.platform, item.objective)
                  const totalDays = Math.max(1, item.days ?? strategyDaysFallback)
                  const rawSegs =
                    linkedSocialLineSplits[lineKey] && linkedSocialLineSplits[lineKey]!.length > 0
                      ? linkedSocialLineSplits[lineKey]!
                      : [{ name: item.objective, days: totalDays }]
                  const segments = rebalanceRetroSocialSegments(rawSegs, totalDays)
                  const commit = (next: { name: string; days: number }[]) => {
                    onLinkedSocialLineSplitsChange!(
                      lineKey,
                      rebalanceRetroSocialSegments(
                        next.length ? next : [{ name: item.objective, days: totalDays }],
                        totalDays,
                      ),
                    )
                  }
                  return (
                    <div
                      key={`split-${lineKey}`}
                      className="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-gradient-to-b from-amber-50/80 to-background dark:from-amber-950/30 dark:to-card overflow-hidden shadow-sm"
                    >
                      <div className="h-0.5 w-full bg-amber-500/90 dark:bg-amber-600" />
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="text-sm font-semibold flex items-center gap-2 min-w-0"
                            style={{ color: getPlatformColor(item.platform) }}
                          >
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                              style={{ backgroundColor: getPlatformColor(item.platform) }}
                            />
                            <span className="truncate">{item.platform}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 font-medium shrink-0">
                            Stratégie Social
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <span className="font-medium text-foreground">{item.objective}</span>
                          {' · '}
                          <span className="tabular-nums">{totalDays} j</span> au total (onglet Social). Phases rétro
                          uniquement : la somme vaut toujours {totalDays} j.
                        </p>
                        <ul className="space-y-2">
                          {segments.map((seg, idx) => (
                            <li
                              key={`${lineKey}-seg-${idx}-${seg.name}`}
                              className="flex gap-2 items-center flex-wrap sm:flex-nowrap"
                            >
                              <Input
                                className="h-9 flex-1 min-w-[120px] text-sm rounded-xl border-border/70"
                                value={seg.name}
                                onChange={(e) => {
                                  const next = segments.map((s, i) =>
                                    i === idx ? { ...s, name: e.target.value } : s,
                                  )
                                  commit(next)
                                }}
                                placeholder="Nom de la phase rétro"
                              />
                              <div className="flex h-9 rounded-lg border border-border/70 bg-background overflow-hidden shrink-0">
                                <Input
                                  type="number"
                                  min={1}
                                  max={totalDays}
                                  className="h-9 w-12 border-0 text-center text-sm tabular-nums rounded-none shadow-none focus-visible:ring-0"
                                  value={seg.days}
                                  onChange={(e) => {
                                    const v = Math.max(1, Math.floor(Number(e.target.value) || 1))
                                    const next = segments.map((s, i) => (i === idx ? { ...s, days: v } : s))
                                    commit(next)
                                  }}
                                  title="Durée en jours (rééquilibrage automatique sur le total)"
                                />
                                <span className="flex items-center px-2 text-[10px] font-semibold text-muted-foreground bg-muted/40 border-l border-border/60">
                                  j
                                </span>
                              </div>
                              {segments.length > 1 ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={() => commit(segments.filter((_, i) => i !== idx))}
                                  aria-label="Supprimer la phase"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-xl border border-dashed border-amber-300/50 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-3">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-9 font-medium"
                            onClick={() =>
                              commit([
                                ...segments.map((s) => ({ ...s })),
                                { name: `Phase ${segments.length + 1}`, days: 1 },
                              ])
                            }
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                            Ajouter une phase
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              {!socialSplitsEditable &&
                linkedSocialCards.map(({ platform, phases }) => (
                <div
                  key={`linked-${platform}`}
                  className="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-gradient-to-b from-amber-50/80 to-background dark:from-amber-950/30 dark:to-card overflow-hidden shadow-sm"
                >
                  <div className="h-0.5 w-full bg-amber-500/90 dark:bg-amber-600" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="text-sm font-semibold flex items-center gap-2 min-w-0"
                        style={{ color: getPlatformColor(platform) }}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                          style={{ backgroundColor: getPlatformColor(platform) }}
                        />
                        <span className="truncate">{platform}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 font-medium shrink-0">
                        Stratégie Social
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {phases.length === 0 ? '1 créneau' : `${phases.length} phase${phases.length > 1 ? 's' : ''}`}
                      {!linkedSocialEditable || !paramsEditable ? ' · lecture seule' : null}
                    </span>
                    {phases.length === 0 && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sans phase : une seule ligne sur la frise. Éditez les objectifs dans l’onglet Social media.
                      </p>
                    )}
                    {!linkedSocialEditable || !paramsEditable ? (
                      <ul className="space-y-2 list-none">
                        {phases.map((ph, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-foreground flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pl-3 border-l-2 border-amber-200 dark:border-amber-800"
                          >
                            <span className="font-medium">{ph.name}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {ph.defaultDays ?? DEFAULT_PHASE_DAYS} j
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <ul className="space-y-2">
                          {phases.map((ph, idx) => (
                            <li key={idx} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                              <Input
                                className="h-9 flex-1 min-w-[120px] text-sm rounded-xl border-border/70"
                                value={ph.name}
                                onChange={(e) => onLinkedSocialPhaseUpdate?.(platform, idx, { name: e.target.value })}
                                placeholder="Nom de la phase"
                              />
                              <div className="flex h-9 rounded-lg border border-border/70 bg-background overflow-hidden shrink-0">
                                <Input
                                  type="number"
                                  min={1}
                                  className="h-9 w-12 border-0 text-center text-sm tabular-nums rounded-none shadow-none focus-visible:ring-0"
                                  value={ph.defaultDays ?? DEFAULT_PHASE_DAYS}
                                  onChange={(e) =>
                                    onLinkedSocialPhaseUpdate?.(platform, idx, {
                                      days: Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                    })
                                  }
                                  title="Durée en jours"
                                />
                                <span className="flex items-center px-2 text-[10px] font-semibold text-muted-foreground bg-muted/40 border-l border-border/60">
                                  j
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                                onClick={() => onLinkedSocialPhaseRemove?.(platform, ph.name)}
                                aria-label="Supprimer la phase"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        {onLinkedSocialPhaseAdd && (
                          <div className="rounded-xl border border-dashed border-amber-300/50 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
                            <Input
                              className="h-9 flex-1 min-w-0 rounded-lg bg-background text-sm"
                              placeholder="Nom de la nouvelle phase…"
                              value={newPhaseName[`linked-${platform}`] ?? ''}
                              onChange={(e) =>
                                setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const name =
                                    newPhaseName[`linked-${platform}`]?.trim() || `Phase ${phases.length + 1}`
                                  onLinkedSocialPhaseAdd(platform, name, DEFAULT_PHASE_DAYS)
                                  setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: '' }))
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-9 shrink-0"
                              onClick={() => {
                                const name =
                                  newPhaseName[`linked-${platform}`]?.trim() || `Phase ${phases.length + 1}`
                                onLinkedSocialPhaseAdd(platform, name, DEFAULT_PHASE_DAYS)
                                setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: '' }))
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Ajouter
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {/* Carte SMS / RCS : phases stockées dans l’état rétro uniquement */}
              {linkedSmsCard && (
                <div
                  key={`linked-${linkedSmsCard.platform}`}
                  className="rounded-2xl border border-sky-200/60 dark:border-sky-800/40 bg-gradient-to-b from-sky-50/80 to-background dark:from-sky-950/30 dark:to-card overflow-hidden shadow-sm"
                >
                  <div className="h-0.5 w-full bg-sky-500/90 dark:bg-sky-600" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="text-sm font-semibold flex items-center gap-2 min-w-0"
                        style={{ color: getPlatformColor(linkedSmsCard.platform) }}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background"
                          style={{ backgroundColor: getPlatformColor(linkedSmsCard.platform) }}
                        />
                        <span className="truncate">{linkedSmsCard.platform}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/90 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-medium shrink-0">
                        Stratégie {smsType === 'sms' ? 'SMS' : 'RCS'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {paramsEditable
                        ? `Ces phases servent uniquement au rétroplanning / PDF ; l’onglet ${smsType === 'sms' ? 'SMS' : 'RCS'} reste inchangé.`
                        : `Durées : modifiez-les dans l’onglet ${smsType === 'sms' ? 'SMS' : 'RCS'}, ou repassez en « Partir de 0 ».`}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {linkedSmsCard.phases.length === 0
                        ? '1 créneau'
                        : `${linkedSmsCard.phases.length} phase${linkedSmsCard.phases.length > 1 ? 's' : ''}`}
                      {!smsRetroPhasesEditable ? ' · lecture seule' : null}
                    </span>
                    {smsCampaignTotalDays != null && linkedSmsCard.phases.length > 0 ? (
                      <span className="text-[11px] text-muted-foreground tabular-nums block">
                        Somme des phases :{' '}
                        {linkedSmsCard.phases.reduce((s, p) => s + (p.defaultDays ?? 1), 0)} j — plafond campagne :{' '}
                        {smsCampaignTotalDays} j
                      </span>
                    ) : null}
                    {linkedSmsCard.phases.length === 0 && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {paramsEditable
                          ? 'Ajoutez des phases pour découper la campagne dans le temps sur la frise.'
                          : 'Paramétrez dans l’onglet SMS / RCS pour une campagne multi-phases.'}
                      </p>
                    )}
                    {!smsRetroPhasesEditable ? (
                      <ul className="space-y-2 list-none">
                        {linkedSmsCard.phases.map((ph, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-foreground flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pl-3 border-l-2 border-sky-200 dark:border-sky-800"
                          >
                            <span className="font-medium">{ph.name}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {ph.defaultDays ?? DEFAULT_PHASE_DAYS} j
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <ul className="space-y-2">
                          {linkedSmsCard.phases.map((ph, idx) => (
                            <li key={idx} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                              <Input
                                className="h-9 flex-1 min-w-[120px] text-sm rounded-xl border-border/70"
                                value={ph.name}
                                onChange={(e) => updateSmsPhaseName(idx, e.target.value)}
                                placeholder="Nom de la phase"
                              />
                              <div className="flex h-9 rounded-lg border border-border/70 bg-background overflow-hidden shrink-0">
                                <Input
                                  type="number"
                                  min={1}
                                  className="h-9 w-12 border-0 text-center text-sm tabular-nums rounded-none shadow-none focus-visible:ring-0"
                                  value={ph.defaultDays ?? DEFAULT_PHASE_DAYS}
                                  onChange={(e) =>
                                    updateSmsPhaseDays(
                                      idx,
                                      Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                    )
                                  }
                                  title="Durée en jours"
                                />
                                <span className="flex items-center px-2 text-[10px] font-semibold text-muted-foreground bg-muted/40 border-l border-border/60">
                                  j
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                                onClick={() => removeSmsPhase(idx)}
                                aria-label="Supprimer la phase"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-xl border border-dashed border-sky-300/50 dark:border-sky-700/50 bg-sky-50/50 dark:bg-sky-950/25 px-3 py-3 flex flex-col sm:flex-row gap-2 sm:items-center">
                          <Input
                            className="h-9 flex-1 min-w-0 rounded-lg bg-background text-sm"
                            placeholder="Nom de la nouvelle phase…"
                            value={newPhaseName[smsKeyForNewName] ?? ''}
                            onChange={(e) =>
                              setNewPhaseName((prev) => ({ ...prev, [smsKeyForNewName]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSmsPhase()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-9 shrink-0"
                            onClick={addSmsPhase}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Ajouter
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            Les durées saisies ici servent de base à la frise ; vous pourrez encore déplacer les barres sur le calendrier.
          </p>
          <Button
            type="button"
            onClick={onApplyDistribution}
            disabled={!hasPlatforms || durationDays < 1}
            className="order-1 sm:order-2 shrink-0 rounded-xl bg-[#E94C16] hover:bg-[#d43f12] text-white shadow-sm"
          >
            Répartir sur le calendrier
          </Button>
        </div>
      </div>
    </div>
  )
}
