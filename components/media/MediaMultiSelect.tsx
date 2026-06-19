'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type MediaMultiSelectProps = {
  options: readonly string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  selectedLabel?: (count: number) => string
  disabled?: boolean
  id?: string
}

export function MediaMultiSelect({
  options,
  value,
  onChange,
  placeholder,
  selectedLabel,
  disabled,
  id,
}: MediaMultiSelectProps) {
  const toggle = (option: string) => {
    if (disabled) return
    onChange(
      value.includes(option) ? value.filter((v) => v !== option) : [...value, option],
    )
  }

  const displayValue = () => {
    if (value.length === 0) return placeholder
    if (value.length === 1) return value[0]
    return selectedLabel?.(value.length) ?? `${value.length} sélectionnés`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            value.length === 0 && 'text-muted-foreground',
          )}
        >
          <span className="truncate text-left">{displayValue()}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1.5" align="start">
        <div className="max-h-56 space-y-0.5 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={value.includes(option)}
                onCheckedChange={() => toggle(option)}
                disabled={disabled}
              />
              <span className="leading-tight">{option}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
