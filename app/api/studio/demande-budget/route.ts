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

type UploadedStudioFile = {
  filename: string
  path: string
  url: string | null
  mimeType: string
  sizeBytes: number
  buffer: Buffer
}

function sanitizeAttachmentFilename(name: string): string {
  const base = name.replace(/[^\w.\-()+\s]/g, '_').replace(/\s+/g, '_').slice(0, 120)
  return base || 'piece-jointe'
}

async function uploadStudioBudgetFile(
  supabase: ReturnType<typeof createServerClient>,
  params: {
    userId: string
    requestId: string
    folder: 'devis' | 'attachments'
    file: File
  },
): Promise<UploadedStudioFile> {
  const filename = sanitizeAttachmentFilename(params.file.name)
  const mimeType = params.file.type || 'application/octet-stream'
  const buffer = Buffer.from(await params.file.arrayBuffer())
  const path = `${params.userId}/${params.requestId}/${params.folder}/${filename}`

  const { error: uploadError } = await supabase.storage
    .from(STUDIO_BUDGET_BUCKET)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message || 'Impossible de stocker le fichier.')
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from(STUDIO_BUDGET_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7)

  if (signedError) {
    console.error('Studio budget signed URL error:', signedError)
  }

  return {
    filename,
    path,
    url: signed?.signedUrl ?? null,
    mimeType,
    sizeBytes: buffer.length,
    buffer,
  }
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
  const clientName = String(formData.get('clientName') ?? '').trim()
  const theme = String(formData.get('theme') ?? '').trim()
  const date = String(formData.get('date') ?? '').trim()
  const details = String(formData.get('details') ?? '').trim()
  const userName = String(formData.get('userName') ?? '').trim() || null
  const devisPdfEntry = formData.get('devisPdf')
  const attachmentEntry = formData.get('attachment')
  const devisPdf =
    devisPdfEntry instanceof File && devisPdfEntry.size > 0 ? devisPdfEntry : null
  const attachment =
    attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : null

  if (!rowId || !sectionId || !prestationLabel || !clientName || !theme || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!devisPdf) {
    return NextResponse.json(
      { error: 'Le devis studio PDF est obligatoire pour envoyer la demande.' },
      { status: 400 },
    )
  }

  const projectName = `${theme} ${date}`.trim()
  const needDescription = details || `${clientName} ${projectName}`.trim()

  if (!SLACK_SECTIONS.has(sectionId)) {
    return NextResponse.json(
      { error: 'Cette section n’utilise pas la demande Slack studio.' },
      { status: 400 },
    )
  }

  if (devisPdf.size > STUDIO_BUDGET_ATTACHMENT_MAX_BYTES) {
    return NextResponse.json({ error: 'Le devis PDF ne doit pas dépasser 20 Mo.' }, { status: 400 })
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

  let devisUpload: UploadedStudioFile | null = null
  let attachmentUpload: UploadedStudioFile | null = null

  try {
    devisUpload = await uploadStudioBudgetFile(supabase, {
      userId: user.id,
      requestId,
      folder: 'devis',
      file: devisPdf,
    })

    if (attachment) {
      attachmentUpload = await uploadStudioBudgetFile(supabase, {
        userId: user.id,
        requestId,
        folder: 'attachments',
        file: attachment,
      })
    }
  } catch (uploadError) {
    const paths = [devisUpload?.path, attachmentUpload?.path].filter(Boolean) as string[]
    if (paths.length > 0) {
      await supabase.storage.from(STUDIO_BUDGET_BUCKET).remove(paths)
    }
    console.error('Studio budget upload error:', uploadError)
    return NextResponse.json(
      {
        error:
          uploadError instanceof Error
            ? uploadError.message
            : 'Impossible de stocker le devis studio.',
      },
      { status: 500 },
    )
  }

  const message = buildStudioBudgetRequestMessage({
    commercialName: displayName,
    clientName,
    theme,
    date,
    pdfLink: devisUpload.url,
    details,
  })

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
      client_name: clientName,
      project_theme: theme,
      project_date: date,
      project_name: projectName,
      slack_channel: STUDIO_BUDGET_SLACK_CHANNEL,
      need_description: needDescription,
      message,
      devis_pdf_filename: devisUpload.filename,
      devis_pdf_path: devisUpload.path,
      devis_pdf_url: devisUpload.url,
      devis_pdf_size_bytes: devisUpload.sizeBytes,
      attachment_filename: attachmentUpload?.filename ?? null,
      attachment_path: attachmentUpload?.path ?? null,
      attachment_url: attachmentUpload?.url ?? null,
      attachment_mime_type: attachmentUpload?.mimeType ?? null,
      attachment_size_bytes: attachmentUpload?.sizeBytes ?? null,
    })
    .select('id, slack_channel, created_at')
    .single()

  if (error) {
    const paths = [devisUpload.path, attachmentUpload?.path].filter(Boolean) as string[]
    if (paths.length > 0) {
      await supabase.storage.from(STUDIO_BUDGET_BUCKET).remove(paths)
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
      client_name: clientName,
      project_theme: theme,
      project_date: date,
      project_name: projectName,
      need_description: needDescription,
      message,
      devis_pdf_filename: devisUpload.filename,
      devis_pdf_path: devisUpload.path,
      devis_pdf_url: devisUpload.url,
      devis_pdf_base64: devisUpload.buffer.toString('base64'),
      devis_pdf_size_bytes: devisUpload.sizeBytes,
      attachment_filename: attachmentUpload?.filename ?? null,
      attachment_path: attachmentUpload?.path ?? null,
      attachment_url: attachmentUpload?.url ?? null,
      attachment_mime_type: attachmentUpload?.mimeType ?? null,
      attachment_size_bytes: attachmentUpload?.sizeBytes ?? null,
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
    devis_pdf_url: devisUpload.url,
    attachment_url: attachmentUpload?.url ?? null,
    webhook_ok: webhookOk,
  })
}
