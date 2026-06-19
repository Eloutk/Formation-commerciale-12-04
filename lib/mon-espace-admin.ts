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
