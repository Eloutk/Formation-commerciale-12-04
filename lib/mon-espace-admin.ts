import type { MockupPlatformId } from '@/lib/mockup'
import type { RetroplanningSaveRecord } from '@/lib/retroplanning-saves'
import type { SimulateurMediaSaveRecord } from '@/lib/simulateur-media-saves'
import type { SmsDevisRecord, SmsDevisType } from '@/lib/sms-devis'
import type { StudioTarifsSaveRecord } from '@/lib/studio-tarifs-saves'
import type { Vente2StrategyRecord } from '@/lib/vente2-strategies'

export type MonEspaceCategory =
  | 'all'
  | 'strategy'
  | 'retroplanning'
  | 'studioTarifs'
  | 'simulateur'
  | 'mockup'
  | 'pige'
  | 'sms'

export type MonEspaceAuthor = {
  id: string
  label: string
}

export type MonEspaceAdminStrategyRecord = Pick<
  Vente2StrategyRecord,
  'id' | 'user_id' | 'name' | 'total_amount' | 'created_at' | 'updated_at'
>

export type MonEspaceAdminSimulateurRecord = Pick<
  SimulateurMediaSaveRecord,
  'id' | 'user_id' | 'name' | 'summary_impressions' | 'created_at' | 'updated_at'
>

export type MonEspaceAdminMockupRecord = {
  id: string
  user_id: string
  name: string
  client_name: string
  platform: MockupPlatformId
  visual_format: string
  preview_png_path: string | null
  created_at: string
  updated_at: string
}

export type MonEspaceAdminSmsRecord = Pick<
  SmsDevisRecord,
  'id' | 'user_id' | 'name' | 'total_amount' | 'created_at' | 'updated_at'
> & {
  sms_type: SmsDevisType
}

export type MonEspaceAdminRetroplanningRecord = Pick<
  RetroplanningSaveRecord,
  'id' | 'user_id' | 'name' | 'operations_count' | 'created_at' | 'updated_at'
>

export type MonEspaceAdminStudioTarifsRecord = Pick<
  StudioTarifsSaveRecord,
  | 'id'
  | 'user_id'
  | 'name'
  | 'summary_total_ht'
  | 'summary_total_ttc'
  | 'selected_count'
  | 'created_at'
  | 'updated_at'
>

export type MonEspaceAdminPigeRecord = {
  project_id: string
  user_id: string
  name: string
  file_count: number
  created_at: string
  updated_at: string
}

export type MonEspaceAdminItem =
  | { kind: 'strategy'; record: MonEspaceAdminStrategyRecord; authorLabel: string }
  | { kind: 'retroplanning'; record: MonEspaceAdminRetroplanningRecord; authorLabel: string }
  | { kind: 'studioTarifs'; record: MonEspaceAdminStudioTarifsRecord; authorLabel: string }
  | { kind: 'simulateur'; record: MonEspaceAdminSimulateurRecord; authorLabel: string }
  | { kind: 'mockup'; record: MonEspaceAdminMockupRecord; authorLabel: string }
  | { kind: 'pige'; record: MonEspaceAdminPigeRecord; authorLabel: string }
  | { kind: 'sms'; record: MonEspaceAdminSmsRecord; authorLabel: string }

export function authorLabelFromProfile(profile: {
  full_name?: string | null
  id: string
}): string {
  const name = (profile.full_name || '').trim()
  return name || profile.id.slice(0, 8)
}

export async function loadMonEspaceAdminItems(): Promise<{
  items: MonEspaceAdminItem[]
  authors: MonEspaceAuthor[]
}> {
  const res = await fetch('/api/mon-espace/admin', {
    credentials: 'include',
    cache: 'no-store',
  })

  const body = (await res.json().catch(() => ({}))) as {
    items?: MonEspaceAdminItem[]
    authors?: MonEspaceAuthor[]
    error?: string
  }

  if (!res.ok) {
    throw new Error(body.error || 'Impossible de charger les enregistrements administrateur.')
  }

  return {
    items: body.items ?? [],
    authors: body.authors ?? [],
  }
}
