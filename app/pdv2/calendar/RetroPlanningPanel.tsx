'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import type { RetroPlatformPhase, RetroPhase } from './types'
import { getPlatformColor } from './colors'

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
}: RetroPlanningPanelProps) {
  const [newPhaseName, setNewPhaseName] = useState<Record<string, string>>({})

  const linkedSocialEditable = Boolean(
    onLinkedSocialPhaseAdd || onLinkedSocialPhaseRemove || onLinkedSocialPhaseUpdate,
  )

  /** Uniquement en « Partir de 0 » : date, durée, plateformes et durées de phases sont modifiables ici */
  const paramsEditable = fromScratchRetro

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
    if (!paramsEditable || !onSmsPhasesChange) return
    const name =
      newPhaseName[smsKeyForNewName]?.trim() || `Phase ${(smsPhases?.length ?? 0) + 1}`
    onSmsPhasesChange([...(smsPhases ?? []), { name, defaultDays: DEFAULT_PHASE_DAYS }])
    setNewPhaseName((prev) => ({ ...prev, [smsKeyForNewName]: '' }))
  }

  const updateSmsPhaseName = (phaseIndex: number, name: string) => {
    if (!paramsEditable || !onSmsPhasesChange) return
    onSmsPhasesChange(
      (smsPhases ?? []).map((ph, i) => (i === phaseIndex ? { ...ph, name } : ph)),
    )
  }

  const updateSmsPhaseDays = (phaseIndex: number, days: number) => {
    if (!paramsEditable || !onSmsPhasesChange) return
    onSmsPhasesChange(
      (smsPhases ?? []).map((ph, i) =>
        i === phaseIndex ? { ...ph, defaultDays: days } : ph,
      ),
    )
  }

  const removeSmsPhase = (phaseIndex: number) => {
    if (!paramsEditable || !onSmsPhasesChange) return
    onSmsPhasesChange((smsPhases ?? []).filter((_, i) => i !== phaseIndex))
  }

  const hasPlatforms = platformPhases.length > 0

  // Cartes issues de la stratégie Social (groupées par plateforme)
  const linkedSocialCards: RetroPlatformPhase[] = React.useMemo(() => {
    if (!linkSocial || !strategyItems?.length) return []
    const byPlatform = new Map<string, { name: string; defaultDays?: number }[]>()
    for (const it of strategyItems) {
      const list = byPlatform.get(it.platform) ?? []
      list.push({ name: it.objective, defaultDays: it.days })
      byPlatform.set(it.platform, list)
    }
    return Array.from(byPlatform.entries()).map(([platform, phases]) => ({ platform, phases }))
  }, [linkSocial, strategyItems])

  // Carte SMS/RCS si incluse
  const smsPlatformLabel = smsType === 'sms' ? 'SMS' : 'RCS'
  const linkedSmsCard: RetroPlatformPhase | null = linkSms
    ? { platform: smsPlatformLabel, phases: smsPhases ?? [] }
    : null

  const hasLinkedCards = linkedSocialCards.length > 0 || linkedSmsCard
  const showPhasesSection = hasPlatforms || hasLinkedCards

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Paramétrage du rétroplanning</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="retro-start-date">Date de début</Label>
          <Input
            id="retro-start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full"
            disabled={!paramsEditable}
            title={!paramsEditable ? 'Modifiable uniquement en « Partir de 0 »' : undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="retro-duration">Durée (jours)</Label>
          <Input
            id="retro-duration"
            type="number"
            min={1}
            max={730}
            value={durationDays}
            onChange={(e) => onDurationDaysChange(Math.max(1, Math.min(730, Math.floor(Number(e.target.value) || 1))))}
            placeholder="90"
            disabled={!paramsEditable}
            title={!paramsEditable ? 'Modifiable uniquement en « Partir de 0 »' : undefined}
          />
          <p className="text-xs text-muted-foreground">Ex. 90 pour environ 3 mois, 365 pour un an</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Plateformes et phases</Label>
        <p className="text-xs text-muted-foreground">
          {paramsEditable
            ? 'Cochez les plateformes, ajoutez des phases (nom libre), répartissez sur le calendrier puis glissez-déposez pour ajuster.'
            : 'Les plateformes et durées viennent des stratégies liées ou d’un paramétrage déjà défini : modifiez-les dans les onglets Social media / SMS ou repassez en « Partir de 0 ». Ici : consultation et calendrier.'}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {availablePlatforms.map((platform) => {
            const config = platformPhases.find((p) => p.platform === platform)
            const isSelected = !!config
            return (
              <div key={platform} className="flex items-center gap-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={isSelected}
                  disabled={!paramsEditable}
                  onCheckedChange={(c) => togglePlatform(platform, c === true)}
                />
                <label
                  htmlFor={`platform-${platform}`}
                  className={`text-sm font-medium flex items-center gap-1.5 ${paramsEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                  style={{ color: isSelected ? getPlatformColor(platform) : undefined }}
                >
                  <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getPlatformColor(platform) }} />
                  {platform}
                </label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-3 border-t pt-3">
        <Label>Phases par plateforme</Label>
        <p className="text-xs text-muted-foreground">
          {paramsEditable
            ? 'Ajoutez des phases : le nom et le nombre de jours (à droite du nom) sont modifiables ; après enregistrement du calendrier, les jours se synchronisent avec la frise. Les cartes issues des stratégies liées restent distinctes.'
            : 'Date, durée, plateformes et phases des lignes « vos » plateformes ne sont pas modifiables ici : elles se règlent dans l’onglet Social media et/ou SMS selon le cas, ou en repassant par « Partir de 0 ». Les cartes stratégie ci-dessous sont en lecture seule.'}
        </p>
        <div className="max-h-64 overflow-y-auto pr-1">
          {!showPhasesSection ? (
            <p className="text-sm text-muted-foreground py-4">
              Cochez des plateformes ci-dessus ou incluez une stratégie Social / SMS pour voir les cartes et configurer des phases.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {/* Vos plateformes : éditables uniquement en « Partir de 0 » */}
              {platformPhases.map(({ platform, phases, singleLineDays }) => (
                <div
                  key={platform}
                  className="rounded-md border bg-muted/30 p-3 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className="text-xs font-medium flex items-center justify-between gap-2"
                    style={{ color: getPlatformColor(platform) }}
                  >
                    <span className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getPlatformColor(platform) }}
                      />
                      {platform}
                      {fromScratchRetro && phases.length === 0 && singleLineDays != null && (
                        <span className="text-[11px] font-normal text-muted-foreground tabular-nums">
                          · {singleLineDays} j (frise)
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {phases.length === 0 ? '1 ligne' : `${phases.length} phase${phases.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  {phases.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Sans phase : la plateforme apparaît en une ligne. Ajoutez des phases pour la découper.
                    </p>
                  )}
                  <ul className="space-y-1.5">
                    {phases.map((phase, idx) =>
                      paramsEditable ? (
                        <li
                          key={`${platform}-${idx}`}
                          className="flex items-center gap-2"
                        >
                          <div className="flex flex-1 min-w-0 items-center gap-2 rounded-md border border-border/80 bg-background px-2 py-1 pr-1">
                            <Input
                              className="h-7 flex-1 min-w-[96px] border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                              value={phase.name}
                              onChange={(e) => updatePhaseName(platform, idx, e.target.value)}
                              placeholder="Nom de la phase"
                            />
                            <div className="flex items-center gap-1 shrink-0 border-l border-border/60 pl-2">
                              <Input
                                type="number"
                                min={1}
                                className="h-7 w-12 text-sm text-center tabular-nums px-1"
                                value={phase.defaultDays ?? DEFAULT_PHASE_DAYS}
                                onChange={(e) =>
                                  updatePhaseDays(
                                    platform,
                                    idx,
                                    Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                  )
                                }
                                title="Durée en jours"
                                aria-label={`Jours pour ${phase.name || 'la phase'}`}
                              />
                              <span className="text-[11px] text-muted-foreground pr-0.5">j</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                            onClick={() => removePhase(platform, idx)}
                            aria-label="Supprimer la phase"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </li>
                      ) : (
                        <li
                          key={`${platform}-${idx}`}
                          className="text-sm text-foreground flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
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
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        className="h-8 flex-1 min-w-[140px] text-sm"
                        placeholder="Nouvelle phase"
                        value={newPhaseName[platform] ?? ''}
                        onChange={(e) =>
                          setNewPhaseName((prev) => ({ ...prev, [platform]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && addPhase(platform)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => addPhase(platform)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {/* Cartes issues de la stratégie Social (lecture seule par défaut : ne pas modifier l’onglet Social) */}
              {linkedSocialCards.map(({ platform, phases }) => (
                <div
                  key={`linked-${platform}`}
                  className="rounded-md border border-l-4 border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20 dark:border-l-amber-600 p-3 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className="text-xs font-medium flex items-center justify-between gap-2"
                    style={{ color: getPlatformColor(platform) }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getPlatformColor(platform) }}
                      />
                      {platform}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 font-medium">
                      Stratégie Social
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {phases.length === 0 ? '1 ligne' : `${phases.length} phase${phases.length > 1 ? 's' : ''}`}
                    {!linkedSocialEditable || !paramsEditable ? ' · lecture seule' : null}
                  </span>
                  {phases.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Sans phase : la plateforme apparaît en une ligne. Modifiez les objectifs dans l’onglet Social
                      media.
                    </p>
                  )}
                  {!linkedSocialEditable || !paramsEditable ? (
                    <ul className="space-y-1.5 list-none">
                      {phases.map((ph, idx) => (
                        <li key={idx} className="text-sm text-foreground flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-medium">{ph.name}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {ph.defaultDays ?? DEFAULT_PHASE_DAYS} j
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <ul className="space-y-1.5">
                        {phases.map((ph, idx) => (
                          <li key={idx} className="flex items-center gap-2 flex-wrap">
                            <Input
                              className="h-8 flex-1 min-w-[120px] text-sm"
                              value={ph.name}
                              onChange={(e) => onLinkedSocialPhaseUpdate?.(platform, idx, { name: e.target.value })}
                              placeholder="Nom de la phase"
                            />
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={1}
                                className="h-8 w-16 text-sm"
                                value={ph.defaultDays ?? DEFAULT_PHASE_DAYS}
                                onChange={(e) =>
                                  onLinkedSocialPhaseUpdate?.(platform, idx, {
                                    days: Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                  })
                                }
                                title="Jours"
                              />
                              <span className="text-xs text-muted-foreground">j</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onLinkedSocialPhaseRemove?.(platform, ph.name)}
                              aria-label="Supprimer la phase"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      {onLinkedSocialPhaseAdd && (
                        <div className="flex items-center gap-2 pt-1">
                          <Input
                            className="h-8 flex-1 min-w-[140px] text-sm"
                            placeholder="Nouvelle phase"
                            value={newPhaseName[`linked-${platform}`] ?? ''}
                            onChange={(e) =>
                              setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const name = (newPhaseName[`linked-${platform}`]?.trim() || `Phase ${phases.length + 1}`)
                                onLinkedSocialPhaseAdd(platform, name, DEFAULT_PHASE_DAYS)
                                setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: '' }))
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              const name = (newPhaseName[`linked-${platform}`]?.trim() || `Phase ${phases.length + 1}`)
                              onLinkedSocialPhaseAdd(platform, name, DEFAULT_PHASE_DAYS)
                              setNewPhaseName((prev) => ({ ...prev, [`linked-${platform}`]: '' }))
                            }}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {/* Carte SMS / RCS : phases stockées dans l’état rétro uniquement */}
              {linkedSmsCard && (
                <div
                  key={`linked-${linkedSmsCard.platform}`}
                  className="rounded-md border border-l-4 border-l-sky-500 bg-sky-50/30 dark:bg-sky-950/20 dark:border-l-sky-600 p-3 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className="text-xs font-medium flex items-center justify-between gap-2"
                    style={{ color: getPlatformColor(linkedSmsCard.platform) }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getPlatformColor(linkedSmsCard.platform) }}
                      />
                      {linkedSmsCard.platform}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/90 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-medium">
                      Stratégie {smsType === 'sms' ? 'SMS' : 'RCS'}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {paramsEditable
                      ? `Phases utilisées uniquement pour ce rétroplanning (PDF). L’onglet ${smsType === 'sms' ? 'SMS' : 'RCS'} n’est pas modifié.`
                      : `Durées et phases : modifiez-les dans l’onglet ${smsType === 'sms' ? 'SMS' : 'RCS'} (ou repassez en « Partir de 0 »).`}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {linkedSmsCard.phases.length === 0
                      ? '1 ligne'
                      : `${linkedSmsCard.phases.length} phase${
                          linkedSmsCard.phases.length > 1 ? 's' : ''
                        }`}
                    {!paramsEditable ? ' · lecture seule' : null}
                  </span>
                  {linkedSmsCard.phases.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      {paramsEditable
                        ? 'Sans phase : la campagne apparaît en une ligne. Ajoutez des phases pour découper le message dans le temps.'
                        : 'Sans phase : la campagne apparaît en une ligne. Paramétrez dans l’onglet SMS / RCS.'}
                    </p>
                  )}
                  {!paramsEditable || !onSmsPhasesChange ? (
                    <ul className="space-y-1.5 list-none">
                      {linkedSmsCard.phases.map((ph, idx) => (
                        <li key={idx} className="text-sm text-foreground flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-medium">{ph.name}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {ph.defaultDays ?? DEFAULT_PHASE_DAYS} j
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <ul className="space-y-1.5">
                        {linkedSmsCard.phases.map((ph, idx) => (
                          <li key={idx} className="flex items-center gap-2 flex-wrap">
                            <Input
                              className="h-8 flex-1 min-w-[120px] text-sm"
                              value={ph.name}
                              onChange={(e) => updateSmsPhaseName(idx, e.target.value)}
                              placeholder="Nom de la phase"
                            />
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={1}
                                className="h-8 w-16 text-sm"
                                value={ph.defaultDays ?? DEFAULT_PHASE_DAYS}
                                onChange={(e) =>
                                  updateSmsPhaseDays(
                                    idx,
                                    Math.max(1, Math.floor(Number(e.target.value) || 1)),
                                  )
                                }
                                title="Jours"
                              />
                              <span className="text-xs text-muted-foreground">j</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeSmsPhase(idx)}
                              aria-label="Supprimer la phase"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 pt-1">
                        <Input
                          className="h-8 flex-1 min-w-[140px] text-sm"
                          placeholder="Nouvelle phase"
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
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={addSmsPhase}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button
          type="button"
          onClick={onApplyDistribution}
          disabled={!hasPlatforms || durationDays < 1}
          className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
        >
          Répartir sur le calendrier
        </Button>
      </div>
    </div>
  )
}
