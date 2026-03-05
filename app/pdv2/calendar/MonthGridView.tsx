'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { getPlatformColor, getPlatformPhaseColor, getPhaseIndexByPlatformKey } from './colors'
import { useCalendarStore } from './store'
import type { CalendarItem } from './types'
import { getDayIndex } from '@/lib/utils/calendarEngine'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

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
  const platformSources = useCalendarStore((s) => s.platformSources)

  const [displayYear, setDisplayYear] = useState(() => {
    if (!startDate) return new Date().getFullYear()
    return parseInt(startDate.slice(0, 4), 10)
  })
  const [displayMonth, setDisplayMonth] = useState(() => {
    if (!startDate) return new Date().getMonth() + 1
    return parseInt(startDate.slice(5, 7), 10)
  })

  useEffect(() => {
    if (!startDate) return
    setDisplayYear(parseInt(startDate.slice(0, 4), 10))
    setDisplayMonth(parseInt(startDate.slice(5, 7), 10))
  }, [startDate])

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

  const makeItemKey = (item: CalendarItem): string =>
    `${item.platform}::${(item.objective || '').trim()}`

  const phaseIndexMap = useMemo(() => getPhaseIndexByPlatformKey(items), [items])

  const getItemColor = (item: CalendarItem): string =>
    getPlatformPhaseColor(item.platform, phaseIndexMap.get(item.platform) ?? 0)

  const handleDayClick = (dateStr: string) => {
    if (!selectedPlatformKey || !onPlatformStartDateSet) return
    onPlatformStartDateSet(selectedPlatformKey, dateStr)
  }

  const prevMonth = () => {
    if (displayMonth === 1) {
      setDisplayMonth(12)
      setDisplayYear((y) => y - 1)
    } else setDisplayMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (displayMonth === 12) {
      setDisplayMonth(1)
      setDisplayYear((y) => y + 1)
    } else setDisplayMonth((m) => m + 1)
  }

  return (
    <div className="rounded-lg border bg-background overflow-hidden w-full">
      <div className="p-3 sm:p-4 w-full min-w-0">
        <div className="flex gap-4 lg:gap-6 items-start max-w-full">
          {/* Bloc calendrier, plus large */}
          <div className="flex flex-col flex-[3] min-w-0">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-md hover:bg-muted transition-colors shrink-0"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-base font-medium capitalize min-w-[140px] text-center">
                {monthLabel}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-md hover:bg-muted transition-colors shrink-0"
                aria-label="Mois suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
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
                          ? items.filter((item) =>
                              isPlatformActiveOnDay(item, slot.dayIndex, duration),
                            )
                          : []
                      const isDayClickable =
                        slot.day != null && !!selectedPlatformKey && !!onPlatformStartDateSet
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
                          title={isDayClickable ? 'Cliquer pour définir la date de début de la phase sélectionnée' : undefined}
                          className={`min-w-0 min-h-[40px] sm:min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-md text-sm px-0.5 ${
                            slot.day == null
                              ? 'bg-transparent text-muted-foreground/40'
                              : 'bg-muted/20 text-foreground'
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
          {showLegend && items.length > 0 && (
            <div className="flex-[2] min-w-[220px] max-w-sm border-l pl-4 py-1 space-y-3">
              <div className="flex flex-col gap-1.5">
                {items.map((item) => {
                  const key = makeItemKey(item)
                  const isSelected = selectedPlatformKey === key
                  return (
                    <div key={item.platform} className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPlatform(isSelected ? null : key)}
                        className={`flex items-center gap-2 w-full text-left rounded-md px-2 py-1 -mx-2 transition-colors ${
                          isSelected ? 'bg-primary/15 ring-2 ring-primary/50' : 'hover:bg-muted/50'
                        }`}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: getItemColor(item) }}
                        />
                        <span className="text-xs font-medium">
                          {item.platform.includes('::')
                            ? item.platform.replace('::', ' – ')
                            : item.objective
                              ? `${item.platform} — ${item.objective}`
                              : item.platform}
                        </span>
                        {isSelected && <span className="text-xs text-primary ml-1">(sélectionnée)</span>}
                      </button>
                    </div>
                  )
                })}
              </div>
              {!!calendarWarnings?.length && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-2 space-y-1 mt-2 max-w-xs">
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
