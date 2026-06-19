import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type {
  SimulateurMediaSaveContent,
  SimulateurMediaSaveRecord,
} from '@/lib/simulateur-media-saves'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserSimulateurMediaSaves(): Promise<SimulateurMediaSaveRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('simulateur_media_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as SimulateurMediaSaveRecord[]
}

export async function getSimulateurMediaSaveById(
  id: string,
): Promise<SimulateurMediaSaveRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('simulateur_media_saves').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as SimulateurMediaSaveRecord | null) ?? null
}

export async function createSimulateurMediaSave(params: {
  name: string
  summaryImpressions: number
  content: SimulateurMediaSaveContent
}): Promise<SimulateurMediaSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer une simulation.')

  const { data, error } = await supabase
    .from('simulateur_media_saves')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      summary_impressions: params.summaryImpressions,
      content: params.content,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as SimulateurMediaSaveRecord
}

export async function updateSimulateurMediaSave(params: {
  id: string
  name: string
  summaryImpressions: number
  content: SimulateurMediaSaveContent
}): Promise<SimulateurMediaSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier une simulation.')

  const { data, error } = await supabase
    .from('simulateur_media_saves')
    .update({
      name: params.name.trim(),
      summary_impressions: params.summaryImpressions,
      content: params.content,
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as SimulateurMediaSaveRecord
}

export async function deleteSimulateurMediaSave(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer une simulation.')

  const { error } = await supabase
    .from('simulateur_media_saves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function duplicateSimulateurMediaSave(
  source: SimulateurMediaSaveRecord,
): Promise<SimulateurMediaSaveRecord> {
  return createSimulateurMediaSave({
    name: `Copie de ${source.name}`,
    summaryImpressions: source.summary_impressions,
    content: source.content,
  })
}
