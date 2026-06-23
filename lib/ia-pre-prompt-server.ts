import type { SupabaseClient } from '@supabase/supabase-js'
import { getIaActionDefaultPrePrompt } from '@/lib/ia-action-prompts'
import type { IaActionId } from '@/lib/ia-actions'
import { isIaTableMissingError } from '@/lib/ia-db-errors'

/** Résout le pré-prompt côté serveur — jamais exposé au client. */
export async function resolveIaPrePromptServer(
  supabase: SupabaseClient,
  userId: string,
  actionId: IaActionId,
): Promise<string> {
  const fallback = getIaActionDefaultPrePrompt(actionId)
  if (!fallback) {
    throw new Error('Pré-prompt introuvable pour cette action.')
  }

  const { data, error } = await supabase
    .from('ia_pre_prompts')
    .select('pre_prompt')
    .eq('user_id', userId)
    .eq('action_id', actionId)
    .maybeSingle()

  if (error) {
    if (isIaTableMissingError(error.message)) return fallback
    throw new Error(error.message)
  }

  const saved = data?.pre_prompt?.trim()
  return saved || fallback
}

export const IA_ANALYSIS_PUBLIC_COLUMNS =
  'id, user_id, action_id, name, result, model, input_kind, input_label, input_url, client_name, created_at, updated_at'
