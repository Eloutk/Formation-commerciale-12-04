import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
  STUDIO_TARIFS_SECTIONS,
  type StudioTarifsSectionId,
} from '@/lib/studio-tarifs-grid'
import { STUDIO_BUDGET_SLACK_CHANNEL } from '@/lib/studio-budget-request'

type DemandeBudgetBody = {
  rowId?: string
  sectionId?: StudioTarifsSectionId
  prestationLabel?: string
  prestationVariant?: string | null
  message?: string
  userName?: string | null
}

const SLACK_SECTIONS = new Set<StudioTarifsSectionId>(['graphisme', 'fixe'])

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
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as DemandeBudgetBody
  const { rowId, sectionId, prestationLabel, prestationVariant, message, userName } = body

  if (!rowId || !sectionId || !prestationLabel?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!SLACK_SECTIONS.has(sectionId)) {
    return NextResponse.json(
      { error: 'Cette section n’utilise pas la demande Slack studio.' },
      { status: 400 },
    )
  }

  const sectionLabel =
    STUDIO_TARIFS_SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId

  const displayName =
    userName?.trim() ||
    ((session.user.user_metadata as { full_name?: string } | undefined)?.full_name ?? '') ||
    session.user.email?.split('@')[0] ||
    'Utilisateur'

  const { data, error } = await supabase
    .from('studio_budget_requests')
    .insert({
      user_id: session.user.id,
      user_name: displayName,
      user_email: session.user.email ?? null,
      section_id: sectionId,
      section_label: sectionLabel,
      prestation_id: rowId,
      prestation_label: prestationLabel.trim(),
      prestation_variant: prestationVariant?.trim() || null,
      slack_channel: STUDIO_BUDGET_SLACK_CHANNEL,
      message: message.trim(),
    })
    .select('id, slack_channel, created_at')
    .single()

  if (error) {
    console.error('Error inserting studio budget request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save studio budget request' },
      { status: 500 },
    )
  }

  const makeWebhookUrl = process.env.MAKE_WEBHOOK_DEMANDE_STUDIO_URL?.trim()
  if (makeWebhookUrl) {
    try {
      await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,
          slack_channel: data.slack_channel,
          created_at: data.created_at,
          user_id: session.user.id,
          user_name: displayName,
          user_email: session.user.email ?? null,
          section_id: sectionId,
          section_label: sectionLabel,
          prestation_id: rowId,
          prestation_label: prestationLabel.trim(),
          prestation_variant: prestationVariant?.trim() || null,
          message: message.trim(),
        }),
      })
    } catch (webhookError) {
      console.error('Make webhook demande-studio failed:', webhookError)
    }
  }

  return NextResponse.json({ ok: true, id: data.id, slack_channel: data.slack_channel })
}
