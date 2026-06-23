import type { IaActionId } from '@/lib/ia-actions'

export type IaInputKind = 'pdf' | 'url' | 'pdf_image'

export type IaAnalysisRecord = {
  id: string
  user_id: string
  action_id: IaActionId
  name: string
  result: string
  model: string
  input_kind: IaInputKind
  input_label: string | null
  input_url: string | null
  client_name: string | null
  created_at: string
  updated_at: string
}

export function formatIaAnalysisDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function buildDefaultIaAnalysisName(actionLabel: string, inputLabel: string): string {
  const trimmed = inputLabel.trim()
  if (trimmed) return `${actionLabel} — ${trimmed}`
  return actionLabel
}
