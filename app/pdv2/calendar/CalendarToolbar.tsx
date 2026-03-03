'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { useCalendarStore } from './store'
import type { CalendarTimeGranularity } from './types'
import { CalendarDays } from 'lucide-react'

export function CalendarToolbar() {
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const validationError = useCalendarStore((s) => s.validationError)
  const setTimeGranularity = useCalendarStore((s) => s.setTimeGranularity)

  return (
    <div className="space-y-4 w-64 shrink-0">
      <div className="space-y-2">
        <Label>Granularité</Label>
        <div className="flex rounded-lg border bg-muted/30 p-1 gap-0.5">
          <button
            type="button"
            onClick={() => setTimeGranularity('day')}
            className={`flex-1 flex items-center justify-center gap-1 rounded-md py-2 text-xs font-medium transition-colors ${
              timeGranularity === 'day' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vue par jour"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Jour
          </button>
          <button
            type="button"
            onClick={() => setTimeGranularity('week')}
            className={`flex-1 flex items-center justify-center gap-1 rounded-md py-2 text-xs font-medium transition-colors ${
              timeGranularity === 'week' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vue par semaine"
          >
            Semaine
          </button>
          <button
            type="button"
            onClick={() => setTimeGranularity('month')}
            className={`flex-1 flex items-center justify-center gap-1 rounded-md py-2 text-xs font-medium transition-colors ${
              timeGranularity === 'month' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Vue par mois"
          >
            Mois
          </button>
        </div>
      </div>

      {validationError && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
          {validationError}
        </p>
      )}
    </div>
  )
}
