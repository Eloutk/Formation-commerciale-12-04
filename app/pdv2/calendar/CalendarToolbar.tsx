'use client'

import React from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCalendarStore } from './store'

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
    <div className="space-y-4 w-full flex flex-wrap items-center gap-3">
      {showGranularitySelector && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">Vue :</span>
            {(['month', 'week'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setTimeGranularity(g)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  timeGranularity === g
                    ? 'bg-[#E94C16] text-white'
                    : 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-500'
                }`}
              >
                {g === 'month' ? 'Mois' : 'Semaines (glisser-déposer)'}
              </button>
            ))}
          </div>
          {timeGranularity === 'week' && (
            <div className="flex items-center gap-1.5 flex-wrap border-l border-border pl-3">
              <span className="text-xs font-medium text-muted-foreground">Zoom :</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={zoomTimelineOut}
                disabled={timelineZoom <= 0.5}
                aria-label="Zoom arrière"
                title="Zoom arrière"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span
                className="text-xs font-medium tabular-nums min-w-[3rem] text-center text-foreground"
                title="Niveau de zoom (vue semaines)"
              >
                {zoomPct}%
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
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
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
          {validationError}
        </p>
      )}
    </div>
  )
}
