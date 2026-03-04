'use client'

import React from 'react'
import { useCalendarStore } from './store'

export function CalendarToolbar() {
  const validationError = useCalendarStore((s) => s.validationError)

  return (
    <div className="space-y-4 w-52 shrink-0">
      {validationError && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
          {validationError}
        </p>
      )}
    </div>
  )
}
