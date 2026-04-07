import type { CalendarItem, RetroPlatformPhase } from './types'

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
