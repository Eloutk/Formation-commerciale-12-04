import { NextResponse } from 'next/server'
import { getServerSupabase, requireAdminSessionUser } from '@/lib/media-session'
import type { SmsDevisRecord } from '@/lib/sms-devis'
import type { Vente2StrategyRecord } from '@/lib/vente2-strategies'
import {
  authorLabelFromProfile,
  type MonEspaceAdminItem,
  type MonEspaceAuthor,
} from '@/lib/mon-espace-admin'

export const runtime = 'nodejs'

function isMissingRpcError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('could not find the function') ||
    lower.includes('function public.admin_list') ||
    (lower.includes('admin_list') && lower.includes('does not exist'))
  )
}

export async function GET() {
  const { status } = await requireAdminSessionUser()
  if (status === 401) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }
  if (status === 403) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
  }

  const supabase = await getServerSupabase()

  const [strategiesRes, devisRes, profilesRes] = await Promise.all([
    supabase.rpc('admin_list_vente2_strategies'),
    supabase.rpc('admin_list_sms_devis'),
    supabase.rpc('admin_list_profiles_for_mon_espace'),
  ])

  const rpcError = strategiesRes.error ?? devisRes.error ?? profilesRes.error
  if (rpcError) {
    if (isMissingRpcError(rpcError.message)) {
      return NextResponse.json(
        {
          error:
            'Les fonctions admin ne sont pas configurées dans Supabase. Exécutez supabase/mon-espace-admin.sql.',
        },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: rpcError.message }, { status: 500 })
  }

  const strategies = (strategiesRes.data ?? []) as Vente2StrategyRecord[]
  const devis = (devisRes.data ?? []) as SmsDevisRecord[]

  const labelMap = new Map<string, string>()
  for (const profile of profilesRes.data ?? []) {
    labelMap.set(profile.id, authorLabelFromProfile(profile))
  }

  const userIds = [...new Set([...strategies.map((s) => s.user_id), ...devis.map((d) => d.user_id)])]
  for (const id of userIds) {
    if (!labelMap.has(id)) labelMap.set(id, id.slice(0, 8))
  }

  const items: MonEspaceAdminItem[] = [
    ...strategies.map((record) => ({
      kind: 'strategy' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...devis.map((record) => ({
      kind: 'sms' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
  ].sort(
    (a, b) =>
      new Date(b.record.updated_at).getTime() - new Date(a.record.updated_at).getTime(),
  )

  const authors: MonEspaceAuthor[] = [...labelMap.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'))

  return NextResponse.json({ items, authors })
}
