/** Dates calendrier en heure locale (évite les décalages UTC avec toISOString). */

export function formatIsoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIsoLocal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function todayIsoLocal(): string {
  return formatIsoLocal(new Date())
}

export function addDaysLocal(iso: string, deltaDays: number): string {
  const d = parseIsoLocal(iso)
  d.setDate(d.getDate() + deltaDays)
  return formatIsoLocal(d)
}

export function daysInclusive(start: string, end: string): number {
  if (!start || !end || end < start) return 1
  const a = parseIsoLocal(start).getTime()
  const b = parseIsoLocal(end).getTime()
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1)
}
