import type { CalendarItem, StrategyCalendarData } from '@/app/vente/calendar/types'
import type { CalendarPlatformSource } from '@/app/vente/calendar/types'

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
 * Auto-distribute platforms over the duration.
 *
 * - Si chaque entrée peut au moins prendre une part égale (ceil(duration / n)),
 *   répartition **uniforme** : toutes les plateformes apparaissent sur la frise.
 * - Sinon (plafonds maxDays bas), comportement séquentiel historique : blocs
 *   contigus dans l’ordre jusqu’à épuisement de la durée.
 */
export function autoDistribute(
  platforms: CalendarPlatformSource[],
  duration: number
): CalendarItem[] {
  if (duration <= 0 || platforms.length === 0) return []
  const n = platforms.length
  const minShare = Math.ceil(duration / n)
  const canEqualSplit = platforms.every((p) => p.maxDays >= minShare)

  let items: CalendarItem[]

  if (canEqualSplit) {
    items = []
    const base = Math.floor(duration / n)
    let rem = duration % n
    let cursor = 0
    for (let i = 0; i < n; i++) {
      let len = base + (rem > 0 ? 1 : 0)
      if (rem > 0) rem--
      len = Math.min(len, platforms[i].maxDays, duration - cursor)
      if (len > 0) {
        items.push({
          platform: platforms[i].platform,
          startDay: cursor,
          length: len,
          budget: platforms[i].budget,
          kpiLabel: platforms[i].kpiLabel,
        })
        cursor += len
      }
    }
  } else {
    items = []
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
  }

  return ensureItemsForAllPlatformSources(items, platforms, duration)
}

/** Complète les items pour que chaque entrée de `platforms` ait une ligne (légende, placement mois). */
export function ensureItemsForAllPlatformSources(
  items: CalendarItem[],
  platforms: CalendarPlatformSource[],
  duration: number,
): CalendarItem[] {
  if (duration < 1 || platforms.length === 0) return items.slice()
  const byPlatform = new Set(items.map((i) => i.platform))
  const extra: CalendarItem[] = []
  let occupyEnd = items.reduce((max, it) => Math.max(max, it.startDay + it.length), 0)

  for (const p of platforms) {
    if (byPlatform.has(p.platform)) continue
    const length = Math.max(1, Math.min(p.maxDays, duration))
    let startDay = Math.min(occupyEnd, Math.max(0, duration - length))
    if (startDay + length > duration) {
      startDay = Math.max(0, duration - length)
    }
    const lenClamped = Math.min(length, duration - startDay)
    extra.push({
      platform: p.platform,
      startDay,
      length: Math.max(1, lenClamped),
      budget: p.budget,
      kpiLabel: p.kpiLabel,
    })
    byPlatform.add(p.platform)
    occupyEnd = Math.max(occupyEnd, startDay + Math.max(1, lenClamped))
  }

  return extra.length ? [...items, ...extra] : items
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
