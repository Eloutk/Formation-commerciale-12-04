'use client'

import React, { useEffect } from 'react'
import { useCalendarStore } from './store'
import type { CalendarPlatformSource, StrategyCalendarData, CalendarTimeGranularity } from './types'
import { CalendarToolbar } from './CalendarToolbar'
import { TimelineView } from './TimelineView'

export interface StrategyCalendarBuilderProps {
  /** Plateformes issues de la stratégie (budget, KPI, maxDays) */
  platformSources: CalendarPlatformSource[]
  /** Nombre de jours de diffusion */
  duration: number
  /** Données calendrier existantes (sauvegardées) */
  existing?: StrategyCalendarData | null
  /** Callback pour récupérer les données à sauvegarder */
  onSave?: (data: StrategyCalendarData) => void
  /** Callback quand l'utilisateur définit une date de début en cliquant sur un jour (entrée unique plateforme+objectif) */
  onPlatformStartDateChange?: (entryKey: string, startDate: string) => void
  /** Callback quand l'utilisateur modifie le nombre de jours de diffusion dans le calendrier (entrée unique plateforme+objectif) */
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  /** Messages d'avertissement (règles durée / budget quotidien non respectées) pour le calendrier */
  calendarWarnings?: string[]
  /** Enfants optionnels (ex: bouton Enregistrer en bas du panneau) */
  children?: React.ReactNode
  /** Affichage large (onglet Rétroplanning plein écran) */
  fullWidth?: boolean
  /** Afficher 2 mois côte à côte (onglet Rétroplanning). false = 1 mois (modale stratégie) */
  twoMonths?: boolean
  /** Forcer la granularité (ex. 'week' pour timeline glisser-déposer sur longue période) */
  forceTimeGranularity?: CalendarTimeGranularity
}

export function StrategyCalendarBuilder({
  platformSources,
  duration,
  existing,
  onSave,
  onPlatformStartDateChange,
  onPlatformDaysChange,
  calendarWarnings,
  children,
  fullWidth,
  twoMonths = false,
  forceTimeGranularity,
}: StrategyCalendarBuilderProps) {
  const initFromStrategy = useCalendarStore((s) => s.initFromStrategy)
  const getCalendarData = useCalendarStore((s) => s.getCalendarData)
  const validate = useCalendarStore((s) => s.validate)
  const setTimeGranularity = useCalendarStore((s) => s.setTimeGranularity)

  const itemsSignature = existing?.items?.map((i) => `${i.platform}-${i.startDay}-${i.length}`).join('|') ?? ''
  useEffect(() => {
    initFromStrategy(platformSources, duration, existing)
  }, [platformSources, duration, existing?.startDate, existing?.duration, itemsSignature, initFromStrategy])

  useEffect(() => {
    if (forceTimeGranularity) setTimeGranularity(forceTimeGranularity)
  }, [forceTimeGranularity, setTimeGranularity])

  const handleSave = () => {
    if (!validate()) return
    const data = getCalendarData()
    onSave?.(data)
  }

  const maxWidthClass = fullWidth ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl border bg-muted/20 min-h-0">
      {/* Barre d'info / erreurs au-dessus, centrée */}
      <div className="mb-1 flex justify-center">
        <div className={`w-full ${maxWidthClass} flex flex-col gap-2`}>
          <CalendarToolbar showGranularitySelector={fullWidth} />
          {children}
        </div>
      </div>

      {/* Calendrier centré dans l'encart, pleine largeur dispo */}
      <div className="flex justify-center">
        <div className={`w-full ${maxWidthClass}`}>
          <TimelineView
            onPlatformStartDateSet={onPlatformStartDateChange}
            onPlatformDaysChange={onPlatformDaysChange}
            calendarWarnings={calendarWarnings}
            twoMonths={twoMonths}
          />
        </div>
      </div>
      {onSave && (
        <div className="shrink-0 pt-2 border-t">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Enregistrer le calendrier
          </button>
        </div>
      )}
    </div>
  )
}
