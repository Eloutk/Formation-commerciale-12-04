export type BirthdayRow = {
  name: string
  month: number
  day: number
}

export type UpcomingBirthday = BirthdayRow & {
  daysUntil: number
  isToday: boolean
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

function nextOccurrence(month: number, day: number, from: Date): Date | null {
  const year = from.getFullYear()
  const tryDate = (y: number) => {
    const dim = daysInMonth(month, y)
    if (day > dim) return null
    return new Date(y, month - 1, day)
  }

  const thisYear = tryDate(year)
  const startOfToday = new Date(year, from.getMonth(), from.getDate())
  if (thisYear && thisYear >= startOfToday) return thisYear
  return tryDate(year + 1)
}

export function upcomingBirthdays(
  rows: BirthdayRow[],
  from = new Date(),
  withinDays = 7
): UpcomingBirthday[] {
  const startOfToday = new Date(from.getFullYear(), from.getMonth(), from.getDate())

  return rows
    .map((row) => {
      const next = nextOccurrence(row.month, row.day, from)
      if (!next) return null
      const daysUntil = Math.round((next.getTime() - startOfToday.getTime()) / 86_400_000)
      if (daysUntil < 0 || daysUntil > withinDays) return null
      return {
        ...row,
        daysUntil,
        isToday: daysUntil === 0,
      }
    })
    .filter((row): row is UpcomingBirthday => row !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil || a.name.localeCompare(b.name, 'fr'))
}

export function formatDaysUntil(daysUntil: number): string {
  if (daysUntil === 0) return "aujourd'hui"
  if (daysUntil === 1) return 'demain'
  return `dans ${daysUntil} jours`
}
