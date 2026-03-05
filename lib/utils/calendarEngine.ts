import type { CalendarItem, StrategyCalendarData } from '@/app/pdv2/calendar/types'
import type { CalendarPlatformSource } from '@/app/pdv2/calendar/types'

/**
 * Index du jour (0, 1, 2, …) pour une date YYYY-MM-DD par rapport à la date de début.
 * Utiliser partout (grille mois + clic) pour garder les pastilles alignées.
 */
export function getDayIndex(dateStr: string, startDate: string): number {
  const a = new Date(dateStr + 'T12:00:00').getTime()
  const b = new Date(startDate + 'T12:00:00').getTime()
  return Math.round((a - b) / (24 * 60 * 60 * 1000))
}

/**
 * Generate dates from startDate for N days (YYYY-MM-DD), en heure locale pour cohérence avec getDayIndex.
 */
export function getDatesFromStart(startDate: string, days: number): string[] {
  const out: string[] = []
  const d = new Date(startDate + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return out
  for (let i = 0; i < days; i++) {
    const copy = new Date(d)
    copy.setDate(copy.getDate() + i)
    const y = copy.getFullYear()
    const m = String(copy.getMonth() + 1).padStart(2, '0')
    const day = String(copy.getDate()).padStart(2, '0')
    out.push(`${y}-${m}-${day}`)
  }
  return out
}

/**
 * Auto-distribute platforms uniformly over the duration.
 * Each platform gets a contiguous block; blocks are distributed in order.
 */
export function autoDistribute(
  platforms: CalendarPlatformSource[],
  duration: number
): CalendarItem[] {
  if (duration <= 0 || platforms.length === 0) return []
  const items: CalendarItem[] = []
  let cursor = 0
  for (const p of platforms) {
    const length = Math.min(p.maxDays, Math.max(0, duration - cursor))
    if (length > 0) {
      items.push({
        platform: p.platform,
        startDay: cursor,
        length,
        budget: p.budget,
        kpiLabel: p.kpiLabel,
      })
      cursor += length
    }
    if (cursor >= duration) break
  }
  return items
}

/**
 * Validate: no item exceeds total duration; startDay + length <= duration.
 */
export function validateItems(items: CalendarItem[], duration: number): { valid: boolean; message?: string } {
  for (const item of items) {
    if (item.startDay < 0) return { valid: false, message: `${item.platform} : jour de début négatif` }
    if (item.length < 1) return { valid: false, message: `${item.platform} : durée minimale 1 jour` }
    if (item.startDay + item.length > duration) {
      return { valid: false, message: `${item.platform} dépasse la durée totale (${duration} jours)` }
    }
  }
  return { valid: true }
}

/**
 * Check if two items overlap (same platform or any overlap if overlap forbidden).
 */
export function itemsOverlap(a: CalendarItem, b: CalendarItem): boolean {
  const aEnd = a.startDay + a.length
  const bEnd = b.startDay + b.length
  return a.startDay < bEnd && b.startDay < aEnd
}

/**
 * Clamp item to duration and non-negative.
 */
export function clampItem(item: CalendarItem, duration: number): CalendarItem {
  const startDay = Math.max(0, Math.min(item.startDay, duration - 1))
  const length = Math.max(1, Math.min(item.length, duration - startDay))
  return { ...item, startDay, length }
}

/**
 * Total days used per platform (sum of lengths for that platform).
 */
export function totalDaysByPlatform(items: CalendarItem[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const item of items) {
    out[item.platform] = (out[item.platform] ?? 0) + item.length
  }
  return out
}
