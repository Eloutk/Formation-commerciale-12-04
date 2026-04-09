import type { CalendarItem, RetroPlatformPhase } from './types'

/** Durée cible (j) pour un item calendrier selon les cartes « Phases par plateforme » (mode partir de 0). */
export function desiredLengthFromRetroPhases(
  platformKey: string,
  platformPhases: RetroPlatformPhase[],
  fallback: number,
): number | null {
  for (const pp of platformPhases) {
    if (pp.phases.length === 0) {
      if (pp.platform === platformKey) {
        return Math.max(1, pp.singleLineDays ?? fallback)
      }
      continue
    }
    for (const ph of pp.phases) {
      const key = ph.name === pp.platform ? pp.platform : `${pp.platform}::${ph.name}`
      if (key === platformKey) {
        return Math.max(1, ph.defaultDays ?? fallback)
      }
    }
  }
  return null
}

/**
 * Applique les jours saisis dans le panneau rétro aux barres existantes (conserve startDay).
 * À utiliser en mode « partir de 0 » lorsque retroCalendarData est déjà rempli.
 */
export function syncManualRetroItemLengthsFromPhases(
  items: CalendarItem[],
  platformPhases: RetroPlatformPhase[],
  calendarDuration: number,
): CalendarItem[] {
  if (platformPhases.length === 0 || items.length === 0) return items

  return items.map((it) => {
    const want = desiredLengthFromRetroPhases(it.platform, platformPhases, calendarDuration)
    if (want == null) return it
    const maxLen = Math.max(1, calendarDuration - it.startDay)
    const length = Math.min(want, maxLen)
    if (length === it.length) return it
    return { ...it, length }
  })
}

/**
 * Met à jour les durées (defaultDays / singleLineDays) à partir des barres du calendrier
 * (mode manuel « partir de 0 » uniquement).
 */
export function syncManualRetroPlatformPhasesFromItems(
  platformPhases: RetroPlatformPhase[],
  items: CalendarItem[],
): RetroPlatformPhase[] {
  return platformPhases.map((pp) => {
    if (pp.phases.length === 0) {
      const item = items.find((i) => i.platform === pp.platform)
      if (!item) return pp
      if (pp.singleLineDays === item.length) return pp
      return { ...pp, singleLineDays: item.length }
    }
    const nextPhases = pp.phases.map((ph) => {
      const key = ph.name === pp.platform ? pp.platform : `${pp.platform}::${ph.name}`
      const item = items.find((i) => i.platform === key)
      if (!item) return ph
      const d = item.length
      if (ph.defaultDays === d) return ph
      return { ...ph, defaultDays: d }
    })
    const unchanged =
      nextPhases.length === pp.phases.length &&
      nextPhases.every((ph, i) => ph === pp.phases[i])
    if (unchanged) return pp
    return { ...pp, phases: nextPhases }
  })
}

export function manualRetroCalendarDataFromStore(
  startDate: string,
  duration: number,
  items: CalendarItem[],
) {
  return {
    startDate,
    duration,
    items: items.map((i) => ({
      platform: i.platform,
      startDay: i.startDay,
      length: i.length,
      budget: i.budget,
      kpiLabel: i.kpiLabel,
      objective: i.objective,
    })),
  }
}
