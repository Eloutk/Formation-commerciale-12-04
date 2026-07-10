import { NextResponse } from 'next/server'
import { getServerSupabase, requireAdminSessionUser } from '@/lib/media-session'
import {
  authorLabelFromProfile,
  type MonEspaceAdminItem,
  type MonEspaceAdminMockupRecord,
  type MonEspaceAdminPigeRecord,
  type MonEspaceAdminRetroplanningRecord,
  type MonEspaceAdminSimulateurRecord,
  type MonEspaceAdminSmsRecord,
  type MonEspaceAdminStrategyRecord,
  type MonEspaceAdminStudioTarifsRecord,
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

function isStatementTimeoutError(message: string): boolean {
  return message.toLowerCase().includes('statement timeout')
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

  const [
    strategiesRes,
    retroplanningRes,
    studioTarifsRes,
    simulateurRes,
    mockupsRes,
    pigeRes,
    devisRes,
    profilesRes,
  ] = await Promise.all([
    supabase.rpc('admin_list_vente2_strategies'),
    supabase.rpc('admin_list_retroplanning_saves'),
    supabase.rpc('admin_list_studio_tarifs_saves'),
    supabase.rpc('admin_list_simulateur_media_saves'),
    supabase.rpc('admin_list_mockup_saves'),
    supabase.rpc('admin_list_pige_commerciale_projects'),
    supabase.rpc('admin_list_sms_devis'),
    supabase.rpc('admin_list_profiles_for_mon_espace'),
  ])

  const rpcError =
    strategiesRes.error ??
    retroplanningRes.error ??
    studioTarifsRes.error ??
    simulateurRes.error ??
    mockupsRes.error ??
    pigeRes.error ??
    devisRes.error ??
    profilesRes.error
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
    if (isStatementTimeoutError(rpcError.message)) {
      return NextResponse.json(
        {
          error:
            'La requête admin a expiré (timeout Supabase). Exécutez supabase/mon-espace-admin-performance.sql dans le SQL Editor.',
        },
        { status: 504 },
      )
    }
    return NextResponse.json({ error: rpcError.message }, { status: 500 })
  }

  const strategies = (strategiesRes.data ?? []) as MonEspaceAdminStrategyRecord[]
  const retroplanningSaves = (retroplanningRes.data ?? []) as MonEspaceAdminRetroplanningRecord[]
  const studioTarifsSaves = (studioTarifsRes.data ?? []) as MonEspaceAdminStudioTarifsRecord[]
  const simulateurSaves = (simulateurRes.data ?? []) as MonEspaceAdminSimulateurRecord[]
  const mockupSaves = (mockupsRes.data ?? []) as MonEspaceAdminMockupRecord[]
  const pigeProjects = (pigeRes.data ?? []) as MonEspaceAdminPigeRecord[]
  const devis = (devisRes.data ?? []) as MonEspaceAdminSmsRecord[]

  const labelMap = new Map<string, string>()
  for (const profile of profilesRes.data ?? []) {
    labelMap.set(profile.id, authorLabelFromProfile(profile))
  }

  const userIds = [
    ...new Set([
      ...strategies.map((s) => s.user_id),
      ...retroplanningSaves.map((s) => s.user_id),
      ...studioTarifsSaves.map((s) => s.user_id),
      ...simulateurSaves.map((s) => s.user_id),
      ...mockupSaves.map((m) => m.user_id),
      ...pigeProjects.map((p) => p.user_id),
      ...devis.map((d) => d.user_id),
    ]),
  ]
  for (const id of userIds) {
    if (!labelMap.has(id)) labelMap.set(id, id.slice(0, 8))
  }

  const items: MonEspaceAdminItem[] = [
    ...strategies.map((record) => ({
      kind: 'strategy' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...retroplanningSaves.map((record) => ({
      kind: 'retroplanning' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...studioTarifsSaves.map((record) => ({
      kind: 'studioTarifs' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...simulateurSaves.map((record) => ({
      kind: 'simulateur' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...mockupSaves.map((record) => ({
      kind: 'mockup' as const,
      record,
      authorLabel: labelMap.get(record.user_id) ?? record.user_id.slice(0, 8),
    })),
    ...pigeProjects.map((record) => ({
      kind: 'pige' as const,
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
