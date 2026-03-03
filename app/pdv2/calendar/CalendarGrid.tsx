'use client'

import React from 'react'
import { DndContext, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { getDatesFromStart } from '@/lib/utils/calendarEngine'
import { useCalendarStore } from './store'
import { PlatformCard } from './PlatformCard'
import { getPlatformColor } from './colors'
import type { CalendarTimeGranularity } from './types'

const COLUMN_WIDTH_DAY = 120
const COLUMN_WIDTH_WEEK = 160
const COLUMN_WIDTH_MONTH = 130

/** Format YYYY-MM-DD → JJ/MM/AA */
function formatDateJJMMAA(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d ?? ''}/${m ?? ''}/${(y ?? '').slice(2) ?? ''}`
}

function PeriodColumn({
  periodIndex,
  periodLabel,
  items,
  duration,
  onResize,
  granularity,
  columnWidth,
  headerWrap,
}: {
  periodIndex: number
  periodLabel: string
  items: { item: import('./types').CalendarItem; color: string }[]
  duration: number
  onResize: (platform: string, newLength: number) => void
  granularity: CalendarTimeGranularity
  columnWidth: number
  headerWrap?: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `period-${granularity}-${periodIndex}` })

  return (
    <div
      ref={setNodeRef}
      className="shrink-0 flex flex-col border-r border-border/80 bg-muted/20 min-h-[200px] transition-colors overflow-hidden"
      style={{ width: columnWidth }}
    >
      <div
        className={`sticky top-0 z-10 px-2 py-2 text-center text-xs font-medium border-b bg-background/95 backdrop-blur ${
          isOver ? 'ring-2 ring-primary/50' : ''
        }`}
      >
        <div className={`text-muted-foreground ${headerWrap ? 'break-words' : 'whitespace-nowrap truncate'}`}>
          {periodLabel}
        </div>
      </div>
      <div className="flex-1 p-1.5 space-y-2 overflow-hidden min-w-0">
        {items.map(({ item, color }) => (
          <PlatformCard
            key={`${item.platform}-${periodIndex}`}
            item={item}
            color={color}
            onResize={onResize}
            maxLength={duration}
            spanDays={headerWrap ? 1 : item.length}
            columnWidth={columnWidth}
            disabled
          />
        ))}
      </div>
    </div>
  )
}

export function CalendarGrid() {
  const startDate = useCalendarStore((s) => s.startDate)
  const duration = useCalendarStore((s) => s.duration)
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const items = useCalendarStore((s) => s.items)
  const moveItem = useCalendarStore((s) => s.moveItem)
  const resizeItem = useCalendarStore((s) => s.resizeItem)

  const dates = getDatesFromStart(startDate, duration)

  const { columns, byPeriod, handleDrop } = React.useMemo(() => {
    if (timeGranularity === 'day') {
      const byPeriod: Record<number, { item: import('./types').CalendarItem; color: string }[]> = {}
      for (let d = 0; d < duration; d++) byPeriod[d] = []
      for (const item of items) {
        const color = getPlatformColor(item.platform)
        if (byPeriod[item.startDay]) byPeriod[item.startDay].push({ item, color })
      }
      return {
        columns: Array.from({ length: duration }, (_, i) => ({ index: i, label: formatDateJJMMAA(dates[i] ?? '') })),
        byPeriod,
        handleDrop: (periodIndex: number, platform: string) => moveItem(platform, periodIndex),
      }
    }
    if (timeGranularity === 'week') {
      const numWeeks = Math.ceil(duration / 7)
      const byPeriod: Record<number, { item: import('./types').CalendarItem; color: string }[]> = {}
      for (let w = 0; w < numWeeks; w++) byPeriod[w] = []
      for (const item of items) {
        const color = getPlatformColor(item.platform)
        const itemEnd = item.startDay + item.length
        for (let w = 0; w < numWeeks; w++) {
          const weekStart = w * 7
          const weekEnd = Math.min((w + 1) * 7, duration)
          if (item.startDay < weekEnd && itemEnd > weekStart) byPeriod[w].push({ item, color })
        }
      }
      const columnLabels = Array.from({ length: numWeeks }, (_, w) => {
        const start = w * 7
        const end = Math.min((w + 1) * 7, duration) - 1
        const startFmt = formatDateJJMMAA(dates[start] ?? '')
        const endFmt = formatDateJJMMAA(dates[end] ?? '')
        return { index: w, label: `S.${w + 1} ${startFmt} – ${endFmt}` }
      })
      return {
        columns: columnLabels,
        byPeriod,
        handleDrop: (periodIndex: number, platform: string) => moveItem(platform, periodIndex * 7),
      }
    }
    // month
    const monthRanges: { index: number; label: string; startDay: number; endDay: number }[] = []
    const seen = new Set<string>()
    let index = 0
    for (let d = 0; d < duration; d++) {
      const dateStr = dates[d]
      if (!dateStr) continue
      const monthKey = dateStr.slice(0, 7)
      if (seen.has(monthKey)) continue
      seen.add(monthKey)
      let endDay = d
      while (endDay + 1 < duration && (dates[endDay + 1] ?? '').slice(0, 7) === monthKey) endDay++
      const [y, m] = monthKey.split('-').map(Number)
      const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      monthRanges.push({ index: index++, label: monthLabel, startDay: d, endDay })
    }
    const byPeriod: Record<number, { item: import('./types').CalendarItem; color: string }[]> = {}
    monthRanges.forEach((r) => { byPeriod[r.index] = [] })
    for (const item of items) {
      const color = getPlatformColor(item.platform)
      const itemEnd = item.startDay + item.length
      monthRanges.forEach((r) => {
        if (item.startDay <= r.endDay && itemEnd > r.startDay) byPeriod[r.index].push({ item, color })
      })
    }
    return {
      columns: monthRanges.map((r) => ({ index: r.index, label: r.label })),
      byPeriod,
      handleDrop: (periodIndex: number, platform: string) => {
        const r = monthRanges[periodIndex]
        if (r) moveItem(platform, r.startDay)
      },
    }
  }, [items, duration, dates, timeGranularity, moveItem])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || typeof over.id !== 'string') return
    const match = over.id.match(/^period-(day|week|month)-(\d+)$/)
    if (!match) return
    const platform = active.id as string
    const periodIndex = parseInt(match[2], 10)
    if (Number.isNaN(periodIndex)) return
    handleDrop(periodIndex, platform)
  }

  const columnWidth =
    timeGranularity === 'week'
      ? COLUMN_WIDTH_WEEK
      : timeGranularity === 'month'
        ? COLUMN_WIDTH_MONTH
        : COLUMN_WIDTH_DAY
  const headerWrap = timeGranularity === 'week' || timeGranularity === 'month'

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto overflow-y-auto rounded-lg border bg-background">
        {columns.map(({ index, label }) => (
          <PeriodColumn
            key={`${timeGranularity}-${index}`}
            periodIndex={index}
            periodLabel={label}
            items={byPeriod[index] ?? []}
            duration={duration}
            onResize={resizeItem}
            granularity={timeGranularity}
            columnWidth={columnWidth}
            headerWrap={headerWrap}
          />
        ))}
      </div>
    </DndContext>
  )
}
