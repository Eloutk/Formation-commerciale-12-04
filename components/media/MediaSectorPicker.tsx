'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEDIA_SECTORS, getMediaSectorStyle } from '@/lib/media-config'

type MediaSectorPickerProps = {
  value: string[]
  onChange: (sectors: string[]) => void
  disabled?: boolean
  compact?: boolean
}

export function MediaSectorPicker({ value, onChange, disabled, compact }: MediaSectorPickerProps) {
  const toggle = (sector: string) => {
    if (disabled) return
    onChange(
      value.includes(sector) ? value.filter((s) => s !== sector) : [...value, sector],
    )
  }

  return (
    <div
      className={cn(
        'grid gap-2 rounded-lg border border-border/80 bg-muted/30 p-3',
        compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3',
      )}
    >
      {MEDIA_SECTORS.map((sector) => {
        const checked = value.includes(sector)
        const style = getMediaSectorStyle(sector)
        const id = `sector-${sector.replace(/\s+/g, '-').toLowerCase()}`
        return (
          <button
            key={sector}
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => toggle(sector)}
            className={cn(
              'relative flex min-h-[2.75rem] items-center justify-center rounded-md px-3 py-2 text-center text-sm font-medium leading-tight transition-all',
              checked ? 'ring-2 ring-offset-2 ring-foreground/30 shadow-sm' : 'opacity-75 hover:opacity-100',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            style={{
              backgroundColor: style.background,
              color: style.color,
            }}
            aria-pressed={checked}
          >
            <span className={cn('px-1', checked && 'pr-5')}>{sector}</span>
            {checked ? (
              <Check
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: style.color }}
                aria-hidden
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function MediaSectorBadges({ sectors }: { sectors: string[] }) {
  if (!sectors.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {sectors.map((sector) => {
        const style = getMediaSectorStyle(sector)
        return (
          <span
            key={sector}
            className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight"
            style={{
              backgroundColor: style.background,
              color: style.color,
            }}
          >
            {sector}
          </span>
        )
      })}
    </div>
  )
}
