import type { RetroplanningCalendarEntry } from '@/lib/retroplanning-platforms'

export type RetroplanningSaveContent = {
  version: 1
  entries: RetroplanningCalendarEntry[]
  documentComment?: string
  clientName?: string
}

export type RetroplanningSaveRecord = {
  id: string
  user_id: string
  name: string
  operations_count: number
  content: RetroplanningSaveContent
  created_at: string
  updated_at: string
}

export function formatRetroplanningSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDefaultRetroplanningSaveName(operationsCount: number): string {
  const date = new Date().toLocaleDateString('fr-FR')
  if (operationsCount <= 0) return `Rétroplanning — ${date}`
  return `Rétroplanning — ${date} (${operationsCount} opération${operationsCount > 1 ? 's' : ''})`
}

export function buildRetroplanningSaveContent(params: {
  entries: RetroplanningCalendarEntry[]
  documentComment?: string
  clientName?: string
}): RetroplanningSaveContent {
  return {
    version: 1,
    entries: params.entries.map((entry) => ({ ...entry })),
    documentComment: params.documentComment?.trim() ?? '',
    clientName: params.clientName?.trim() ?? '',
  }
}
