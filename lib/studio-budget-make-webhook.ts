export const STUDIO_BUDGET_MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_DEMANDE_STUDIO_URL?.trim() ||
  'https://hook.eu2.make.com/7jud2hoasr4sb5q8e61s85pixpqyiadc'

export type StudioBudgetMakeWebhookPayload = {
  id: string
  slack_channel: string
  created_at: string
  user_id: string
  user_name: string
  user_email: string | null
  section_id: string
  section_label: string
  prestation_id: string
  prestation_label: string
  prestation_variant: string | null
  client_name: string
  project_theme: string
  project_date: string
  project_name: string
  need_description: string
  message: string
  devis_pdf_filename: string | null
  devis_pdf_path: string | null
  devis_pdf_url: string | null
  devis_pdf_base64: string | null
  devis_pdf_size_bytes: number | null
  attachment_filename: string | null
  attachment_path: string | null
  attachment_url: string | null
  attachment_mime_type: string | null
  attachment_size_bytes: number | null
}

export async function notifyStudioBudgetMakeWebhook(
  payload: StudioBudgetMakeWebhookPayload,
): Promise<void> {
  const response = await fetch(STUDIO_BUDGET_MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(
      `Webhook Make indisponible (${response.status})${details ? ` : ${details.slice(0, 200)}` : ''}`,
    )
  }
}
