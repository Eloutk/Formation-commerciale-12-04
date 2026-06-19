import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type { Vente2StrategyContent, Vente2StrategyRecord } from '@/lib/vente2-strategies'

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserVente2Strategies(): Promise<Vente2StrategyRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('vente2_strategies')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Vente2StrategyRecord[]
}

export async function getVente2StrategyById(id: string): Promise<Vente2StrategyRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('vente2_strategies').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Vente2StrategyRecord | null) ?? null
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
  return data as Vente2StrategyRecord
}

export async function updateVente2Strategy(params: {
  id: string
  name: string
  totalAmount: number
  content: Vente2StrategyContent
}): Promise<Vente2StrategyRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier une stratégie.')

  const { data, error } = await supabase
    .from('vente2_strategies')
    .update({
      name: params.name.trim(),
      total_amount: params.totalAmount,
      content: params.content,
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Vente2StrategyRecord
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
