import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type {
  StudioTarifsSaveContent,
  StudioTarifsSaveRecord,
} from '@/lib/studio-tarifs-saves'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserStudioTarifsSaves(): Promise<StudioTarifsSaveRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('studio_tarifs_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as StudioTarifsSaveRecord[]
}

export async function getStudioTarifsSaveById(id: string): Promise<StudioTarifsSaveRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('studio_tarifs_saves').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as StudioTarifsSaveRecord | null) ?? null
}

export async function createStudioTarifsSave(params: {
  name: string
  summaryTotalHt: number
  summaryTotalTtc: number
  selectedCount: number
  content: StudioTarifsSaveContent
}): Promise<StudioTarifsSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer un devis studio.')

  const { data, error } = await supabase
    .from('studio_tarifs_saves')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      summary_total_ht: params.summaryTotalHt,
      summary_total_ttc: params.summaryTotalTtc,
      selected_count: params.selectedCount,
      content: params.content,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as StudioTarifsSaveRecord
}

export async function updateStudioTarifsSave(params: {
  id: string
  name: string
  summaryTotalHt: number
  summaryTotalTtc: number
  selectedCount: number
  content: StudioTarifsSaveContent
}): Promise<StudioTarifsSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier un devis studio.')

  const { data, error } = await supabase
    .from('studio_tarifs_saves')
    .update({
      name: params.name.trim(),
      summary_total_ht: params.summaryTotalHt,
      summary_total_ttc: params.summaryTotalTtc,
      selected_count: params.selectedCount,
      content: params.content,
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as StudioTarifsSaveRecord
}

export async function deleteStudioTarifsSave(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer un devis studio.')

  const { error } = await supabase
    .from('studio_tarifs_saves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
