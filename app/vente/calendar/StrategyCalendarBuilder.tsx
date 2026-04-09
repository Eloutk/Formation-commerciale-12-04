'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalendarStore } from './store'
import type { CalendarPlatformSource, StrategyCalendarData, CalendarTimeGranularity } from './types'
import { getDayIndex, validateItems } from '@/lib/utils/calendarEngine'
import { CalendarToolbar } from './CalendarToolbar'
import { TimelineView } from './TimelineView'

export interface StrategyCalendarBuilderProps {
  /** Plateformes issues de la stratégie (budget, KPI, maxDays) */
  platformSources: CalendarPlatformSource[]
  /** Nombre de jours de diffusion */
  duration: number
  /** Données calendrier existantes (sauvegardées) */
  existing?: StrategyCalendarData | null
  /** Callback quand les données doivent être persistées (fermeture modale, ou auto si autoPersist) */
  onSave?: (data: StrategyCalendarData) => void
  /**
   * Si true avec onSave : enregistre depuis le store après chaque modification (debounce).
   * Ne pas utiliser si onSave ferme une modale ou modifie un id de stratégie.
   */
  autoPersist?: boolean
  /** Callback quand l'utilisateur définit une date de début en cliquant sur un jour (entrée unique plateforme+objectif) */
  onPlatformStartDateChange?: (entryKey: string, startDate: string) => void
  /** Callback quand l'utilisateur modifie le nombre de jours de diffusion dans le calendrier (entrée unique plateforme+objectif) */
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  /** Messages d'avertissement (règles durée / budget quotidien non respectées) pour le calendrier */
  calendarWarnings?: string[]
  /** Enfants optionnels (contenu au-dessus du calendrier) */
  children?: React.ReactNode
  /** Export PDF (ex. document structuré rétroplanning) : fichier + callback */
  exportPdf?: { filename: string; onExport: () => Promise<void> }
  /** Affichage large (onglet Rétroplanning plein écran) */
  fullWidth?: boolean
  /** Afficher 2 mois côte à côte (onglet Rétroplanning). false = 1 mois (modale stratégie) */
  twoMonths?: boolean
  /** Forcer la granularité (ex. 'week' pour timeline glisser-déposer sur longue période) */
  forceTimeGranularity?: CalendarTimeGranularity
  /** Bandeau titre (ex. onglet rétroplanning), même style que le paramétrage */
  headerTitle?: string
  /** Texte d’aide sous le titre */
  headerDescription?: string
}

/** Snapshot stable pour comparer store ↔ props (évite boucle autoPersist → onSave → re-init). */
function snapshotCalendarData(data: StrategyCalendarData): string {
  return JSON.stringify({
    startDate: data.startDate,
    duration: data.duration,
    items: data.items.map(({ platform, startDay, length, budget, kpiLabel, objective }) => ({
      platform,
      startDay,
      length,
      budget,
      kpiLabel,
      objective,
    })),
  })
}

export function StrategyCalendarBuilder({
  platformSources,
  duration,
  existing,
  onSave,
  autoPersist = false,
  onPlatformStartDateChange,
  onPlatformDaysChange,
  calendarWarnings,
  children,
  exportPdf,
  fullWidth,
  twoMonths = false,
  forceTimeGranularity,
  headerTitle,
  headerDescription,
}: StrategyCalendarBuilderProps) {
  const [exportingPdf, setExportingPdf] = useState(false)
  const initFromStrategy = useCalendarStore((s) => s.initFromStrategy)
  const getCalendarData = useCalendarStore((s) => s.getCalendarData)
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
    if (!forceTimeGranularity) return
    const cur = useCalendarStore.getState().timeGranularity
    if (cur === 'frise') return
    setTimeGranularity(forceTimeGranularity)
  }, [forceTimeGranularity, setTimeGranularity])

  const onSaveRef = useRef(onSave)
  const existingRef = useRef(existing)
  onSaveRef.current = onSave
  existingRef.current = existing

  useEffect(() => {
    if (!autoPersist) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let prevSlice = ''
    const lastPersistedSnap = { current: '' }

    const persistNow = () => {
      if (!onSaveRef.current) return
      const data = useCalendarStore.getState().getCalendarData()
      if (!validateItems(data.items, data.duration).valid) return
      const snap = snapshotCalendarData(data)
      if (snap === lastPersistedSnap.current) return
      const ex = existingRef.current
      if (ex && snapshotCalendarData(ex) === snap) {
        lastPersistedSnap.current = snap
        return
      }
      lastPersistedSnap.current = snap
      onSaveRef.current(data)
    }

    const unsub = useCalendarStore.subscribe((state) => {
      const slice = snapshotCalendarData({
        startDate: state.startDate,
        duration: state.duration,
        items: state.items.map(({ platform, startDay, length, budget, kpiLabel, objective }) => ({
          platform,
          startDay,
          length,
          budget,
          kpiLabel,
          objective,
        })),
      })
      if (slice === prevSlice) return
      prevSlice = slice
      if (timer) clearTimeout(timer)
      timer = setTimeout(persistNow, 400)
    })

    return () => {
      unsub()
      if (timer) clearTimeout(timer)
      persistNow()
    }
  }, [autoPersist])

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
    <div className="w-full min-h-0 rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col">
      {headerTitle ? (
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-border/50 bg-gradient-to-br from-muted/40 via-background to-background shrink-0">
          <h3 className="text-base font-semibold text-foreground tracking-tight">{headerTitle}</h3>
          {headerDescription ? (
            <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">{headerDescription}</p>
          ) : null}
        </div>
      ) : null}

      <div className="w-full flex flex-col gap-4 min-h-0 p-4 sm:p-5">
        <div className="flex justify-center w-full">
          <div className={`w-full ${maxWidthClass} flex flex-col gap-3`}>
            <CalendarToolbar showGranularitySelector={fullWidth} />
            {children}
          </div>
        </div>

        <div className="flex justify-center w-full min-h-0">
          <div className={`w-full ${maxWidthClass} min-h-0`}>
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

        {exportPdf ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border/50 shrink-0">
            <p className="text-xs text-muted-foreground order-2 sm:order-1">
              Export PDF : semaines, mois ou les deux, depuis la fenêtre qui s’ouvre après le clic.
            </p>
            <Button
              type="button"
              variant="outline"
              className="order-1 sm:order-2 gap-2 shrink-0 rounded-xl border-border/70"
              disabled={exportingPdf || storeItems.length === 0}
              onClick={handleExportPdf}
            >
              <Download className="h-4 w-4" />
              Télécharger le calendrier (PDF)
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
