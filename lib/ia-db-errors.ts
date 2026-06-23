const IA_SETUP_HINT =
  'Exécutez le script supabase/ia-analyses.sql dans Supabase > SQL Editor, puis rechargez la page.'

export function isIaTableMissingError(message: string | undefined): boolean {
  if (!message) return false
  const lower = message.toLowerCase()
  return (
    lower.includes('does not exist') &&
    (lower.includes('ia_pre_prompts') || lower.includes('ia_analyses'))
  )
}

export function iaTableMissingResponse() {
  return {
    error: `Tables IA non configurées. ${IA_SETUP_HINT}`,
    setupRequired: true as const,
  }
}

export { IA_SETUP_HINT }
