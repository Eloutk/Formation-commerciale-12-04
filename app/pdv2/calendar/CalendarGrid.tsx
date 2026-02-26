'use client'

import React from 'react'
import { DndContext, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { getDatesFromStart } from '@/lib/utils/calendarEngine'
import { useCalendarStore } from './store'
import { PlatformCard } from './PlatformCard'
import { getPlatformColor } from './colors'

const COLUMN_WIDTH = 120
const CARD_WIDTH = 100

function DayColumn({
  dayIndex,
  dateLabel,
  items,
  duration,
  onResize,
}: {
  dayIndex: number
  dateLabel: string
  items: { item: import('./types').CalendarItem; color: string }[]
  duration: number
  onResize: (platform: string, newLength: number) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `day-${dayIndex}` })

  return (
    <div
      ref={setNodeRef}
      className="shrink-0 flex flex-col border-r border-border/80 bg-muted/20 min-h-[200px] transition-colors"
      style={{ width: COLUMN_WIDTH }}
    >
      <div
        className={`sticky top-0 z-10 px-2 py-2 text-center text-xs font-medium border-b bg-background/95 backdrop-blur ${
          isOver ? 'ring-2 ring-primary/50' : ''
        }`}
      >
        <div>J{dayIndex + 1}</div>
        <div className="text-muted-foreground">{dateLabel}</div>
      </div>
      <div className="flex-1 p-1.5 space-y-2">
        {items.map(({ item, color }) => (
          <PlatformCard
            key={item.platform}
            item={item}
            color={color}
            onResize={onResize}
            maxLength={duration}
            spanDays={item.length}
            columnWidth={COLUMN_WIDTH}
          />
        ))}
      </div>
    </div>
  )
}

export function CalendarGrid() {
  const startDate = useCalendarStore((s) => s.startDate)
  const duration = useCalendarStore((s) => s.duration)
  const items = useCalendarStore((s) => s.items)
  const moveItem = useCalendarStore((s) => s.moveItem)
  const resizeItem = useCalendarStore((s) => s.resizeItem)

  const dates = getDatesFromStart(startDate, duration)
  const byDay = React.useMemo(() => {
    const map: Record<number, { item: import('./types').CalendarItem; color: string }[]> = {}
    for (let d = 0; d < duration; d++) map[d] = []
    for (const item of items) {
      const color = getPlatformColor(item.platform)
      if (map[item.startDay]) map[item.startDay].push({ item, color })
    }
    return map
  }, [items, duration])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || typeof over.id !== 'string' || !over.id.startsWith('day-')) return
    const platform = active.id as string
    const dayIndex = parseInt(over.id.replace('day-', ''), 10)
    if (Number.isNaN(dayIndex)) return
    moveItem(platform, dayIndex)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto overflow-y-auto rounded-lg border bg-background">
        {Array.from({ length: duration }, (_, i) => (
          <DayColumn
            key={i}
            dayIndex={i}
            dateLabel={dates[i] ?? ''}
            items={byDay[i] ?? []}
            duration={duration}
            onResize={resizeItem}
          />
        ))}
      </div>
    </DndContext>
  )
}
