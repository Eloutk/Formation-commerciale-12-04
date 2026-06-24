import {
  formatStudioEuro,
  type StudioTarifsSectionId,
  type StudioTarifsSelectionState,
} from '@/lib/studio-tarifs-grid'

export type StudioTarifsSaveContent = {
  version: 1
  state: StudioTarifsSelectionState
  activeSection: StudioTarifsSectionId
  /** Commentaire libre saisi dans la synthèse devis. */
  comment?: string
}

export type StudioTarifsSaveRecord = {
  id: string
  user_id: string
  name: string
  summary_total_ht: number
  summary_total_ttc: number
  selected_count: number
  content: StudioTarifsSaveContent
  created_at: string
  updated_at: string
}

export function formatStudioTarifsSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDefaultStudioTarifsSaveName(params: {
  selectedCount: number
  totalHT: number
}): string {
  const date = new Date().toLocaleDateString('fr-FR')
  if (params.selectedCount <= 0) return `Devis studio — ${date}`
  return `Devis studio — ${date} (${formatStudioEuro(params.totalHT)} HT)`
}

export function buildStudioTarifsSaveContent(params: {
  state: StudioTarifsSelectionState
  activeSection: StudioTarifsSectionId
  comment?: string
}): StudioTarifsSaveContent {
  return {
    version: 1,
    state: params.state,
    activeSection: params.activeSection,
    comment: params.comment?.trim() ?? '',
  }
}
