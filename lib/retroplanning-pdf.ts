import type { CalendarItem, StrategyCalendarData } from '@/app/vente/calendar/types'
import {
  downloadRetroplanningPdf,
  getRetroplanningPdfBlob,
} from '@/app/vente/calendar/RetroplanningPdfDocument'
import type { RetroplanningCalendarEntry } from '@/lib/retroplanning-platforms'

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

function diffDays(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso).getTime()
  const to = parseIsoDate(toIso).getTime()
  return Math.round((to - from) / 86_400_000)
}

export function entriesToCalendarData(
  entries: RetroplanningCalendarEntry[],
): StrategyCalendarData | null {
  if (entries.length === 0) return null

  let start = entries[0]!.startDate
  let end = entries[0]!.endDate
  for (const entry of entries) {
    if (entry.startDate < start) start = entry.startDate
    if (entry.endDate > end) end = entry.endDate
  }

  const timelineStart = addDaysIso(start, -7)
  const timelineEnd = addDaysIso(end, 14)
  const duration = Math.max(1, diffDays(timelineStart, timelineEnd) + 1)

  const items: CalendarItem[] = entries.map((entry) => ({
    platform: `${entry.platform}::${entry.operationName}`,
    startDay: Math.max(0, diffDays(timelineStart, entry.startDate)),
    length: Math.max(1, diffDays(entry.startDate, entry.endDate) + 1),
    objective: entry.operationName,
  }))

  return { startDate: timelineStart, duration, items }
}

export function defaultRetroplanningPdfFilename(): string {
  const today = toIsoDate(new Date())
  return `Retroplanning_${today}.pdf`
}

export async function exportStrategieRetroplanningPdf(params: {
  filename: string
  personName: string
  clientName?: string
  documentComment?: string
  entries: RetroplanningCalendarEntry[]
}): Promise<void> {
  const calendarData = entriesToCalendarData(params.entries)
  if (!calendarData) throw new Error('Ajoutez au moins une opération au calendrier.')

  await downloadRetroplanningPdf({
    filename: params.filename.endsWith('.pdf') ? params.filename : `${params.filename}.pdf`,
    personName: params.personName,
    clientName: params.clientName,
    documentComment: params.documentComment,
    linkSocial: false,
    linkSms: false,
    smsType: 'sms',
    calendarData,
    includeWeekTimeline: true,
    includeMonthGrids: false,
    brandPlatformColors: true,
  })
}

export async function getStrategieRetroplanningPdfBlob(params: {
  filename: string
  personName: string
  clientName?: string
  documentComment?: string
  entries: RetroplanningCalendarEntry[]
}): Promise<Blob> {
  const calendarData = entriesToCalendarData(params.entries)
  if (!calendarData) throw new Error('Ajoutez au moins une opération au calendrier.')

  return getRetroplanningPdfBlob({
    filename: params.filename.endsWith('.pdf') ? params.filename : `${params.filename}.pdf`,
    personName: params.personName,
    clientName: params.clientName,
    documentComment: params.documentComment,
    linkSocial: false,
    linkSms: false,
    smsType: 'sms',
    calendarData,
    includeWeekTimeline: true,
    includeMonthGrids: false,
    brandPlatformColors: true,
  })
}
