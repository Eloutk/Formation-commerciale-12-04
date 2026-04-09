'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { getPlatformColor, getPlatformPhaseColor, getPhaseIndexByPlatformKey } from './colors'
import { useCalendarStore } from './store'
import type { CalendarItem } from './types'
import { getDayIndex } from '@/lib/utils/calendarEngine'
import { calendarItemsForDisplayGrouped } from './calendarDisplayItems'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function monthKey(year: number, month: number): number {
  return year * 12 + month
}

/** JJ/MM/YYYY court */
function formatFrenchShort(iso: string): string {
  if (!iso || iso.length < 10) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function isPlatformActiveOnDay(
  item: CalendarItem,
  dayIndex: number,
  duration: number,
): boolean {
  return (
    dayIndex >= 0 &&
    dayIndex < duration &&
    dayIndex >= item.startDay &&
    dayIndex < item.startDay + item.length
  )
}

export function MonthGridView({
  startDate,
  duration,
  items,
  onPlatformStartDateSet,
  onPlatformDaysChange,
  calendarWarnings,
  twoMonths = false,
  showLegend = true,
}: {
  startDate: string
  duration: number
  items: CalendarItem[]
  onPlatformStartDateSet?: (entryKey: string, startDate: string) => void
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  calendarWarnings?: string[]
  /** true = afficher 2 mois côte à côte (onglet Rétroplanning), false = 1 mois (modale stratégie) */
  twoMonths?: boolean
  /** false = masquer la légende à droite (vue rétroplanning 2 mois) */
  showLegend?: boolean
}) {
  const selectedPlatformKey = useCalendarStore((s) => s.selectedPlatform)
  const setSelectedPlatform = useCalendarStore((s) => s.setSelectedPlatform)

  const [displayYear, setDisplayYear] = useState(() => {
    if (!startDate) return new Date().getFullYear()
    return parseInt(startDate.slice(0, 4), 10)
  })
  const [displayMonth, setDisplayMonth] = useState(() => {
    if (!startDate) return new Date().getMonth() + 1
    return parseInt(startDate.slice(5, 7), 10)
  })

  const planningBounds = useMemo(() => {
    if (!startDate) return null
    const dur = Math.max(1, Math.floor(duration) || 1)
    const start = new Date(startDate + 'T12:00:00')
    if (Number.isNaN(start.getTime())) return null
    const end = new Date(startDate + 'T12:00:00')
    end.setDate(end.getDate() + dur - 1)
    return {
      firstY: start.getFullYear(),
      firstM: start.getMonth() + 1,
      lastY: end.getFullYear(),
      lastM: end.getMonth() + 1,
      endIso: end.toISOString().slice(0, 10),
      dur,
    }
  }, [startDate, duration])

  useEffect(() => {
    if (!startDate) return
    setDisplayYear(parseInt(startDate.slice(0, 4), 10))
    setDisplayMonth(parseInt(startDate.slice(5, 7), 10))
  }, [startDate])

  /** Garder le mois affiché dans [premier mois … dernier mois] de la période de diffusion */
  useEffect(() => {
    if (!planningBounds) return
    const cur = monthKey(displayYear, displayMonth)
    const minK = monthKey(planningBounds.firstY, planningBounds.firstM)
    const maxK = monthKey(planningBounds.lastY, planningBounds.lastM)
    if (cur < minK) {
      setDisplayYear(planningBounds.firstY)
      setDisplayMonth(planningBounds.firstM)
    } else if (cur > maxK) {
      setDisplayYear(planningBounds.lastY)
      setDisplayMonth(planningBounds.lastM)
    }
  }, [planningBounds, displayYear, displayMonth])

  type GridSlot = { day: number | null; dateStr: string; dayIndex: number }

  const buildMonthGrid = (year: number, month: number): { label: string; slots: GridSlot[] } => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0).getDate()
    const startOffset = (firstDay.getDay() + 6) % 7
    const slots: GridSlot[] = []
    for (let i = 0; i < startOffset; i++) slots.push({ day: null, dateStr: '', dayIndex: -1 })
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayIndex = getDayIndex(dateStr, startDate)
      slots.push({ day: d, dateStr, dayIndex })
    }
    while (slots.length < 42) slots.push({ day: null, dateStr: '', dayIndex: -1 })
    const label = firstDay.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    return { label, slots }
  }

  const currentMonthGrid = buildMonthGrid(displayYear, displayMonth)
  const nextMonthDate = new Date(displayYear, displayMonth, 1)
  const nextYear = nextMonthDate.getFullYear()
  const nextMonthNum = nextMonthDate.getMonth() + 1
  const nextMonthGrid = buildMonthGrid(nextYear, nextMonthNum)

  const monthLabel = twoMonths
    ? `${currentMonthGrid.label} — ${nextMonthGrid.label}`
    : currentMonthGrid.label
  const gridsToShow = twoMonths ? [currentMonthGrid, nextMonthGrid] : [currentMonthGrid]

  /** Même identifiant que `moveItem` / `resizeItem` dans le store (clé entrée calendrier). */
  const itemScheduleKey = (item: CalendarItem): string => {
    const obj = (item.objective ?? '').trim()
    if (item.platform.includes('::')) return item.platform
    return obj ? `${item.platform}::${obj}` : item.platform
  }

  const displayItems = useMemo(() => calendarItemsForDisplayGrouped(items), [items])

  const phaseIndexMap = useMemo(
    () => getPhaseIndexByPlatformKey(displayItems),
    [displayItems],
  )

  const durDays = planningBounds?.dur ?? Math.max(1, Math.floor(Number(duration)) || 1)

  const getItemColor = (item: CalendarItem): string =>
    getPlatformPhaseColor(item.platform, phaseIndexMap.get(item.platform) ?? 0)

  const handleDayClick = (dateStr: string) => {
    if (!selectedPlatformKey || !onPlatformStartDateSet) return
    onPlatformStartDateSet(selectedPlatformKey, dateStr)
  }

  const canGoPrev = planningBounds
    ? monthKey(displayYear, displayMonth) > monthKey(planningBounds.firstY, planningBounds.firstM)
    : true
  const canGoNext = planningBounds
    ? monthKey(displayYear, displayMonth) < monthKey(planningBounds.lastY, planningBounds.lastM)
    : true

  const prevMonth = () => {
    if (!canGoPrev) return
    if (displayMonth === 1) {
      setDisplayMonth(12)
      setDisplayYear((y) => y - 1)
    } else setDisplayMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (!canGoNext) return
    if (displayMonth === 12) {
      setDisplayMonth(1)
      setDisplayYear((y) => y + 1)
    } else setDisplayMonth((m) => m + 1)
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-background overflow-hidden w-full shadow-sm">
      <div className="p-4 sm:p-5 w-full min-w-0">
        <div className="flex gap-3 lg:gap-4 items-start max-w-full">
          {/* Bloc calendrier : prend tout l’espace restant */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-col gap-2 mb-3 sm:mb-4">
              {planningBounds ? (
                <p className="text-[11px] text-center text-muted-foreground leading-snug tabular-nums px-2">
                  Période de diffusion : {formatFrenchShort(startDate)} →{' '}
                  {formatFrenchShort(planningBounds.endIso)} ({planningBounds.dur} j)
                </p>
              ) : null}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={!canGoPrev}
                  className={`p-2 rounded-xl border border-transparent transition-colors shrink-0 ${
                    canGoPrev ? 'hover:bg-muted hover:border-border/60' : 'opacity-35 cursor-not-allowed'
                  }`}
                  aria-label="Mois précédent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-base font-semibold tracking-tight capitalize min-w-[140px] text-center text-foreground">
                  {monthLabel}
                </div>
                <button
                  type="button"
                  onClick={nextMonth}
                  disabled={!canGoNext}
                  className={`p-2 rounded-xl border border-transparent transition-colors shrink-0 ${
                    canGoNext ? 'hover:bg-muted hover:border-border/60' : 'opacity-35 cursor-not-allowed'
                  }`}
                  aria-label="Mois suivant"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={twoMonths ? 'grid grid-cols-1 md:grid-cols-2 gap-4 w-full' : 'w-full'}>
              {gridsToShow.map((month, idx) => (
                <div key={idx} className="w-full">
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full max-w-full min-w-0 mb-1">
                    {WEEKDAYS.map((wd) => (
                      <div
                        key={wd}
                        className="min-w-0 py-1.5 text-center text-xs font-medium text-muted-foreground"
                      >
                        {wd}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full max-w-full min-w-0">
                    {month.slots.slice(0, 42).map((slot, i) => {
                      const activePlatforms =
                        slot.day != null
                          ? displayItems.filter((item) =>
                              isPlatformActiveOnDay(item, slot.dayIndex, durDays),
                            )
                          : []
                      const inPlanningRange =
                        slot.day != null &&
                        slot.dayIndex >= 0 &&
                        slot.dayIndex < durDays
                      const isOutOfPlanning =
                        slot.day != null && !inPlanningRange && slot.dayIndex !== -1
                      const isDayClickable =
                        inPlanningRange && !!selectedPlatformKey && !!onPlatformStartDateSet
                      return (
                        <div
                          key={i}
                          role={isDayClickable ? 'button' : undefined}
                          tabIndex={isDayClickable ? 0 : undefined}
                          onClick={isDayClickable ? () => handleDayClick(slot.dateStr) : undefined}
                          onKeyDown={
                            isDayClickable
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') handleDayClick(slot.dateStr)
                                }
                              : undefined
                          }
                          title={
                            isDayClickable
                              ? 'Cliquer pour définir la date de début de la phase sélectionnée'
                              : slot.day != null &&
                                  selectedPlatformKey &&
                                  onPlatformStartDateSet &&
                                  !inPlanningRange
                                ? 'Jour hors de la période de diffusion définie'
                                : undefined
                          }
                          className={`min-w-0 min-h-[40px] sm:min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-sm px-0.5 border ${
                            slot.day == null
                              ? 'bg-transparent text-muted-foreground/40 border-transparent'
                              : isOutOfPlanning
                                ? 'bg-muted/5 text-muted-foreground/55 border-dashed border-border/50 opacity-80'
                                : 'bg-muted/30 text-foreground border-border/25'
                          } ${
                            isDayClickable
                              ? 'cursor-pointer hover:bg-primary/15 hover:ring-2 hover:ring-primary/40 transition-colors'
                              : ''
                          }`}
                        >
                          <span>{slot.day ?? ''}</span>
                          {activePlatforms.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-0.5">
                              {activePlatforms.map((item) => (
                                <span
                                  key={item.platform}
                                  className="inline-block h-2 w-2 rounded-full shrink-0 ring-1 ring-white/80"
                                  style={{ backgroundColor: getItemColor(item) }}
                                  title={`${item.platform}${
                                    item.objective ? ` — ${item.objective}` : ''
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showLegend && displayItems.length > 0 && (
            <div className="flex-none w-[10.5rem] sm:w-44 max-w-[11.5rem] shrink-0 border-l border-border/60 pl-3 py-1 space-y-3 min-w-0">
              <div className="flex flex-col gap-1.5 min-w-0">
                {displayItems.map((item, itemIdx) => {
                  const key = itemScheduleKey(item)
                  const isSelected = selectedPlatformKey === key
                  return (
                    <div key={`${key}-${itemIdx}`} className="flex flex-col gap-1 min-w-0">
                      <button
                        type="button"
                        title={
                          isSelected
                            ? 'Plateforme sélectionnée — cliquer pour désélectionner'
                            : 'Cliquer pour sélectionner et placer la date sur le calendrier'
                        }
                        onClick={() => setSelectedPlatform(isSelected ? null : key)}
                        className={`flex items-start gap-2 w-full min-w-0 text-left rounded-md px-2 py-1 -mx-1 transition-colors ${
                          isSelected ? 'bg-primary/15 ring-2 ring-primary/50' : 'hover:bg-muted/50'
                        }`}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: getItemColor(item) }}
                        />
                        <span className="text-[11px] sm:text-xs font-medium leading-snug break-words min-w-0">
                          {item.platform.includes('::')
                            ? item.platform.replace('::', ' – ')
                            : item.objective
                              ? `${item.platform} — ${item.objective}`
                              : item.platform}
                          {isSelected ? (
                            <span className="text-primary font-normal"> (sél.)</span>
                          ) : null}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
              {!!calendarWarnings?.length && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-2 space-y-1 mt-2 max-w-full">
                  <p className="text-xs font-medium text-amber-800">
                    Règles durée / budget quotidien
                  </p>
                  <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
                    {calendarWarnings.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
