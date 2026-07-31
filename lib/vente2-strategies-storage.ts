import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type {
  ColleagueSearchResult,
  Vente2StrategyContent,
  Vente2StrategyRecord,
  Vente2StrategyShareRecord,
} from '@/lib/vente2-strategies'

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserVente2Strategies(): Promise<Vente2StrategyRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase.rpc('list_accessible_vente2_strategies')

  if (error) {
    // Fallback si la RPC n'est pas encore déployée : anciennes stratégies perso uniquement
    const { data: fallback, error: fallbackError } = await supabase
      .from('vente2_strategies')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (fallbackError) throw new Error(error.message)
    return ((fallback ?? []) as Vente2StrategyRecord[]).map((row) => ({
      ...row,
      is_owner: true,
    }))
  }

  return ((data ?? []) as Vente2StrategyRecord[]).map((row) => ({
    ...row,
    is_owner: row.is_owner !== false,
  }))
}

export async function getVente2StrategyById(id: string): Promise<Vente2StrategyRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('vente2_strategies').select('*').eq('id', id)
  // Non-admin : RLS filtre propriétaire + partages ; ne pas forcer user_id
  if (!admin) {
    // no user_id filter — shared strategies must remain readable
  }

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  const record = data as Vente2StrategyRecord
  const isOwner = record.user_id === userId

  if (isOwner || admin) {
    return { ...record, is_owner: true }
  }

  const { data: accessible } = await supabase.rpc('list_accessible_vente2_strategies')
  const match = ((accessible ?? []) as Vente2StrategyRecord[]).find((row) => row.id === id)

  return {
    ...record,
    is_owner: false,
    shared_by_user_id: match?.shared_by_user_id ?? null,
    shared_by_name: match?.shared_by_name ?? 'Collègue',
  }
}

export async function createVente2Strategy(params: {
  name: string
  totalAmount: number
  content: Vente2StrategyContent
}): Promise<Vente2StrategyRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer une stratégie.')

  const { data, error } = await supabase
    .from('vente2_strategies')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      total_amount: params.totalAmount,
      content: params.content,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return { ...(data as Vente2StrategyRecord), is_owner: true }
}

export async function updateVente2Strategy(params: {
  id: string
  name: string
  totalAmount: number
  content: Vente2StrategyContent
}): Promise<Vente2StrategyRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier une stratégie.')

  // Pas de filtre user_id : propriétaire ou collègue avec partage (RLS)
  const { data, error } = await supabase
    .from('vente2_strategies')
    .update({
      name: params.name.trim(),
      total_amount: params.totalAmount,
      content: params.content,
    })
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  const record = data as Vente2StrategyRecord
  return { ...record, is_owner: record.user_id === userId }
}

export async function deleteVente2Strategy(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer une stratégie.')

  const { error } = await supabase
    .from('vente2_strategies')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function duplicateVente2Strategy(source: Vente2StrategyRecord): Promise<Vente2StrategyRecord> {
  return createVente2Strategy({
    name: `Copie de ${source.name}`,
    totalAmount: source.total_amount,
    content: source.content,
  })
}

export async function searchColleaguesForShare(query: string): Promise<ColleagueSearchResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const { data, error } = await supabase.rpc('search_colleagues_for_share', {
    search_query: q,
  })

  if (error) throw new Error(error.message)
  return (data ?? []) as ColleagueSearchResult[]
}

export async function listStrategyShares(strategyId: string): Promise<Vente2StrategyShareRecord[]> {
  const { data, error } = await supabase.rpc('list_vente2_strategy_shares', {
    p_strategy_id: strategyId,
  })

  if (error) throw new Error(error.message)
  return (data ?? []) as Vente2StrategyShareRecord[]
}

export async function shareVente2Strategy(params: {
  strategyId: string
  sharedWithUserId: string
}): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour partager.')
  if (params.sharedWithUserId === userId) {
    throw new Error('Vous ne pouvez pas partager une stratégie avec vous-même.')
  }

  const { error } = await supabase.from('vente2_strategy_shares').insert({
    strategy_id: params.strategyId,
    shared_with_user_id: params.sharedWithUserId,
    shared_by_user_id: userId,
  })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette stratégie est déjà partagée avec cette personne.')
    }
    throw new Error(error.message)
  }
}

export async function revokeVente2StrategyShare(shareId: string): Promise<void> {
  const { error } = await supabase.from('vente2_strategy_shares').delete().eq('id', shareId)
  if (error) throw new Error(error.message)
}

export async function leaveVente2StrategyShare(strategyId: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté.')

  const { error } = await supabase
    .from('vente2_strategy_shares')
    .delete()
    .eq('strategy_id', strategyId)
    .eq('shared_with_user_id', userId)

  if (error) throw new Error(error.message)
}
