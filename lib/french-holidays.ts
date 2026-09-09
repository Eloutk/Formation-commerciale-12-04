/** Jours fériés français (fixes + variables liés à Pâques). */

function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function iso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  next.setDate(next.getDate() + n)
  return next
}

export function isFrenchPublicHoliday(date = new Date()): boolean {
  const y = date.getFullYear()
  const key = iso(date)
  const easter = easterSunday(y)
  const holidays = new Set([
    `${y}-01-01`,
    `${y}-05-01`,
    `${y}-05-08`,
    `${y}-07-14`,
    `${y}-08-15`,
    `${y}-11-01`,
    `${y}-11-11`,
    `${y}-12-25`,
    iso(addDays(easter, 1)), // Lundi de Pâques
    iso(addDays(easter, 39)), // Ascension
    iso(addDays(easter, 50)), // Lundi de Pentecôte
  ])
  return holidays.has(key)
}

/** Jour ouvré : lun–ven hors fériés français. */
export function isBusinessDayLocal(date = new Date()): boolean {
  const day = date.getDay()
  if (day === 0 || day === 6) return false
  return !isFrenchPublicHoliday(date)
}
