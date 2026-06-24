import {
  STUDIO_TARIFS_SECTIONS,
  formatStudioPrestationLabel,
  type StudioTarifsRow,
} from '@/lib/studio-tarifs-grid'

export const STUDIO_BUDGET_SLACK_CHANNEL = 'demande-studio'

export const STUDIO_VIDEO_BUDGET_MONDAY_URL =
  'https://link599528.monday.com/boards/1232654449/views/5154451'

export const STUDIO_BUDGET_ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024

export function usesStudioBudgetSlackRequest(row: StudioTarifsRow): boolean {
  return (
    row.kind === 'on_demand' &&
    (row.sectionId === 'graphisme' || row.sectionId === 'fixe')
  )
}

export function getStudioBudgetRequestHref(row: StudioTarifsRow): string | null {
  if (row.kind !== 'on_demand' || usesStudioBudgetSlackRequest(row)) return null
  if (row.sectionId === 'video') return STUDIO_VIDEO_BUDGET_MONDAY_URL
  return null
}

export function buildStudioBudgetRequestMessage(
  row: StudioTarifsRow,
  needDescription: string,
): string {
  const sectionLabel =
    STUDIO_TARIFS_SECTIONS.find((section) => section.id === row.sectionId)?.label ??
    row.sectionId
  return [
    'Demande d’approche budgétaire studio',
    `Section : ${sectionLabel}`,
    `Prestation : ${formatStudioPrestationLabel(row)}`,
    '',
    'Besoin :',
    needDescription.trim(),
  ].join('\n')
}

export async function sendStudioBudgetRequest(params: {
  row: StudioTarifsRow
  needDescription: string
  attachment?: File | null
  userName?: string | null
}): Promise<void> {
  const needDescription = params.needDescription.trim()
  if (!needDescription) {
    throw new Error('Veuillez décrire votre besoin.')
  }

  if (params.attachment && params.attachment.size > STUDIO_BUDGET_ATTACHMENT_MAX_BYTES) {
    throw new Error('Le fichier joint ne doit pas dépasser 20 Mo.')
  }

  const formData = new FormData()
  formData.append('rowId', params.row.id)
  formData.append('sectionId', params.row.sectionId)
  formData.append('prestationLabel', params.row.label)
  if (params.row.variant) formData.append('prestationVariant', params.row.variant)
  formData.append('needDescription', needDescription)
  if (params.userName?.trim()) formData.append('userName', params.userName.trim())
  if (params.attachment) formData.append('attachment', params.attachment)

  const response = await fetch('/api/studio/demande-budget', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error || 'Impossible d’envoyer la demande au studio.')
  }
}
