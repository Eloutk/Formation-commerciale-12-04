'use client'

import React, { useEffect } from 'react'
import { useCalendarStore } from './store'
import type { CalendarPlatformSource, StrategyCalendarData } from './types'
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
  /** Enfants optionnels (ex: bouton Enregistrer en bas du panneau) */
  children?: React.ReactNode
}

export function StrategyCalendarBuilder({
  platformSources,
  duration,
  existing,
  onSave,
  children,
}: StrategyCalendarBuilderProps) {
  const initFromStrategy = useCalendarStore((s) => s.initFromStrategy)
  const getCalendarData = useCalendarStore((s) => s.getCalendarData)
  const validate = useCalendarStore((s) => s.validate)

  useEffect(() => {
    initFromStrategy(platformSources, duration, existing)
  }, [platformSources, duration, existing?.startDate, existing?.duration, existing?.items?.length, initFromStrategy])

  const handleSave = () => {
    if (!validate()) return
    const data = getCalendarData()
    onSave?.(data)
  }

  return (
    <div className="flex gap-4 p-4 min-h-0">
      <aside className="flex flex-col gap-4">
        <CalendarToolbar />
        {onSave && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer le calendrier
            </button>
          </div>
        )}
        {children}
      </aside>
      <main className="flex-1 min-w-0 min-h-0 overflow-auto flex flex-col max-h-[75vh]">
        <TimelineView />
      </main>
    </div>
  )
}
