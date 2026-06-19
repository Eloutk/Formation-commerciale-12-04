'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEDIA_PLATFORMS, getMediaPlatformStyle } from '@/lib/media-config'

type MediaPlatformPickerProps = {
  value: string[]
  onChange: (platforms: string[]) => void
  disabled?: boolean
  compact?: boolean
}

export function MediaPlatformPicker({ value, onChange, disabled, compact }: MediaPlatformPickerProps) {
  const toggle = (platform: string) => {
    if (disabled) return
    onChange(
      value.includes(platform) ? value.filter((p) => p !== platform) : [...value, platform],
    )
  }

  return (
    <div
      className={cn(
        'grid gap-2 rounded-lg border border-border/80 bg-muted/30 p-3',
        compact ? 'grid-cols-2' : 'grid-cols-4',
      )}
    >
      {MEDIA_PLATFORMS.map((platform) => {
        const checked = value.includes(platform)
        const style = getMediaPlatformStyle(platform)
        const id = `platform-${platform.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase()}`
        return (
          <button
            key={platform}
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => toggle(platform)}
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
            <span className={cn('px-1', checked && 'pr-5')}>{platform}</span>
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

export function MediaPlatformBadges({ platforms }: { platforms: string[] }) {
  if (!platforms.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {platforms.map((platform) => {
        const style = getMediaPlatformStyle(platform)
        return (
          <span
            key={platform}
            className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight"
            style={{
              backgroundColor: style.background,
              color: style.color,
            }}
          >
            {platform}
          </span>
        )
      })}
    </div>
  )
}
