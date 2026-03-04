'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { getPlatformColor } from './colors'
import { useCalendarStore } from './store'
import type { CalendarItem } from './types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function getDayIndex(dateStr: string, startDate: string): number {
  const a = new Date(dateStr + 'T12:00:00').getTime()
  const b = new Date(startDate + 'T12:00:00').getTime()
  return Math.round((a - b) / (24 * 60 * 60 * 1000))
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
}: {
  startDate: string
  duration: number
  items: CalendarItem[]
  onPlatformStartDateSet?: (entryKey: string, startDate: string) => void
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  calendarWarnings?: string[]
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

  const firstDay = new Date(displayYear, displayMonth - 1, 1)
  const lastDay = new Date(displayYear, displayMonth, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const gridSlots: { day: number | null; dateStr: string; dayIndex: number }[] = []
  for (let i = 0; i < startOffset; i++) gridSlots.push({ day: null, dateStr: '', dayIndex: -1 })
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayIndex = getDayIndex(dateStr, startDate)
    gridSlots.push({ day: d, dateStr, dayIndex })
  }
  while (gridSlots.length < 42) gridSlots.push({ day: null, dateStr: '', dayIndex: -1 })

  const monthLabel = firstDay.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })

  const makeItemKey = (item: CalendarItem): string =>
    `${item.platform}::${(item.objective || '').trim()}`

  // Couleurs nuancées par plateforme + objectif (ex: Search Clics vs Search Conversion)
  function adjustHex(hex: string, amount: number): string {
    // amount > 0 → éclaircir, amount < 0 → assombrir
    const clean = hex.replace('#', '')
    const num = parseInt(clean, 16)
    if (Number.isNaN(num)) return hex
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff
    const fn = (c: number) =>
      amount >= 0
        ? Math.min(255, Math.round(c + (255 - c) * amount))
        : Math.max(0, Math.round(c * (1 + amount)))
    const nr = fn(r)
    const ng = fn(g)
    const nb = fn(b)
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb
      .toString(16)
      .padStart(2, '0')}`
  }

  const colorByItemKey = useMemo(() => {
    const map: Record<string, string> = {}
    const objectivesByPlatform: Record<string, string[]> = {}
    items.forEach((item) => {
      const obj = (item.objective || '').trim()
      const list = objectivesByPlatform[item.platform] ?? (objectivesByPlatform[item.platform] = [])
      if (!list.includes(obj)) list.push(obj)
    })
    Object.entries(objectivesByPlatform).forEach(([platform, objectives]) => {
      const base = getPlatformColor(platform)
      objectives.forEach((obj, idx) => {
        const key = `${platform}::${obj}`
        if (idx === 0) {
          map[key] = base
        } else if (idx === 1) {
          // 2ème objectif : nuance nettement plus claire
          map[key] = adjustHex(base, 0.4)
        } else {
          // 3ème (rare) : nuance nettement plus sombre
          map[key] = adjustHex(base, -0.35)
        }
      })
    })
    return map
  }, [items])

  const getItemColor = (item: CalendarItem): string => {
    const key = `${item.platform}::${(item.objective || '').trim()}`
    return colorByItemKey[key] ?? getPlatformColor(item.platform)
  }

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

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full max-w-full min-w-0">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="min-w-0 py-1.5 text-center text-xs font-medium text-muted-foreground"
              >
                {wd}
              </div>
            ))}
            {gridSlots.slice(0, 42).map((slot, i) => {
              const activePlatforms =
                slot.day != null
                  ? items.filter((item) =>
                      isPlatformActiveOnDay(item, slot.dayIndex, duration),
                    )
                  : []
              const isDayClickable = slot.day != null && !!selectedPlatformKey && !!onPlatformStartDateSet
              return (
                <div
                  key={i}
                  role={isDayClickable ? 'button' : undefined}
                  tabIndex={isDayClickable ? 0 : undefined}
                  onClick={isDayClickable ? () => handleDayClick(slot.dateStr) : undefined}
                  onKeyDown={isDayClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleDayClick(slot.dateStr) } : undefined}
                  className={`min-w-0 min-h-[40px] sm:min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-md text-sm px-0.5 ${
                    slot.day == null
                      ? 'bg-transparent text-muted-foreground/40'
                      : 'bg-muted/20 text-foreground'
                  } ${isDayClickable ? 'cursor-pointer hover:bg-primary/15 hover:ring-2 hover:ring-primary/40 transition-colors' : ''}`}
                >
                  <span>{slot.day ?? ''}</span>
                  {activePlatforms.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5">
                      {activePlatforms.map((item) => (
                        <span
                          key={item.platform}
                          className="inline-block h-2 w-2 rounded-full shrink-0 ring-1 ring-white/80"
                          style={{ backgroundColor: getItemColor(item) }}
                          title={`${item.platform}${item.objective ? ` — ${item.objective}` : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          </div>
          {items.length > 0 && (
            <div className="flex-[2] min-w-[220px] max-w-sm border-l pl-4 py-1 space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Légende — Cliquez sur une plateforme puis sur un jour pour définir la date de début
              </div>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => {
                  const key = makeItemKey(item)
                  const isSelected = selectedPlatformKey === key
                  const maxDays = platformSources.find((p) => p.platform === item.platform)?.maxDays ?? 365
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
                          {item.platform}
                          {item.objective ? ` — ${item.objective}` : ''}
                        </span>
                        {isSelected && <span className="text-xs text-primary ml-1">(sélectionnée)</span>}
                      </button>
                      {isSelected && onPlatformDaysChange && (
                        <div className="flex items-center gap-2 px-2 py-1 -mx-2 rounded-md bg-muted/30">
                          <label className="text-xs text-muted-foreground whitespace-nowrap">Jours :</label>
                          <input
                            type="number"
                            min={1}
                            max={maxDays}
                            value={item.length}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10)
                              if (!Number.isNaN(v) && v >= 1 && v <= maxDays) {
                                onPlatformDaysChange(key, v)
                              }
                            }}
                            className="w-14 rounded border border-input bg-background px-1.5 py-0.5 text-xs"
                          />
                        </div>
                      )}
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
