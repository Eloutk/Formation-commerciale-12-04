import { formatIsoLocal, parseIsoLocal, todayIsoLocal } from '@/lib/date-local'

/** Jours cumulés avant chaque mois (année non bissextile). Février = 28. */
const CUMULATIVE_DAYS_BEFORE_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

/**
 * Jour de cycle 1–365, identique pour tous les utilisateurs.
 * Le 29 février reprend le cycle_day du 28 février (59).
 */
export function getCycleDay(isoDate = todayIsoLocal()): number {
  const date = parseIsoLocal(isoDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  if (month === 2 && day === 29) return 59
  return CUMULATIVE_DAYS_BEFORE_MONTH[month] + day
}

export function formatLongFrenchDate(isoDate = todayIsoLocal()): string {
  return parseIsoLocal(isoDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function firstNameFromDisplayName(userName: string | null | undefined): string {
  const trimmed = (userName || '').trim()
  if (!trimmed) return ''
  return trimmed.split(/\s+/)[0]
}

export function toLocalIsoDate(value: string | Date): string {
  if (value instanceof Date) return formatIsoLocal(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return formatIsoLocal(new Date(value))
}
