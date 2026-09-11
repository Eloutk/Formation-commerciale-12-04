import { addDaysLocal, formatIsoLocal, todayIsoLocal } from '@/lib/date-local'
import {
  formatCycleDayShort,
  getCycleDay,
} from '@/lib/daily-question-cycle'

/** Libellé court pour une date récurrente mois/jour (année courante). */
export function formatMonthDayShort(month: number, day: number): string {
  const date = new Date(new Date().getFullYear(), month - 1, day)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatMonthDayLong(month: number, day: number): string {
  const date = new Date(new Date().getFullYear(), month - 1, day)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Tri à partir d’aujourd’hui pour mois/jour récurrents (0 = aujourd’hui). */
export function monthDaySortKeyFromToday(
  month: number,
  day: number,
  today = new Date()
): number {
  const year = today.getFullYear()
  let target = new Date(year, month - 1, day)
  const start = new Date(year, today.getMonth(), today.getDate())
  if (target < start) {
    target = new Date(year + 1, month - 1, day)
  }
  return Math.round((target.getTime() - start.getTime()) / 86_400_000)
}

export function monthDayToIso(month: number, day: number, year = new Date().getFullYear()): string {
  return formatIsoLocal(new Date(year, month - 1, day))
}

export function isoToMonthDay(iso: string): { month: number; day: number } {
  const [y, m, d] = iso.split('-').map(Number)
  void y
  return { month: m || 1, day: d || 1 }
}

/**
 * Prochaine date (ISO) où l’index `rotationIndex` (0-based) est tiré
 * par la rotation ((cycle_day - 1) % n).
 */
export function nextRotationPlayIso(
  rotationIndex: number,
  activeCount: number,
  fromIso = todayIsoLocal()
): string | null {
  if (activeCount <= 0 || rotationIndex < 0 || rotationIndex >= activeCount) return null
  for (let offset = 0; offset < 370; offset += 1) {
    const iso = addDaysLocal(fromIso, offset)
    const cycle = getCycleDay(iso)
    if ((cycle - 1) % activeCount === rotationIndex) return iso
  }
  return null
}

export function formatNextRotationPlayLabel(
  rotationIndex: number,
  activeCount: number,
  fromIso = todayIsoLocal()
): { iso: string; shortLabel: string; isToday: boolean } | null {
  const iso = nextRotationPlayIso(rotationIndex, activeCount, fromIso)
  if (!iso) return null
  const cycle = getCycleDay(iso)
  return {
    iso,
    shortLabel: formatCycleDayShort(cycle),
    isToday: iso === fromIso,
  }
}
