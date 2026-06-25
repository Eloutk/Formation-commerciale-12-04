import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import {
  STUDIO_TARIFS_SECTIONS,
  type StudioTarifsSectionId,
} from '@/lib/studio-tarifs-grid'
import {
  STUDIO_BUDGET_ATTACHMENT_MAX_BYTES,
  STUDIO_BUDGET_SLACK_CHANNEL,
  buildStudioBudgetRequestMessage,
} from '@/lib/studio-budget-request'
import { notifyStudioBudgetMakeWebhook } from '@/lib/studio-budget-make-webhook'

const SLACK_SECTIONS = new Set<StudioTarifsSectionId>(['graphisme', 'fixe'])
const STUDIO_BUDGET_BUCKET = 'studio-budget-requests'

function sanitizeAttachmentFilename(name: string): string {
  const base = name.replace(/[^\w.\-()+\s]/g, '_').replace(/\s+/g, '_').slice(0, 120)
  return base || 'piece-jointe'
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const rowId = String(formData.get('rowId') ?? '').trim()
  const sectionId = String(formData.get('sectionId') ?? '').trim() as StudioTarifsSectionId
  const prestationLabel = String(formData.get('prestationLabel') ?? '').trim()
  const prestationVariant = String(formData.get('prestationVariant') ?? '').trim() || null
  const needDescription = String(formData.get('needDescription') ?? '').trim()
  const userName = String(formData.get('userName') ?? '').trim() || null
  const attachmentEntry = formData.get('attachment')
  const attachment =
    attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : null

  if (!rowId || !sectionId || !prestationLabel || !needDescription) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!SLACK_SECTIONS.has(sectionId)) {
    return NextResponse.json(
      { error: 'Cette section n’utilise pas la demande Slack studio.' },
      { status: 400 },
    )
  }

  if (attachment && attachment.size > STUDIO_BUDGET_ATTACHMENT_MAX_BYTES) {
    return NextResponse.json({ error: 'Le fichier joint ne doit pas dépasser 20 Mo.' }, { status: 400 })
  }

  const sectionLabel =
    STUDIO_TARIFS_SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId

  const displayName =
    userName ||
    ((user.user_metadata as { full_name?: string } | undefined)?.full_name ?? '') ||
    user.email?.split('@')[0] ||
    'Utilisateur'

  const requestId = randomUUID()
  const message = buildStudioBudgetRequestMessage(
    {
      id: rowId,
      sectionId,
      label: prestationLabel,
      variant: prestationVariant ?? undefined,
      explanation: '',
      kind: 'on_demand',
    },
    needDescription,
  )

  let attachmentFilename: string | null = null
  let attachmentPath: string | null = null
  let attachmentUrl: string | null = null
  let attachmentMimeType: string | null = null
  let attachmentSizeBytes: number | null = null

  if (attachment) {
    attachmentFilename = attachment.name
    attachmentMimeType = attachment.type || 'application/octet-stream'
    attachmentSizeBytes = attachment.size
    attachmentPath = `${user.id}/${requestId}/${sanitizeAttachmentFilename(attachment.name)}`

    const buffer = Buffer.from(await attachment.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from(STUDIO_BUDGET_BUCKET)
      .upload(attachmentPath, buffer, {
        contentType: attachmentMimeType,
        upsert: false,
      })

    if (uploadError) {
      console.error('Studio budget attachment upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Impossible de joindre le fichier.' },
        { status: 500 },
      )
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from(STUDIO_BUDGET_BUCKET)
      .createSignedUrl(attachmentPath, 60 * 60 * 24 * 7)

    if (signedError) {
      console.error('Studio budget attachment signed URL error:', signedError)
    } else {
      attachmentUrl = signed?.signedUrl ?? null
    }
  }

  const { data, error } = await supabase
    .from('studio_budget_requests')
    .insert({
      id: requestId,
      user_id: user.id,
      user_name: displayName,
      user_email: user.email ?? null,
      section_id: sectionId,
      section_label: sectionLabel,
      prestation_id: rowId,
      prestation_label: prestationLabel,
      prestation_variant: prestationVariant,
      slack_channel: STUDIO_BUDGET_SLACK_CHANNEL,
      need_description: needDescription,
      message,
      attachment_filename: attachmentFilename,
      attachment_path: attachmentPath,
      attachment_url: attachmentUrl,
      attachment_mime_type: attachmentMimeType,
      attachment_size_bytes: attachmentSizeBytes,
    })
    .select('id, slack_channel, created_at')
    .single()

  if (error) {
    if (attachmentPath) {
      await supabase.storage.from(STUDIO_BUDGET_BUCKET).remove([attachmentPath])
    }
    console.error('Error inserting studio budget request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save studio budget request' },
      { status: 500 },
    )
  }

  let webhookOk = false
  try {
    await notifyStudioBudgetMakeWebhook({
      id: data.id,
      slack_channel: data.slack_channel,
      created_at: data.created_at,
      user_id: user.id,
      user_name: displayName,
      user_email: user.email ?? null,
      section_id: sectionId,
      section_label: sectionLabel,
      prestation_id: rowId,
      prestation_label: prestationLabel,
      prestation_variant: prestationVariant,
      need_description: needDescription,
      message,
      attachment_filename: attachmentFilename,
      attachment_path: attachmentPath,
      attachment_url: attachmentUrl,
      attachment_mime_type: attachmentMimeType,
      attachment_size_bytes: attachmentSizeBytes,
    })
    webhookOk = true
  } catch (webhookError) {
    console.error('Make webhook demande-studio failed:', webhookError)
    return NextResponse.json(
      {
        error:
          webhookError instanceof Error
            ? webhookError.message
            : 'La demande est enregistrée mais le webhook Make a échoué.',
        id: data.id,
        webhook_ok: false,
      },
      { status: 502 },
    )
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    slack_channel: data.slack_channel,
    attachment_url: attachmentUrl,
    webhook_ok: webhookOk,
  })
}
