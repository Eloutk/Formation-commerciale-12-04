'use client'

import React from 'react'
import { LayoutGrid, Rows3, StretchHorizontal, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalendarStore } from './store'
import { cn } from '@/lib/utils'

export function CalendarToolbar({ showGranularitySelector = false }: { showGranularitySelector?: boolean }) {
  const validationError = useCalendarStore((s) => s.validationError)
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const setTimeGranularity = useCalendarStore((s) => s.setTimeGranularity)
  const timelineZoom = useCalendarStore((s) => s.timelineZoom)
  const zoomTimelineIn = useCalendarStore((s) => s.zoomTimelineIn)
  const zoomTimelineOut = useCalendarStore((s) => s.zoomTimelineOut)
  const resetTimelineZoom = useCalendarStore((s) => s.resetTimelineZoom)

  const zoomPct = Math.round(timelineZoom * 100)

  return (
    <div className="w-full flex flex-col gap-3">
      {showGranularitySelector && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap sm:gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <LayoutGrid className="h-3.5 w-3.5 opacity-80" aria-hidden />
              Affichage
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['month', 'week'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setTimeGranularity(g)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all',
                    timeGranularity === g
                      ? 'border-[#E94C16] bg-[#E94C16] text-white shadow-sm'
                      : 'border-border/70 bg-muted/15 hover:bg-muted/40 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {g === 'month' ? (
                    <LayoutGrid className="h-3.5 w-3.5 opacity-90" />
                  ) : (
                    <Rows3 className="h-3.5 w-3.5 opacity-90" />
                  )}
                  {g === 'month' ? 'Mois' : 'Semaines'}
                </button>
              ))}
            </div>
          </div>
          {(timeGranularity === 'week' || timeGranularity === 'frise') && (
            <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-3 sm:border-l border-border/50">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Zoom frise</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg border-border/70"
                onClick={zoomTimelineOut}
                disabled={timelineZoom <= 0.5}
                aria-label="Zoom arrière"
                title="Zoom arrière"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span
                className="text-xs font-medium tabular-nums min-w-[3rem] text-center text-foreground"
                title="Niveau de zoom (vue semaines / frise)"
              >
                {zoomPct}%
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg border-border/70"
                onClick={zoomTimelineIn}
                disabled={timelineZoom >= 2.5}
                aria-label="Zoom avant"
                title="Zoom avant"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground"
                onClick={resetTimelineZoom}
                disabled={timelineZoom === 1}
                aria-label="Réinitialiser le zoom à 100 %"
                title="100 %"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                100 %
              </Button>
            </div>
          )}
        </>
      )}
      {validationError && (
        <p className="text-xs text-amber-800 dark:text-amber-100 bg-amber-50 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800 rounded-xl p-3 leading-relaxed">
          {validationError}
        </p>
      )}
    </div>
  )
}
