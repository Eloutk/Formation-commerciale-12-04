import supabase from '@/utils/supabase/client'
import type { IaAnalysisRecord } from '@/lib/ia-analyses'
import { IA_ANALYSIS_PUBLIC_COLUMNS } from '@/lib/ia-pre-prompt-server'

export async function listUserIaAnalyses(): Promise<IaAnalysisRecord[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data, error } = await supabase
    .from('ia_analyses')
    .select(IA_ANALYSIS_PUBLIC_COLUMNS)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as IaAnalysisRecord[]
}

export async function getIaAnalysisById(id: string): Promise<IaAnalysisRecord | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data, error } = await supabase
    .from('ia_analyses')
    .select(IA_ANALYSIS_PUBLIC_COLUMNS)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as IaAnalysisRecord | null) ?? null
}

export async function deleteIaAnalysis(id: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Vous devez être connecté.')

  const { error } = await supabase
    .from('ia_analyses')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) throw new Error(error.message)
}
