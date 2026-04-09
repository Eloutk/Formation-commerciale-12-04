import type { CalendarItem } from './types'

/** Partie plateforme avant le premier « :: » (clé métier), sinon la chaîne entière. */
export function calendarBasePlatform(platform: string): string {
  const i = platform.indexOf('::')
  return i === -1 ? platform : platform.slice(0, i)
}

/**
 * Rétroplanning / légende : par plateforme de base, soit uniquement les entrées « phase » (platform::phase),
 * soit uniquement la ligne plateforme seule — jamais les deux en même temps.
 */
export function calendarItemsForDisplayGrouped(items: CalendarItem[]): CalendarItem[] {
  if (items.length === 0) return items

  const byBase = new Map<string, CalendarItem[]>()
  for (const it of items) {
    const b = calendarBasePlatform(it.platform)
    const arr = byBase.get(b) ?? []
    arr.push(it)
    byBase.set(b, arr)
  }

  const firstIndex = new Map<string, number>()
  items.forEach((it, idx) => {
    if (!firstIndex.has(it.platform)) firstIndex.set(it.platform, idx)
  })

  const picked: CalendarItem[] = []
  for (const group of byBase.values()) {
    const phased = group.filter((g) => g.platform.includes('::'))
    if (phased.length > 0) {
      picked.push(...phased)
    } else {
      picked.push(...group)
    }
  }

  picked.sort((a, b) => (firstIndex.get(a.platform) ?? 0) - (firstIndex.get(b.platform) ?? 0))
  return picked
}
