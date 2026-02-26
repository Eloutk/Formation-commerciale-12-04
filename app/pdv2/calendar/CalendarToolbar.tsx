'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useCalendarStore } from './store'
import type { CalendarViewMode } from './types'
import { RotateCcw, LayoutGrid, AlignStartHorizontal } from 'lucide-react'

export function CalendarToolbar() {
  const startDate = useCalendarStore((s) => s.startDate)
  const duration = useCalendarStore((s) => s.duration)
  const viewMode = useCalendarStore((s) => s.viewMode)
  const allowOverlap = useCalendarStore((s) => s.allowOverlap)
  const syncAllPlatforms = useCalendarStore((s) => s.syncAllPlatforms)
  const validationError = useCalendarStore((s) => s.validationError)
  const setStartDate = useCalendarStore((s) => s.setStartDate)
  const setViewMode = useCalendarStore((s) => s.setViewMode)
  const setAllowOverlap = useCalendarStore((s) => s.setAllowOverlap)
  const setSyncAllPlatforms = useCalendarStore((s) => s.setSyncAllPlatforms)
  const autoRepartition = useCalendarStore((s) => s.autoRepartition)
  const reset = useCalendarStore((s) => s.reset)

  return (
    <div className="space-y-4 w-64 shrink-0">
      <div className="space-y-2">
        <Label>Date de début</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Vue</Label>
        <div className="flex rounded-lg border bg-muted/30 p-1 gap-0.5">
          <button
            type="button"
            onClick={() => setViewMode('kanban' as CalendarViewMode)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline' as CalendarViewMode)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              viewMode === 'timeline' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlignStartHorizontal className="h-3.5 w-3.5" />
            Timeline
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={autoRepartition}>
          Auto-répartition
        </Button>
        <Button type="button" variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <label className="flex items-center justify-between gap-2 cursor-pointer">
          <span className="text-sm">Autoriser chevauchement</span>
          <Switch checked={allowOverlap} onCheckedChange={setAllowOverlap} />
        </label>
        <label className="flex items-center justify-between gap-2 cursor-pointer">
          <span className="text-sm">Synchroniser plateformes</span>
          <Switch checked={syncAllPlatforms} onCheckedChange={setSyncAllPlatforms} />
        </label>
      </div>

      {validationError && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
          {validationError}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Durée : <span className="font-medium text-foreground">{duration}</span> jour{duration > 1 ? 's' : ''}
      </p>
    </div>
  )
}
