'use client'

import React, { useState, useEffect } from 'react'
import { getPlatformColor } from './colors'
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
}: {
  startDate: string
  duration: number
  items: CalendarItem[]
}) {
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
    <div className="rounded-lg border bg-background overflow-auto">
      <div className="p-4 min-w-max">
        <div className="flex items-center justify-between mb-4">
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

        <div className="flex gap-6 items-start flex-wrap">
          <div className="inline-grid grid-cols-7 gap-1 w-max">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="min-w-[48px] py-1.5 text-center text-xs font-medium text-muted-foreground"
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
              return (
                <div
                  key={i}
                  className={`min-w-[48px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-md text-sm px-0.5 ${
                    slot.day == null
                      ? 'bg-transparent text-muted-foreground/40'
                      : 'bg-muted/20 text-foreground'
                  }`}
                >
                  <span>{slot.day ?? ''}</span>
                  {activePlatforms.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5">
                      {activePlatforms.map((item) => (
                        <span
                          key={item.platform}
                          className="inline-block h-2 w-2 rounded-full shrink-0 ring-1 ring-white/80"
                          style={{ backgroundColor: getPlatformColor(item.platform) }}
                          title={item.platform}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {items.length > 0 && (
            <div className="shrink-0 border-l pl-4 py-1">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Légende
              </div>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <div
                    key={item.platform}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: getPlatformColor(item.platform) }}
                    />
                    <span className="text-xs">{item.platform}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
