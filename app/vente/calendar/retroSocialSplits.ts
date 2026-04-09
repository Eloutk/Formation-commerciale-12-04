/** Segment d’une ligne Social media découpée pour le rétro (clé ligne = platform::objective). */
export type RetroSocialLineSegment = { name: string; days: number }

/** Clé stable d’une ligne stratégie. */
export function retroStrategyLineKey(platform: string, objective: string): string {
  return `${platform}::${objective}`
}

/** Clé calendrier pour le i-ème segment (alignée avec strategyPlatformKeys). */
export function retroStrategySubPlatformKey(lineKey: string, index: number): string {
  return `${lineKey}::p${index}`
}

/** Extrait la clé ligne parent depuis une clé `…::p12`, sinon retourne la clé telle quelle. */
export function retroParentLineKeyFromCalendarKey(calendarPlatformKey: string): string {
  const m = calendarPlatformKey.match(/^(.*)::p\d+$/)
  return m ? m[1]! : calendarPlatformKey
}

/**
 * Ajuste les durées pour que chaque segment soit ≥ 1 et la somme = totalDays.
 */
export function rebalanceRetroSocialSegments(
  segments: RetroSocialLineSegment[],
  totalDays: number,
): RetroSocialLineSegment[] {
  const n = segments.length
  if (n === 0 || totalDays < 1) return [{ name: 'Phase 1', days: Math.max(1, totalDays) }]
  const copy = segments.map((s) => ({ ...s, days: Math.max(1, Math.floor(s.days) || 1) }))
  let sum = copy.reduce((a, s) => a + s.days, 0)
  if (sum === totalDays) return copy
  if (sum < totalDays) {
    copy[n - 1] = { ...copy[n - 1]!, days: copy[n - 1]!.days + (totalDays - sum) }
    return copy
  }
  let over = sum - totalDays
  for (let i = n - 1; i >= 0 && over > 0; i--) {
    const room = copy[i]!.days - 1
    const dec = Math.min(over, room)
    copy[i] = { ...copy[i]!, days: copy[i]!.days - dec }
    over -= dec
  }
  if (over > 0) {
    return rebalanceRetroSocialSegments([{ name: copy[0]!.name, days: totalDays }], totalDays)
  }
  return copy
}
