import { addDaysLocal, parseIsoLocal, todayIsoLocal } from '@/lib/date-local'
import { formatLongFrenchDate, getCycleDay } from '@/lib/daily-question-cycle'
import { isBusinessDayLocal } from '@/lib/french-holidays'

export type UpcomingPreviewDay = {
  iso: string
  label: string
  shortLabel: string
  cycleDay: number
  month: number
  day: number
  isBusinessDay: boolean
}

/**
 * Les `count` prochains jours ouvrés (lun–ven hors fériés),
 * en partant de demain. Ex. vendredi → lundi + mardi.
 */
export function getUpcomingPreviewDays(count = 2): UpcomingPreviewDay[] {
  const result: UpcomingPreviewDay[] = []
  let iso = todayIsoLocal()
  let guard = 0

  while (result.length < count && guard < 21) {
    guard += 1
    iso = addDaysLocal(iso, 1)
    const date = parseIsoLocal(iso)
    if (!isBusinessDayLocal(date)) continue

    result.push({
      iso,
      label: formatLongFrenchDate(iso),
      shortLabel: date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      cycleDay: getCycleDay(iso),
      month: date.getMonth() + 1,
      day: date.getDate(),
      isBusinessDay: true,
    })
  }

  return result
}

/**
 * Même logique que get_guess_platform_play / get_motus_play :
 * pick = ((cycle_day - 1) % n) + 1 parmi les lignes actives ordonnées.
 */
export function pickByCycleRotation<T>(
  activeOrderedRows: T[],
  cycleDay: number
): T | null {
  const n = activeOrderedRows.length
  if (n === 0) return null
  const pick = ((Math.max(cycleDay, 1) - 1) % n) + 1
  return activeOrderedRows[pick - 1] ?? null
}
