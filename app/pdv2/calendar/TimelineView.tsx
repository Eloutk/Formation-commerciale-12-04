'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCalendarStore } from './store'
import { getPlatformColor } from './colors'
import { getDatesFromStart } from '@/lib/utils/calendarEngine'
import type { CalendarTimeGranularity } from './types'
import { MonthGridView } from './MonthGridView'

const ROW_HEIGHT = 56
const DAY_WIDTH = 80
/** Format YYYY-MM-DD → JJ/MM/AA */
function formatDateJJMMAA(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d ?? ''}/${m ?? ''}/${(y ?? '').slice(2) ?? ''}`
}

export function TimelineView({
  onPlatformStartDateSet,
  onPlatformDaysChange,
  calendarWarnings,
}: {
  onPlatformStartDateSet?: (entryKey: string, startDate: string) => void
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  calendarWarnings?: string[]
} = {}) {
  const startDate = useCalendarStore((s) => s.startDate)
  const duration = useCalendarStore((s) => s.duration)
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const items = useCalendarStore((s) => s.items)
  const moveItem = useCalendarStore((s) => s.moveItem)
  const resizeItem = useCalendarStore((s) => s.resizeItem)

  const dates = getDatesFromStart(startDate, duration)
  const [dragging, setDragging] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const startXRef = useRef(0)
  const startStartDayRef = useRef(0)
  const startLengthRef = useRef(0)

  const totalWidth = duration * DAY_WIDTH

  const headerCells = React.useMemo(() => {
    if (timeGranularity === 'day') {
      return dates.map((d) => ({ label: formatDateJJMMAA(d), subLabel: '', width: DAY_WIDTH }))
    }
    if (timeGranularity === 'week') {
      const numWeeks = Math.ceil(duration / 7)
      return Array.from({ length: numWeeks }, (_, w) => {
        const start = w * 7
        const end = Math.min((w + 1) * 7, duration) - 1
        return {
          label: `S.${w + 1}`,
          subLabel: `${formatDateJJMMAA(dates[start] ?? '')} → ${formatDateJJMMAA(dates[end] ?? '')}`,
          width: (Math.min((w + 1) * 7, duration) - start) * DAY_WIDTH,
        }
      })
    }
    const monthRanges: { label: string; subLabel: string; width: number }[] = []
    const seen = new Set<string>()
    for (let d = 0; d < duration; d++) {
      const dateStr = dates[d]
      if (!dateStr) continue
      const monthKey = dateStr.slice(0, 7)
      if (seen.has(monthKey)) continue
      seen.add(monthKey)
      let endDay = d
      while (endDay + 1 < duration && (dates[endDay + 1] ?? '').slice(0, 7) === monthKey) endDay++
      const [y, m] = monthKey.split('-').map(Number)
      const label = new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      monthRanges.push({
        label,
        subLabel: `${formatDateJJMMAA(dates[d] ?? '')} → ${formatDateJJMMAA(dates[endDay] ?? '')}`,
        width: (endDay - d + 1) * DAY_WIDTH,
      })
    }
    return monthRanges
  }, [dates, duration, timeGranularity])

  const handleBarMouseDown = (e: React.MouseEvent, platform: string) => {
    e.preventDefault()
    setDragging(platform)
    startXRef.current = e.clientX
    const item = items.find((i) => i.platform === platform)
    if (item) startStartDayRef.current = item.startDay
  }

  const handleResizeStart = (e: React.MouseEvent, platform: string) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing(platform)
    startXRef.current = e.clientX
    const item = items.find((i) => i.platform === platform)
    if (item) startLengthRef.current = item.length
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current
      const dayDelta = Math.round(delta / DAY_WIDTH)
      const item = useCalendarStore.getState().items.find((i) => i.platform === dragging)
      if (!item) return
      const newStart = Math.max(0, Math.min(duration - item.length, startStartDayRef.current + dayDelta))
      moveItem(dragging, newStart)
      startStartDayRef.current = newStart
      startXRef.current = e.clientX
    }
    const onUp = () => setDragging(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, duration, moveItem])

  useEffect(() => {
    if (!resizing) return
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current
      const dayDelta = Math.round(delta / DAY_WIDTH)
      const newLength = Math.max(1, startLengthRef.current + dayDelta)
      resizeItem(resizing, newLength)
      startLengthRef.current = newLength
      startXRef.current = e.clientX
    }
    const onUp = () => setResizing(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [resizing, resizeItem])

  if (timeGranularity === 'month') {
    return (
      <MonthGridView
        startDate={startDate}
        duration={duration}
        items={items}
        onPlatformStartDateSet={onPlatformStartDateSet}
        onPlatformDaysChange={onPlatformDaysChange}
        calendarWarnings={calendarWarnings}
      />
    )
  }

  return (
    <div className="rounded-lg border bg-background overflow-auto">
      <div className="min-w-max">
        <div className="flex border-b sticky top-0 z-10 bg-background">
          <div className="w-40 shrink-0 border-r py-2 px-2 text-xs font-medium text-muted-foreground">
            Plateforme
          </div>
          <div className="flex" style={{ width: totalWidth }}>
            {headerCells.map((cell, i) => (
              <div
                key={i}
                className="shrink-0 border-r py-2 text-center text-xs font-medium"
                style={{ width: cell.width }}
              >
                <div>{cell.label}</div>
                {cell.subLabel ? <div className="text-muted-foreground truncate px-0.5">{cell.subLabel}</div> : null}
              </div>
            ))}
          </div>
        </div>
        {items.map((item, rowIndex) => {
          const color = getPlatformColor(item.platform)
          const left = item.startDay * DAY_WIDTH
          const width = item.length * DAY_WIDTH - 4
          return (
            <div
              key={item.platform}
              className="flex items-stretch border-b border-border/60 hover:bg-muted/20 transition-colors"
              style={{ height: ROW_HEIGHT }}
            >
              <div
                className="w-40 shrink-0 border-r flex items-center px-2 text-sm font-medium truncate"
                style={{ color }}
              >
                {item.platform}
              </div>
              <div className="relative flex-1" style={{ width: totalWidth }}>
                <div
                  onMouseDown={(e) => handleBarMouseDown(e, item.platform)}
                  className="absolute top-2 bottom-2 rounded-md border shadow-sm cursor-grab active:cursor-grabbing flex items-center px-2 transition-opacity"
                  style={{
                    left: left + 2,
                    width,
                    borderLeftWidth: 4,
                    borderLeftColor: color,
                    opacity: dragging === item.platform ? 0.9 : 1,
                  }}
                >
                  <span className="text-xs text-muted-foreground truncate">{item.kpiLabel ?? ''}</span>
                </div>
                <div
                  onMouseDown={(e) => handleResizeStart(e, item.platform)}
                  className="absolute top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center hover:bg-primary/10 rounded"
                  style={{ left: left + width - 2, zIndex: 1 }}
                  title="Étendre"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
