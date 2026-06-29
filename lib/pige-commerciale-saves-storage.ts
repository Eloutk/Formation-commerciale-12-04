import supabase from '@/utils/supabase/client'
import {
  getDefaultPigeCommercialeName,
  type PigeCommercialeSaveRecord,
} from '@/lib/pige-commerciale-saves'

const PIGE_BUCKET = 'pige-commerciale-captures'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

function buildImageStoragePath(userId: string, captureId: string, filename: string): string {
  const ext = filename.includes('.') ? filename.split('.').pop() : 'png'
  return `${userId}/${captureId}.${ext || 'png'}`
}

export async function uploadPigeImage(params: {
  userId: string
  captureId: string
  file: File
}): Promise<string> {
  const path = buildImageStoragePath(params.userId, params.captureId, params.file.name)
  const { error } = await supabase.storage.from(PIGE_BUCKET).upload(path, params.file, {
    contentType: params.file.type || 'application/octet-stream',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  return path
}

export async function deletePigeImage(path: string | null | undefined): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(PIGE_BUCKET).remove([path])
  if (error) throw new Error(error.message)
}

export async function getPigeImageSignedUrl(
  path: string | null | undefined,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(PIGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw new Error(error.message)
  return data?.signedUrl ?? null
}

export async function listUserPigeCommercialeSaves(): Promise<PigeCommercialeSaveRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('pige_commerciale_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as PigeCommercialeSaveRecord[]
}

export async function getPigeCommercialeSaveById(id: string): Promise<PigeCommercialeSaveRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from('pige_commerciale_saves')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as PigeCommercialeSaveRecord | null) ?? null
}

export async function createPigeCommercialeSave(params: {
  file: File
  comment?: string
  name?: string
}): Promise<PigeCommercialeSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer une capture.')

  const captureId = crypto.randomUUID()
  const imagePath = await uploadPigeImage({ userId, captureId, file: params.file })

  const { data, error } = await supabase
    .from('pige_commerciale_saves')
    .insert({
      id: captureId,
      user_id: userId,
      name: (params.name?.trim() || getDefaultPigeCommercialeName(params.file.name)).trim(),
      comment: params.comment?.trim() || null,
      image_path: imagePath,
      original_filename: params.file.name,
      mime_type: params.file.type || null,
      file_size: params.file.size,
    })
    .select('*')
    .single()

  if (error) {
    await deletePigeImage(imagePath).catch(() => undefined)
    throw new Error(error.message)
  }

  return data as PigeCommercialeSaveRecord
}

export async function deletePigeCommercialeSave(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer une capture.')

  const { data: existing, error: fetchError } = await supabase
    .from('pige_commerciale_saves')
    .select('image_path')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError) throw new Error(fetchError.message)

  const { error } = await supabase
    .from('pige_commerciale_saves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  await deletePigeImage(existing?.image_path).catch(() => undefined)
}
