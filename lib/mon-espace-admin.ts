import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type { SmsDevisRecord } from '@/lib/sms-devis'
import type { Vente2StrategyRecord } from '@/lib/vente2-strategies'

export type MonEspaceCategory = 'all' | 'strategy' | 'sms'

export type MonEspaceAuthor = {
  id: string
  label: string
}

export type MonEspaceAdminItem =
  | { kind: 'strategy'; record: Vente2StrategyRecord; authorLabel: string }
  | { kind: 'sms'; record: SmsDevisRecord; authorLabel: string }

export function authorLabelFromProfile(profile: {
  full_name?: string | null
  id: string
}): string {
  const name = (profile.full_name || '').trim()
  return name || profile.id.slice(0, 8)
}

export async function fetchAuthorLabels(userIds: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(userIds)]
  if (unique.length === 0) return new Map()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', unique)

  if (error) throw new Error(error.message)

  const map = new Map<string, string>()
  for (const row of data ?? []) {
    map.set(row.id, authorLabelFromProfile(row))
  }
  for (const id of unique) {
    if (!map.has(id)) map.set(id, id.slice(0, 8))
  }
  return map
}

export async function listAllSmsDevisForAdmin(): Promise<SmsDevisRecord[]> {
  if (!(await checkIsAdmin())) {
    throw new Error('Accès réservé aux administrateurs.')
  }

  const { data, error } = await supabase
    .from('sms_devis')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as SmsDevisRecord[]
}

export async function listAllVente2StrategiesForAdmin(): Promise<Vente2StrategyRecord[]> {
  if (!(await checkIsAdmin())) {
    throw new Error('Accès réservé aux administrateurs.')
  }

  const { data, error } = await supabase
    .from('vente2_strategies')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Vente2StrategyRecord[]
}

export async function loadMonEspaceAdminItems(): Promise<{
  items: MonEspaceAdminItem[]
  authors: MonEspaceAuthor[]
}> {
  const [strategies, devis] = await Promise.all([
    listAllVente2StrategiesForAdmin(),
    listAllSmsDevisForAdmin(),
  ])

  const userIds = [
    ...strategies.map((s) => s.user_id),
    ...devis.map((d) => d.user_id),
  ]
  const labelMap = await fetchAuthorLabels(userIds)

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

  return { items, authors }
}
