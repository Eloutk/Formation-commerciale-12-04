import { type StudioTarifsRow } from '@/lib/studio-tarifs-grid'

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

export function buildStudioBudgetRequestMessage(params: {
  commercialName: string
  clientName: string
  theme: string
  date: string
  pdfLink?: string | null
  details?: string
}): string {
  const commercial = params.commercialName.trim() || 'Un commercial'
  const client = params.clientName.trim()
  const theme = params.theme.trim()
  const date = params.date.trim()
  const cible = [client, theme, date].filter(Boolean).join(' ')
  const pdfLink = params.pdfLink?.trim() ?? ''

  const lines = [
    `Salut ! ${commercial} a besoin d’une approche budgétaire pour ${cible}`,
    'Tu trouveras toutes les info nécessaires pour créer l’approche ;)',
    `Lien du PDF : ${pdfLink}`.trimEnd(),
  ]

  const details = params.details?.trim()
  if (details) {
    lines.push('', 'Détails complémentaires :', details)
  }

  return lines.join('\n')
}

export async function sendStudioBudgetRequest(params: {
  row: StudioTarifsRow
  clientName: string
  theme: string
  date: string
  details?: string
  devisPdf: File
  attachment?: File | null
  userName?: string | null
}): Promise<void> {
  const clientName = params.clientName.trim()
  const theme = params.theme.trim()
  const date = params.date.trim()
  if (!clientName) {
    throw new Error('Veuillez renseigner le nom du client.')
  }
  if (!theme) {
    throw new Error('Veuillez renseigner le thème du projet.')
  }
  if (!date) {
    throw new Error('Veuillez renseigner la date du projet.')
  }

  if (!params.devisPdf || params.devisPdf.size <= 0) {
    throw new Error('Le devis studio PDF est obligatoire pour envoyer la demande.')
  }

  if (params.devisPdf.size > STUDIO_BUDGET_ATTACHMENT_MAX_BYTES) {
    throw new Error('Le devis PDF ne doit pas dépasser 20 Mo.')
  }

  if (params.attachment && params.attachment.size > STUDIO_BUDGET_ATTACHMENT_MAX_BYTES) {
    throw new Error('Le fichier joint ne doit pas dépasser 20 Mo.')
  }

  const formData = new FormData()
  formData.append('rowId', params.row.id)
  formData.append('sectionId', params.row.sectionId)
  formData.append('prestationLabel', params.row.label)
  if (params.row.variant) formData.append('prestationVariant', params.row.variant)
  formData.append('clientName', clientName)
  formData.append('theme', theme)
  formData.append('date', date)
  if (params.details?.trim()) formData.append('details', params.details.trim())
  if (params.userName?.trim()) formData.append('userName', params.userName.trim())
  formData.append('devisPdf', params.devisPdf)
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
