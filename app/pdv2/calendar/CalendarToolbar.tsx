'use client'

import React from 'react'
import { useCalendarStore } from './store'

export function CalendarToolbar({ showGranularitySelector = false }: { showGranularitySelector?: boolean }) {
  const validationError = useCalendarStore((s) => s.validationError)
  const timeGranularity = useCalendarStore((s) => s.timeGranularity)
  const setTimeGranularity = useCalendarStore((s) => s.setTimeGranularity)

  return (
    <div className="space-y-4 w-full flex flex-wrap items-center gap-3">
      {showGranularitySelector && (
        <div className="flex items-center gap-2">
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
      )}
      {validationError && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
          {validationError}
        </p>
      )}
    </div>
  )
}
