import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type { RetroplanningSaveContent, RetroplanningSaveRecord } from '@/lib/retroplanning-saves'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserRetroplanningSaves(): Promise<RetroplanningSaveRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('retroplanning_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as RetroplanningSaveRecord[]
}

export async function getRetroplanningSaveById(id: string): Promise<RetroplanningSaveRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('retroplanning_saves').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as RetroplanningSaveRecord | null) ?? null
}

export async function createRetroplanningSave(params: {
  name: string
  operationsCount: number
  content: RetroplanningSaveContent
}): Promise<RetroplanningSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour sauvegarder un rétroplanning.')

  const { data, error } = await supabase
    .from('retroplanning_saves')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      operations_count: params.operationsCount,
      content: params.content,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as RetroplanningSaveRecord
}

export async function updateRetroplanningSave(params: {
  id: string
  name: string
  operationsCount: number
  content: RetroplanningSaveContent
}): Promise<RetroplanningSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier un rétroplanning.')

  const { data, error } = await supabase
    .from('retroplanning_saves')
    .update({
      name: params.name.trim(),
      operations_count: params.operationsCount,
      content: params.content,
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as RetroplanningSaveRecord
}

export async function deleteRetroplanningSave(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer un rétroplanning.')

  const { error } = await supabase
    .from('retroplanning_saves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
