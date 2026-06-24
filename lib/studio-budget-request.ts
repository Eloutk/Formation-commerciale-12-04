import {
  STUDIO_TARIFS_SECTIONS,
  formatStudioPrestationLabel,
  type StudioTarifsRow,
} from '@/lib/studio-tarifs-grid'

export const STUDIO_BUDGET_SLACK_CHANNEL = 'demande-studio'

export const STUDIO_VIDEO_BUDGET_MONDAY_URL =
  'https://link599528.monday.com/boards/1232654449/views/5154451'

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

export function buildStudioBudgetRequestMessage(row: StudioTarifsRow): string {
  const sectionLabel =
    STUDIO_TARIFS_SECTIONS.find((section) => section.id === row.sectionId)?.label ??
    row.sectionId
  return [
    'Demande d’approche budgétaire studio',
    `Section : ${sectionLabel}`,
    `Prestation : ${formatStudioPrestationLabel(row)}`,
  ].join('\n')
}

export async function sendStudioBudgetRequest(params: {
  row: StudioTarifsRow
  userName?: string | null
}): Promise<void> {
  const response = await fetch('/api/studio/demande-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rowId: params.row.id,
      sectionId: params.row.sectionId,
      prestationLabel: params.row.label,
      prestationVariant: params.row.variant ?? null,
      message: buildStudioBudgetRequestMessage(params.row),
      userName: params.userName?.trim() || null,
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error || 'Impossible d’envoyer la demande au studio.')
  }
}
