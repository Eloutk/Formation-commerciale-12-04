import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type { MockupPlatformId } from '@/lib/mockup'
import type { MockupSaveContent, MockupSaveRecord } from '@/lib/mockup-saves'

const MOCKUP_EXPORTS_BUCKET = 'mockup-exports'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export function buildMockupPngStoragePath(userId: string, mockupId: string): string {
  return `${userId}/${mockupId}.png`
}

export async function uploadMockupPng(params: {
  userId: string
  mockupId: string
  blob: Blob
}): Promise<string> {
  const path = buildMockupPngStoragePath(params.userId, params.mockupId)
  const { error } = await supabase.storage.from(MOCKUP_EXPORTS_BUCKET).upload(path, params.blob, {
    contentType: 'image/png',
    upsert: true,
  })

  if (error) throw new Error(error.message)
  return path
}

export async function deleteMockupPng(path: string | null | undefined): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(MOCKUP_EXPORTS_BUCKET).remove([path])
  if (error) throw new Error(error.message)
}

export async function getMockupPngSignedUrl(
  path: string | null | undefined,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(MOCKUP_EXPORTS_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error) throw new Error(error.message)
  return data?.signedUrl ?? null
}

export async function copyMockupPng(params: {
  sourcePath: string | null | undefined
  userId: string
  targetMockupId: string
}): Promise<string | null> {
  if (!params.sourcePath) return null

  const { data, error } = await supabase.storage
    .from(MOCKUP_EXPORTS_BUCKET)
    .download(params.sourcePath)

  if (error || !data) return null

  return uploadMockupPng({
    userId: params.userId,
    mockupId: params.targetMockupId,
    blob: data,
  })
}

export async function listUserMockupSaves(): Promise<MockupSaveRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('mockup_saves')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as MockupSaveRecord[]
}

export async function getMockupSaveById(id: string): Promise<MockupSaveRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('mockup_saves').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as MockupSaveRecord | null) ?? null
}

export async function createMockupSave(params: {
  name: string
  clientName: string
  platform: MockupPlatformId
  content: MockupSaveContent
  previewPngPath?: string | null
}): Promise<MockupSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer un mockup.')

  const { data, error } = await supabase
    .from('mockup_saves')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      client_name: params.clientName.trim(),
      platform: params.platform,
      content: params.content,
      preview_png_path: params.previewPngPath ?? null,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as MockupSaveRecord
}

export async function updateMockupSave(params: {
  id: string
  name: string
  clientName: string
  platform: MockupPlatformId
  content: MockupSaveContent
  previewPngPath?: string | null
}): Promise<MockupSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier un mockup.')

  const { data, error } = await supabase
    .from('mockup_saves')
    .update({
      name: params.name.trim(),
      client_name: params.clientName.trim(),
      platform: params.platform,
      content: params.content,
      ...(params.previewPngPath !== undefined ? { preview_png_path: params.previewPngPath } : {}),
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as MockupSaveRecord
}

export async function deleteMockupSave(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer un mockup.')

  const { data: existing, error: fetchError } = await supabase
    .from('mockup_saves')
    .select('preview_png_path')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError) throw new Error(fetchError.message)

  const { error } = await supabase.from('mockup_saves').delete().eq('id', id).eq('user_id', userId)

  if (error) throw new Error(error.message)

  await deleteMockupPng(existing?.preview_png_path).catch(() => undefined)
}

export async function duplicateMockupSave(source: MockupSaveRecord): Promise<MockupSaveRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour dupliquer un mockup.')

  const record = await createMockupSave({
    name: `Copie de ${source.name}`,
    clientName: source.client_name,
    platform: source.platform,
    content: source.content,
  })

  const previewPngPath = await copyMockupPng({
    sourcePath: source.preview_png_path,
    userId,
    targetMockupId: record.id,
  })

  if (!previewPngPath) return record

  return updateMockupSave({
    id: record.id,
    name: record.name,
    clientName: record.client_name,
    platform: record.platform,
    content: record.content,
    previewPngPath,
  })
}
