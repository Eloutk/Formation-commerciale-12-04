import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type {
  SimulateurMediaSaveAttachment,
  SimulateurMediaSaveContent,
  SimulateurMediaSaveRecord,
} from '@/lib/simulateur-media-saves'

const SIMULATEUR_MEDIA_BUCKET = 'simulateur-media-attachments'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

function buildAttachmentStoragePath(userId: string, saveId: string, filename: string): string {
  const ext = filename.toLowerCase().endsWith('.pdf') ? 'pdf' : 'pdf'
  const safeBase = filename.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '_').slice(0, 80)
  return `${userId}/${saveId}/${safeBase || 'document'}.${ext}`
}

export async function uploadSimulateurMediaAttachment(params: {
  userId: string
  saveId: string
  file: File
}): Promise<SimulateurMediaSaveAttachment> {
  const path = buildAttachmentStoragePath(params.userId, params.saveId, params.file.name)
  const { error } = await supabase.storage.from(SIMULATEUR_MEDIA_BUCKET).upload(path, params.file, {
    contentType: params.file.type || 'application/pdf',
    upsert: true,
  })
  if (error) throw new Error(error.message)
  return {
    attachment_path: path,
    attachment_filename: params.file.name,
    attachment_mime_type: params.file.type || 'application/pdf',
    attachment_file_size: params.file.size,
  }
}

export async function deleteSimulateurMediaAttachment(path: string | null | undefined): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(SIMULATEUR_MEDIA_BUCKET).remove([path])
  if (error) throw new Error(error.message)
}

export async function getSimulateurMediaAttachmentSignedUrl(
  path: string | null | undefined,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(SIMULATEUR_MEDIA_BUCKET)
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw new Error(error.message)
  return data?.signedUrl ?? null
}

function attachmentFields(attachment?: SimulateurMediaSaveAttachment | null) {
  if (!attachment) {
    return {
      attachment_path: null,
      attachment_filename: null,
      attachment_mime_type: null,
      attachment_file_size: null,
    }
  }
  return attachment
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
  id?: string
  name: string
  summaryImpressions: number
  content: SimulateurMediaSaveContent
  attachment?: SimulateurMediaSaveAttachment | null
}): Promise<SimulateurMediaSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer une simulation.')

  const { data, error } = await supabase
    .from('simulateur_media_saves')
    .insert({
      ...(params.id ? { id: params.id } : {}),
      user_id: userId,
      name: params.name.trim(),
      summary_impressions: params.summaryImpressions,
      content: params.content,
      ...attachmentFields(params.attachment),
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
  attachment?: SimulateurMediaSaveAttachment | null
  clearAttachment?: boolean
}): Promise<SimulateurMediaSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier une simulation.')

  const updatePayload: Record<string, unknown> = {
    name: params.name.trim(),
    summary_impressions: params.summaryImpressions,
    content: params.content,
  }

  if (params.clearAttachment) {
    Object.assign(updatePayload, attachmentFields(null))
  } else if (params.attachment) {
    Object.assign(updatePayload, params.attachment)
  }

  const { data, error } = await supabase
    .from('simulateur_media_saves')
    .update(updatePayload)
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

  const { data: existing, error: fetchError } = await supabase
    .from('simulateur_media_saves')
    .select('attachment_path')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError) throw new Error(fetchError.message)

  const { error } = await supabase
    .from('simulateur_media_saves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  await deleteSimulateurMediaAttachment(existing?.attachment_path).catch(() => undefined)
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
