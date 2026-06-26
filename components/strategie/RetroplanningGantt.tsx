'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RotateCcw, Trash2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRetroplanningPlatformColor } from '@/lib/retroplanning-platform-colors'
import type { RetroplanningCalendarEntry } from '@/lib/retroplanning-platforms'
import { cn } from '@/lib/utils'

const LABEL_WIDTH = 220
const ROW_HEIGHT = 52
const FIT_MIN_DAY_WIDTH = 14
const FIT_MAX_DAY_WIDTH = 36
const ZOOM_MIN_DAY_WIDTH = 5
const ZOOM_MAX_DAY_WIDTH = 80
const ZOOM_FACTOR = 1.2

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

function diffDays(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso).getTime()
  const to = parseIsoDate(toIso).getTime()
  return Math.round((to - from) / 86_400_000)
}

function formatShortDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

function getTimelineBounds(entries: RetroplanningCalendarEntry[]) {
  if (entries.length === 0) {
    const today = toIsoDate(new Date())
    return { start: today, end: addDays(today, 90) }
  }
  let start = entries[0]!.startDate
  let end = entries[0]!.endDate
  for (const entry of entries) {
    if (entry.startDate < start) start = entry.startDate
    if (entry.endDate > end) end = entry.endDate
  }
  return { start: addDays(start, -7), end: addDays(end, 14) }
}

function buildMonthHeaders(startIso: string, totalDays: number, dayWidth: number) {
  const headers: { key: string; label: string; width: number }[] = []
  let cursor = startIso
  let remaining = totalDays

  while (remaining > 0) {
    const date = parseIsoDate(cursor)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const daysInMonthFromCursor =
      diffDays(cursor, toIsoDate(monthEnd)) + 1
    const span = Math.min(remaining, daysInMonthFromCursor)
    const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    headers.push({ key: monthKey, label, width: span * dayWidth })
    cursor = addDays(cursor, span)
    remaining -= span
  }

  return headers
}

function buildDayHeaders(startIso: string, totalDays: number, dayWidth: number) {
  const headers: { key: string; label: string; width: number; muted: boolean }[] = []
  for (let i = 0; i < totalDays; i++) {
    const iso = addDays(startIso, i)
    const date = parseIsoDate(iso)
    const dayOfWeek = date.getDay()
    headers.push({
      key: iso,
      label: date.getDate() === 1 ? formatShortDate(iso) : String(date.getDate()),
      width: dayWidth,
      muted: dayOfWeek === 0 || dayOfWeek === 6,
    })
  }
  return headers
}

function clampDayWidth(value: number): number {
  return Math.min(ZOOM_MAX_DAY_WIDTH, Math.max(ZOOM_MIN_DAY_WIDTH, value))
}

export function RetroplanningGantt({
  entries,
  onRemove,
}: {
  entries: RetroplanningCalendarEntry[]
  onRemove: (id: string) => void
}) {
  const { start: timelineStart, end: timelineEnd } = useMemo(
    () => getTimelineBounds(entries),
    [entries],
  )

  const totalDays = Math.max(1, diffDays(timelineStart, timelineEnd) + 1)

  const autoDayWidth = useMemo(
    () => clampDayWidth(Math.min(FIT_MAX_DAY_WIDTH, Math.max(FIT_MIN_DAY_WIDTH, 900 / totalDays))),
    [totalDays],
  )

  const [dayWidthOverride, setDayWidthOverride] = useState<number | null>(null)

  useEffect(() => {
    setDayWidthOverride(null)
  }, [timelineStart, timelineEnd, entries.length])

  const dayWidth = dayWidthOverride ?? autoDayWidth
  const timelineWidth = totalDays * dayWidth
  const zoomPercent = Math.round((dayWidth / autoDayWidth) * 100)
  const showDayHeaders = dayWidth >= 16

  const monthHeaders = useMemo(
    () => buildMonthHeaders(timelineStart, totalDays, dayWidth),
    [timelineStart, totalDays, dayWidth],
  )

  const dayHeaders = useMemo(
    () => (showDayHeaders ? buildDayHeaders(timelineStart, totalDays, dayWidth) : []),
    [showDayHeaders, timelineStart, totalDays, dayWidth],
  )

  const zoomIn = useCallback(() => {
    setDayWidthOverride((prev) => clampDayWidth((prev ?? autoDayWidth) * ZOOM_FACTOR))
  }, [autoDayWidth])

  const zoomOut = useCallback(() => {
    setDayWidthOverride((prev) => clampDayWidth((prev ?? autoDayWidth) / ZOOM_FACTOR))
  }, [autoDayWidth])

  const resetZoom = useCallback(() => {
    setDayWidthOverride(null)
  }, [])

  const handleWheelZoom = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      if (event.deltaY < 0) zoomIn()
      else zoomOut()
    },
    [zoomIn, zoomOut],
  )

  const dayGridStyle = {
    backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${dayWidth - 1}px, rgb(226 232 240 / 0.55) ${dayWidth - 1}px, rgb(226 232 240 / 0.55) ${dayWidth}px)`,
  }

  if (entries.length === 0) return null

  const canZoomOut = dayWidth > ZOOM_MIN_DAY_WIDTH + 0.5
  const canZoomIn = dayWidth < ZOOM_MAX_DAY_WIDTH - 0.5
  const isCustomZoom = dayWidthOverride !== null

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/20 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          {entries.length} opération{entries.length > 1 ? 's' : ''} · {formatShortDate(timelineStart)} →{' '}
          {formatShortDate(timelineEnd)}
        </p>
        <div className="flex items-center gap-1">
          <span className="mr-1 hidden text-[11px] text-muted-foreground sm:inline">Granularité</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={!canZoomOut}
            aria-label="Dézoomer la frise"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3.25rem] text-center text-xs font-medium tabular-nums text-foreground">
            {zoomPercent}%
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={!canZoomIn}
            aria-label="Zoomer la frise"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={resetZoom}
            disabled={!isCustomZoom}
            aria-label="Réinitialiser le zoom"
            title="Réinitialiser le zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto" onWheel={handleWheelZoom}>
        <div className="min-w-max">
          <div className="flex border-b border-border/60 bg-muted/30">
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-border/60 bg-muted/30 px-3 py-2.5 text-xs font-semibold text-muted-foreground"
              style={{ width: LABEL_WIDTH }}
            >
              Opération
            </div>
            <div style={{ width: timelineWidth }}>
              <div className="flex">
                {monthHeaders.map((header) => (
                  <div
                    key={header.key}
                    className="shrink-0 border-r border-border/50 px-2 py-2.5 text-center text-xs font-semibold text-foreground"
                    style={{ width: header.width }}
                  >
                    {header.label}
                  </div>
                ))}
              </div>
              {showDayHeaders ? (
                <div className="flex border-t border-border/40">
                  {dayHeaders.map((header) => (
                    <div
                      key={header.key}
                      className={cn(
                        'shrink-0 border-r border-border/30 px-0.5 py-1 text-center text-[10px] leading-tight',
                        header.muted ? 'text-muted-foreground/70' : 'text-muted-foreground',
                      )}
                      style={{ width: header.width }}
                    >
                      {header.label}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {entries.map((entry) => {
            const offsetDays = Math.max(0, diffDays(timelineStart, entry.startDate))
            const durationDays = Math.max(1, diffDays(entry.startDate, entry.endDate) + 1)
            const left = offsetDays * dayWidth
            const width = Math.max(dayWidth, durationDays * dayWidth - 4)
            const color = getRetroplanningPlatformColor(entry.platform)

            return (
              <div
                key={entry.id}
                className="flex border-b border-border/50 last:border-b-0 transition-colors hover:bg-muted/15"
                style={{ minHeight: ROW_HEIGHT }}
              >
                <div
                  className="sticky left-0 z-10 flex shrink-0 items-center gap-2 border-r border-border/60 bg-background px-3"
                  style={{ width: LABEL_WIDTH }}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{entry.operationName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {entry.platform}
                      <span className="ml-1.5 font-semibold text-foreground">
                        · {durationDays} j
                      </span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(entry.id)}
                    aria-label="Retirer du calendrier"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="relative flex-1" style={{ width: timelineWidth, ...dayGridStyle }}>
                  <div
                    className="absolute top-1/2 flex -translate-y-1/2 items-center rounded-lg border px-2 shadow-sm"
                    style={{
                      left: left + 2,
                      width,
                      height: ROW_HEIGHT - 16,
                      backgroundColor: `${color}40`,
                      borderLeftWidth: 4,
                      borderLeftColor: color,
                      borderColor: `${color}99`,
                    }}
                    title={`${entry.operationName} — ${formatShortDate(entry.startDate)} → ${formatShortDate(entry.endDate)}`}
                  >
                    <span className="truncate text-[11px] font-medium text-foreground">
                      {formatShortDate(entry.startDate)} – {formatShortDate(entry.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <p className="shrink-0 border-t border-border/50 bg-muted/10 px-3 py-2 text-[11px] text-muted-foreground">
        Molette + Ctrl (ou Cmd) pour zoomer / dézoomer sur la frise.
      </p>
    </div>
  )
}
