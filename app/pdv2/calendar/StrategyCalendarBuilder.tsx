'use client'

import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalendarStore } from './store'
import type { CalendarPlatformSource, StrategyCalendarData, CalendarTimeGranularity } from './types'
import { getDayIndex } from '@/lib/utils/calendarEngine'
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
  /** Export PDF (ex. document structuré rétroplanning) : fichier + callback */
  exportPdf?: { filename: string; onExport: () => Promise<void> }
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
  exportPdf,
  fullWidth,
  twoMonths = false,
  forceTimeGranularity,
}: StrategyCalendarBuilderProps) {
  const [exportingPdf, setExportingPdf] = useState(false)
  const initFromStrategy = useCalendarStore((s) => s.initFromStrategy)
  const getCalendarData = useCalendarStore((s) => s.getCalendarData)
  const validate = useCalendarStore((s) => s.validate)
  const storeItems = useCalendarStore((s) => s.items)
  const setTimeGranularity = useCalendarStore((s) => s.setTimeGranularity)
  const storeStartDate = useCalendarStore((s) => s.startDate)
  const storeDuration = useCalendarStore((s) => s.duration)
  const moveItem = useCalendarStore((s) => s.moveItem)
  const resizeItem = useCalendarStore((s) => s.resizeItem)

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

  const handleExportPdf = async () => {
    if (!exportPdf || storeItems.length === 0) return
    setExportingPdf(true)
    try {
      await exportPdf.onExport()
    } finally {
      setExportingPdf(false)
    }
  }

  const maxWidthClass = fullWidth ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl border bg-muted/20 min-h-0">
      <div className="w-full flex flex-col gap-3 min-h-0 rounded-md bg-background">
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
            onPlatformStartDateSet={
              storeStartDate && storeDuration > 0
                ? (entryKey: string, dateStr: string) => {
                    const dayIndex = getDayIndex(dateStr, storeStartDate)
                    moveItem(entryKey, Math.max(0, Math.min(dayIndex, storeDuration - 1)))
                    onPlatformStartDateChange?.(entryKey, dateStr)
                  }
                : onPlatformStartDateChange
            }
            onPlatformDaysChange={
              onPlatformDaysChange
                ? (key, days) => {
                    resizeItem(key, days)
                    onPlatformDaysChange(key, days)
                  }
                : undefined
            }
            calendarWarnings={calendarWarnings}
            twoMonths={twoMonths}
          />
          </div>
        </div>
      </div>
      {onSave && (
        <div className="shrink-0 pt-2 border-t flex flex-wrap gap-2 items-stretch">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-w-[140px] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Enregistrer le calendrier
          </button>
          {exportPdf ? (
            <Button
              type="button"
              variant="outline"
              className="gap-2 shrink-0"
              disabled={exportingPdf || storeItems.length === 0}
              onClick={handleExportPdf}
            >
              <Download className="h-4 w-4" />
              Télécharger le calendrier (PDF)
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
