'use client'

import React, { useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { CalendarItem } from './types'
import { GripVertical, ChevronRight } from 'lucide-react'

const RESIZE_HANDLE_WIDTH = 8

interface PlatformCardProps {
  item: CalendarItem
  color: string
  onResize: (platform: string, newLength: number) => void
  maxLength: number
  disabled?: boolean
  /** Span width in Kanban (days * columnWidth) */
  spanDays?: number
  columnWidth?: number
}

export function PlatformCard({ item, color, onResize, maxLength, disabled, spanDays = 1, columnWidth = 120 }: PlatformCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.platform,
    data: { type: 'platform-card', item },
  })
  const [resizing, setResizing] = useState(false)
  const startXRef = useRef(0)
  const startLengthRef = useRef(0)

  const style: React.CSSProperties = {
    ...(transform ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.85 : 1 } : {}),
    borderLeftWidth: 4,
    borderLeftColor: color,
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing(true)
    startXRef.current = e.clientX
    startLengthRef.current = item.length
  }

  React.useEffect(() => {
    if (!resizing) return
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current
      const dayDelta = Math.round(delta / 40)
      const newLength = Math.max(1, Math.min(maxLength - item.startDay, startLengthRef.current + dayDelta))
      onResize(item.platform, newLength)
    }
    const onUp = () => setResizing(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [resizing, item.platform, item.startDay, maxLength, onResize])

  const spanWidth = spanDays > 1 && columnWidth ? spanDays * columnWidth - 12 : undefined

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, minWidth: spanWidth, width: spanWidth }}
      className={`
        group relative flex items-stretch rounded-lg border shadow-sm min-h-[52px] transition-shadow
        ${isDragging ? 'shadow-md z-50' : ''}
        ${disabled ? 'pointer-events-none opacity-60' : ''}
      `}
      style={style}
    >
      <div
        {...listeners}
        {...attributes}
        className="flex items-center pl-1 pr-0.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Déplacer"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 py-2 pr-1 min-w-0">
        <div className="font-medium text-sm truncate" style={{ color }}>
          {item.platform}
        </div>
        {item.budget != null && (
          <div className="text-xs text-muted-foreground">
            {item.budget.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
          </div>
        )}
        {item.kpiLabel && (
          <div className="text-xs text-muted-foreground truncate">{item.kpiLabel}</div>
        )}
      </div>
      {!disabled && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center shrink-0 hover:bg-black/5 rounded-r"
          title="Étendre sur plusieurs jours"
        >
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
