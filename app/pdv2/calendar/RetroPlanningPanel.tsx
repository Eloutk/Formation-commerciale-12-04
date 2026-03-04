'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Download } from 'lucide-react'
import type { RetroPlatformPhase, RetroPhase, StrategyCalendarData } from './types'
import { getPlatformColor } from './colors'

const DEFAULT_PHASE_DAYS = 30

export interface RetroPlanningPanelProps {
  /** Plateformes disponibles (ordre d'affichage) */
  availablePlatforms: readonly string[]
  /** Date de début du planning */
  startDate: string
  onStartDateChange: (date: string) => void
  /** Durée totale en jours (ex. 365 pour un an) */
  durationDays: number
  onDurationDaysChange: (days: number) => void
  /** Plateformes et phases configurées */
  platformPhases: RetroPlatformPhase[]
  onPlatformPhasesChange: (config: RetroPlatformPhase[]) => void
  /** Appliquer la répartition sur le calendrier (sources + items auto-répartis) */
  onApplyDistribution: () => void
  /** Exporter le calendrier en PDF (données actuelles) */
  onExportPDF: () => void
  /** Données du calendrier pour afficher un résumé / activer export */
  calendarData?: StrategyCalendarData | null
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
  onExportPDF,
  calendarData,
}: RetroPlanningPanelProps) {
  const [newPhaseName, setNewPhaseName] = useState<Record<string, string>>({})

  const togglePlatform = (platform: string, checked: boolean) => {
    if (checked) {
      if (platformPhases.some((p) => p.platform === platform)) return
      onPlatformPhasesChange([...platformPhases, { platform, phases: [] }])
    } else {
      onPlatformPhasesChange(platformPhases.filter((p) => p.platform !== platform))
    }
  }

  const addPhase = (platform: string) => {
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
    onPlatformPhasesChange(
      platformPhases.map((p) => {
        if (p.platform !== platform) return p
        const phases = p.phases.filter((_, i) => i !== phaseIndex)
        return { ...p, phases }
      })
    )
  }

  const updatePhaseName = (platform: string, phaseIndex: number, name: string) => {
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

  const totalPhases = platformPhases.reduce((acc, p) => acc + p.phases.length, 0)
  const hasPlatforms = platformPhases.length > 0
  const hasData = (calendarData?.items?.length ?? 0) > 0

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
            placeholder="365"
          />
          <p className="text-xs text-muted-foreground">Ex. 365 pour un an, 730 pour 2 ans</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Plateformes et phases</Label>
        <p className="text-xs text-muted-foreground">
          Cochez les plateformes, ajoutez des phases (nom libre), répartissez sur le calendrier puis glissez-déposez pour ajuster.
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
                  onCheckedChange={(c) => togglePlatform(platform, c === true)}
                />
                <label
                  htmlFor={`platform-${platform}`}
                  className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
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

      {platformPhases.length > 0 && (
        <div className="space-y-3 border-t pt-3">
          <Label>Phases par plateforme</Label>
          <p className="text-xs text-muted-foreground">
            Chaque carte correspond à une plateforme. Limité à 3 colonnes pour garder une bonne lisibilité.
          </p>
          <div className="max-h-64 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {platformPhases.map(({ platform, phases }) => (
                <div
                  key={platform}
                  className="rounded-md border bg-muted/30 p-3 space-y-2 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
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
                    {phases.map((phase, idx) => (
                      <li key={`${platform}-${idx}`} className="flex items-center gap-2 flex-wrap">
                        <Input
                          className="h-8 flex-1 min-w-[120px] text-sm"
                          value={phase.name}
                          onChange={(e) => updatePhaseName(platform, idx, e.target.value)}
                          placeholder="Nom de la phase"
                        />
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={1}
                            className="h-8 w-16 text-sm"
                            value={phase.defaultDays ?? DEFAULT_PHASE_DAYS}
                            onChange={(e) =>
                              updatePhaseDays(
                                platform,
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
                          onClick={() => removePhase(platform, idx)}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button
          type="button"
          onClick={onApplyDistribution}
          disabled={!hasPlatforms || durationDays < 1}
          className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
        >
          Répartir sur le calendrier
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExportPDF}
          disabled={!hasData}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Télécharger le calendrier (PDF)
        </Button>
      </div>
    </div>
  )
}
