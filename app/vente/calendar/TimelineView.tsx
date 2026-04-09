'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCalendarStore } from './store'
import { getPlatformPhaseColor, getPhaseIndexByPlatformKey } from './colors'
import { getDatesFromStart } from '@/lib/utils/calendarEngine'
import { calendarItemsForDisplayGrouped } from './calendarDisplayItems'
import { MonthGridView } from './MonthGridView'

const ROW_HEIGHT = 56
const DAY_WIDTH_DEFAULT = 80
const MAX_TIMELINE_WIDTH = 3200
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
  twoMonths = false,
}: {
  onPlatformStartDateSet?: (entryKey: string, startDate: string) => void
  onPlatformDaysChange?: (entryKey: string, days: number) => void
  calendarWarnings?: string[]
  twoMonths?: boolean
} = {}) {
  const startDate = useCalendarStore((s) => s.startDate)
  const duration = useCalendarStore((s) => s.duration)
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const timelineZoom = useCalendarStore((s) => s.timelineZoom)
  const items = useCalendarStore((s) => s.items)
  const moveItem = useCalendarStore((s) => s.moveItem)
  const resizeItem = useCalendarStore((s) => s.resizeItem)

  const dates = getDatesFromStart(startDate, duration)
  const [dragging, setDragging] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const startXRef = useRef(0)
  const startStartDayRef = useRef(0)
  const startLengthRef = useRef(0)

  const baseDayWidth =
    duration > 0 ? Math.min(DAY_WIDTH_DEFAULT, Math.max(12, MAX_TIMELINE_WIDTH / duration)) : DAY_WIDTH_DEFAULT
  const dayWidth = Math.max(6, Math.min(220, baseDayWidth * timelineZoom))
  const totalWidth = duration * dayWidth

  const displayItems = React.useMemo(() => calendarItemsForDisplayGrouped(items), [items])
  const phaseIndexMap = React.useMemo(() => getPhaseIndexByPlatformKey(displayItems), [displayItems])

  const headerCells = React.useMemo(() => {
    if (timeGranularity === 'day') {
      return dates.map((d) => ({ label: formatDateJJMMAA(d), subLabel: '', width: dayWidth }))
    }
    if (timeGranularity === 'week' || timeGranularity === 'frise') {
      const numWeeks = Math.ceil(duration / 7)
      return Array.from({ length: numWeeks }, (_, w) => {
        const start = w * 7
        const end = Math.min((w + 1) * 7, duration) - 1
        return {
          label: `S.${w + 1}`,
          subLabel: `${formatDateJJMMAA(dates[start] ?? '')} → ${formatDateJJMMAA(dates[end] ?? '')}`,
          width: (Math.min((w + 1) * 7, duration) - start) * dayWidth,
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
        width: (endDay - d + 1) * dayWidth,
      })
    }
    return monthRanges
  }, [dates, duration, timeGranularity, dayWidth])

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
      const dayDelta = Math.round(delta / dayWidth)
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
  }, [dragging, duration, moveItem, dayWidth])

  useEffect(() => {
    if (!resizing) return
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current
      const dayDelta = Math.round(delta / dayWidth)
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
  }, [resizing, resizeItem, dayWidth])

  if (timeGranularity === 'frise') {
    const axisY = 58
    return (
      <div className="rounded-2xl border border-border/60 bg-background overflow-auto shadow-sm">
        <div className="min-w-max">
          <div className="flex border-b border-border/60 sticky top-0 z-10 bg-muted/30 backdrop-blur-sm">
            <div className="flex" style={{ width: totalWidth }}>
              {headerCells.map((cell, i) => (
                <div
                  key={i}
                  className="shrink-0 border-r border-border/50 py-2.5 text-center text-xs font-semibold text-foreground"
                  style={{ width: cell.width }}
                >
                  <div>{cell.label}</div>
                  {cell.subLabel ? (
                    <div className="text-muted-foreground font-normal truncate px-0.5 mt-0.5">{cell.subLabel}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="relative bg-muted/5" style={{ width: totalWidth, minHeight: 108 }}>
            <div
              className="absolute left-0 right-0 h-0.5 rounded-full bg-foreground/20 pointer-events-none"
              style={{ top: axisY }}
            />
            {displayItems.map((item) => {
              const color = getPlatformPhaseColor(item.platform, phaseIndexMap.get(item.platform) ?? 0)
              const startPx = item.startDay * dayWidth
              const endPx = (item.startDay + item.length) * dayWidth
              const segLeft = startPx + 1
              const segWidth = Math.max(8, endPx - startPx - 2)
              const phaseLabel = item.platform.includes('::')
                ? item.platform.replace(/::/g, ' – ')
                : item.objective
                  ? `${item.platform} – ${item.objective}`
                  : item.platform
              return (
                <React.Fragment key={item.platform}>
                  <div
                    className="absolute w-0.5 rounded-full pointer-events-none z-10"
                    style={{
                      left: startPx,
                      top: 34,
                      height: 50,
                      backgroundColor: color,
                    }}
                  />
                  <div
                    className="absolute w-0.5 rounded-full pointer-events-none z-10"
                    style={{
                      left: endPx,
                      top: 34,
                      height: 50,
                      backgroundColor: color,
                    }}
                  />
                  <div
                    onMouseDown={(e) => handleBarMouseDown(e, item.platform)}
                    className="absolute cursor-grab active:cursor-grabbing rounded-md border border-border/50 shadow-sm z-[5] flex items-center justify-center px-1"
                    style={{
                      left: segLeft,
                      width: segWidth,
                      top: 48,
                      height: 20,
                      backgroundColor: `${color}40`,
                      borderLeftWidth: 3,
                      borderLeftColor: color,
                      opacity: dragging === item.platform ? 0.9 : 1,
                    }}
                    title={phaseLabel}
                  >
                    <span className="text-[10px] font-medium text-foreground truncate max-w-full leading-tight text-center pointer-events-none">
                      {phaseLabel}
                    </span>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item.platform)}
                    className="absolute w-2 cursor-ew-resize z-20 hover:bg-primary/20 rounded"
                    style={{ left: segLeft + segWidth - 5, top: 44, height: 28 }}
                    title="Ajuster la durée"
                  />
                </React.Fragment>
              )
            })}
          </div>
          <p className="text-[11px] text-muted-foreground px-3 py-2.5 border-t border-border/50 bg-muted/10 max-w-4xl leading-relaxed">
            Vue synthétique : une ligne de temps avec traits de début et de fin par plateforme. Faites glisser un segment
            pour le décaler, la poignée droite allonge ou raccourcit la diffusion.
          </p>
        </div>
      </div>
    )
  }

  if (timeGranularity === 'month') {
    return (
      <MonthGridView
        startDate={startDate}
        duration={duration}
        items={items}
        onPlatformStartDateSet={onPlatformStartDateSet}
        onPlatformDaysChange={onPlatformDaysChange}
        calendarWarnings={calendarWarnings}
        twoMonths={twoMonths}
        /** Légende obligatoire pour la vue mois : choisir une entrée puis cliquer un jour (rétro 2 mois inclus). */
        showLegend
      />
    )
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-background overflow-auto shadow-sm">
      <div className="min-w-max">
        <div className="flex border-b border-border/60 sticky top-0 z-10 bg-muted/30 backdrop-blur-sm">
          <div className="flex" style={{ width: totalWidth }}>
            {headerCells.map((cell, i) => (
              <div
                key={i}
                className="shrink-0 border-r border-border/50 py-2.5 text-center text-xs font-semibold text-foreground"
                style={{ width: cell.width }}
              >
                <div>{cell.label}</div>
                {cell.subLabel ? (
                  <div className="text-muted-foreground font-normal truncate px-0.5 mt-0.5">{cell.subLabel}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        {displayItems.map((item) => {
          const color = getPlatformPhaseColor(item.platform, phaseIndexMap.get(item.platform) ?? 0)
          const left = item.startDay * dayWidth
          const width = item.length * dayWidth - 4
          const phaseLabel = item.platform.includes('::')
            ? item.platform.replace('::', ' – ')
            : item.objective
              ? `${item.platform} – ${item.objective}`
              : item.platform
          return (
            <div
              key={item.platform}
              className="flex items-stretch border-b border-border/60 hover:bg-muted/20 transition-colors"
              style={{ height: ROW_HEIGHT }}
            >
              <div className="relative" style={{ width: totalWidth }}>
                <div
                  onMouseDown={(e) => handleBarMouseDown(e, item.platform)}
                  className="absolute top-2 bottom-2 rounded-xl border border-border/50 shadow-sm cursor-grab active:cursor-grabbing flex items-center px-2.5 transition-opacity"
                  style={{
                    left: left + 2,
                    width,
                    borderLeftWidth: 4,
                    borderLeftColor: color,
                    opacity: dragging === item.platform ? 0.9 : 1,
                  }}
                >
                  <span className="text-xs text-muted-foreground truncate">{phaseLabel}</span>
                </div>
                {timeGranularity === 'day' ? (
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item.platform)}
                    className="absolute top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center hover:bg-primary/10 rounded"
                    style={{ left: left + width - 2, zIndex: 1 }}
                    title="Étendre"
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
