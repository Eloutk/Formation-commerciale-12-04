'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import NextImage from 'next/image'
import type { DateRange } from 'react-day-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PLATFORM_LOGOS } from '@/lib/social-media-platform-objectives'
import {
  addDaysLocal,
  daysInclusive,
  formatIsoLocal,
  parseIsoLocal,
  todayIsoLocal,
} from '@/lib/date-local'
import { cn } from '@/lib/utils'

export interface StrategyPlatformDateItem {
  id: string
  platform: string
  objective: string
  days: number
}

export interface StrategyPlatformDateRow {
  itemId: string
  platform: string
  objective: string
  startDate: string
  endDate: string
}

export { daysInclusive }

function entryKey(platform: string, objective: string) {
  return `${platform}::${objective}`
}

function formatObjectiveLine(platform: string, objective: string) {
  const obj = objective.trim()
  return obj ? `${platform} - ${obj.toLowerCase()}` : platform
}

function formatFrenchDate(iso: string) {
  if (!iso) return '—'
  return parseIsoLocal(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function buildInitialRows(
  items: StrategyPlatformDateItem[],
  startDates: Record<string, string>,
  defaultDays: number,
): StrategyPlatformDateRow[] {
  const today = todayIsoLocal()
  const rows: StrategyPlatformDateRow[] = []
  let cursor = today

  for (const item of items) {
    const key = entryKey(item.platform, item.objective)
    const start = startDates[key] ?? cursor
    const days = Math.max(1, item.days || defaultDays)
    const end = addDaysLocal(start, days - 1)
    rows.push({
      itemId: item.id,
      platform: item.platform,
      objective: item.objective,
      startDate: start,
      endDate: end,
    })
    cursor = addDaysLocal(end, 1)
  }

  return rows
}

function PlatformDateRangePicker({
  row,
  onChange,
}: {
  row: StrategyPlatformDateRow
  onChange: (patch: Partial<Pick<StrategyPlatformDateRow, 'startDate' | 'endDate'>>) => void
}) {
  const [open, setOpen] = useState(false)
  const selected: DateRange = {
    from: parseIsoLocal(row.startDate),
    to: parseIsoLocal(row.endDate),
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 justify-start gap-2 text-left font-normal flex-1 min-w-[12rem]"
            >
              <CalendarIcon className="h-4 w-4 shrink-0 text-[#E94C16]" aria-hidden />
              <span className="truncate text-sm">
                {formatFrenchDate(row.startDate)} → {formatFrenchDate(row.endDate)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="z-[120] w-auto p-0"
            align="start"
            data-strategy-date-popover=""
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Calendar
              mode="range"
              defaultMonth={selected.from}
              selected={selected}
              numberOfMonths={2}
              onSelect={(range) => {
                if (!range?.from) return
                const start = formatIsoLocal(range.from)
                const end = formatIsoLocal(range.to ?? range.from)
                onChange({ startDate: start, endDate: end })
                if (range.to) setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`cal-start-${row.itemId}`} className="text-xs">
            Date de début
          </Label>
          <Input
            id={`cal-start-${row.itemId}`}
            type="date"
            value={row.startDate}
            onChange={(e) => {
              const v = e.target.value
              if (!v) return
              onChange({ startDate: v })
            }}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`cal-end-${row.itemId}`} className="text-xs">
            Date de fin
          </Label>
          <Input
            id={`cal-end-${row.itemId}`}
            type="date"
            value={row.endDate}
            min={row.startDate}
            onChange={(e) => {
              const v = e.target.value
              if (!v) return
              onChange({ endDate: v })
            }}
            className="h-10 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export function StrategyPlatformDatesDialog({
  open,
  onOpenChange,
  strategyName,
  items,
  initialStartDates,
  defaultDiffusionDays,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  strategyName: string
  items: StrategyPlatformDateItem[]
  initialStartDates: Record<string, string>
  defaultDiffusionDays: number
  onSave: (rows: StrategyPlatformDateRow[]) => void
}) {
  const [rows, setRows] = useState<StrategyPlatformDateRow[]>([])
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setRows(buildInitialRows(items, initialStartDates, defaultDiffusionDays))
    }
    wasOpenRef.current = open
  }, [open, items, initialStartDates, defaultDiffusionDays])

  const hasInvalid = rows.some((row) => row.endDate < row.startDate)

  const updateRow = (
    itemId: string,
    patch: Partial<Pick<StrategyPlatformDateRow, 'startDate' | 'endDate'>>,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.itemId !== itemId) return row
        const next = { ...row, ...patch }
        if (patch.startDate && patch.startDate > next.endDate) {
          next.endDate = patch.startDate
        }
        if (patch.endDate && patch.endDate < next.startDate) {
          next.startDate = patch.endDate
        }
        return next
      }),
    )
  }

  const handleSave = () => {
    if (hasInvalid || rows.length === 0) return
    onSave(rows)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden"
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement | null
          if (target?.closest('[data-strategy-date-popover]')) {
            event.preventDefault()
          }
        }}
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null
          if (target?.closest('[data-strategy-date-popover]')) {
            event.preventDefault()
          }
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60 shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E94C16]/10 text-[#E94C16] shrink-0">
              <CalendarIcon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base">Calendrier — {strategyName}</DialogTitle>
              <DialogDescription className="text-xs mt-1 leading-relaxed">
                Sélectionnez une plage de dates pour chaque plateforme via le calendrier ou les champs date. La durée
                de diffusion est calculée automatiquement.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ajoutez au moins une plateforme à cette stratégie pour définir les dates.
            </p>
          ) : (
            rows.map((row) => {
              const logo = PLATFORM_LOGOS[row.platform as keyof typeof PLATFORM_LOGOS]
              const duration = daysInclusive(row.startDate, row.endDate)
              const invalid = row.endDate < row.startDate

              return (
                <div
                  key={row.itemId}
                  className={cn(
                    'rounded-xl border p-3 space-y-3',
                    invalid ? 'border-red-300 bg-red-50/40' : 'border-border/70 bg-muted/20',
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {logo ? (
                      <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm">
                        <NextImage src={logo} alt={row.platform} fill className="object-contain" />
                      </span>
                    ) : null}
                    <p className="text-sm font-semibold text-foreground truncate">
                      {formatObjectiveLine(row.platform, row.objective)}
                    </p>
                  </div>

                  <PlatformDateRangePicker row={row} onChange={(patch) => updateRow(row.itemId, patch)} />

                  <p className={cn('text-xs', invalid ? 'text-red-600' : 'text-muted-foreground')}>
                    {invalid ? (
                      'La date de fin doit être après la date de début.'
                    ) : (
                      <>
                        Du <span className="font-medium text-foreground">{formatFrenchDate(row.startDate)}</span> au{' '}
                        <span className="font-medium text-foreground">{formatFrenchDate(row.endDate)}</span>
                        {' — '}
                        <span className="font-medium text-foreground tabular-nums">
                          {duration} jour{duration > 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              )
            })
          )}
        </div>

        <DialogFooter className="px-5 py-4 border-t border-border/60 shrink-0 gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={hasInvalid || rows.length === 0}
            className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
