import supabase from '@/utils/supabase/client'
import { checkIsAdmin } from '@/lib/admin'
import type { SmsDevisContent, SmsDevisRecord, SmsDevisType } from '@/lib/sms-devis'

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function listUserSmsDevis(): Promise<SmsDevisRecord[]> {
  const userId = await getCurrentUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('sms_devis')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as SmsDevisRecord[]
}

export async function getSmsDevisById(id: string): Promise<SmsDevisRecord | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const admin = await checkIsAdmin()
  let query = supabase.from('sms_devis').select('*').eq('id', id)
  if (!admin) query = query.eq('user_id', userId)

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  return (data as SmsDevisRecord | null) ?? null
}

export async function createSmsDevis(params: {
  name: string
  smsType: SmsDevisType
  totalAmount: number
  content: SmsDevisContent
}): Promise<SmsDevisRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour enregistrer un devis.')

  const { data, error } = await supabase
    .from('sms_devis')
    .insert({
      user_id: userId,
      name: params.name.trim(),
      sms_type: params.smsType,
      total_amount: params.totalAmount,
      content: params.content,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as SmsDevisRecord
}

export async function updateSmsDevis(params: {
  id: string
  name: string
  smsType: SmsDevisType
  totalAmount: number
  content: SmsDevisContent
}): Promise<SmsDevisRecord> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour modifier un devis.')

  const { data, error } = await supabase
    .from('sms_devis')
    .update({
      name: params.name.trim(),
      sms_type: params.smsType,
      total_amount: params.totalAmount,
      content: params.content,
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as SmsDevisRecord
}

export async function deleteSmsDevis(id: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Vous devez être connecté pour supprimer un devis.')

  const { error } = await supabase
    .from('sms_devis')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function duplicateSmsDevis(source: SmsDevisRecord): Promise<SmsDevisRecord> {
  return createSmsDevis({
    name: `Copie de ${source.name}`,
    smsType: source.sms_type,
    totalAmount: source.total_amount,
    content: source.content,
  })
}
