/** Modèle Claude — surcharge possible via ANTHROPIC_MODEL dans .env.local */
export const IA_MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-6'

/** Limite par PDF — jusqu'à 15 Mo/fichier, 75 Mo cumulés (5 PDF max) */
export const IA_MAX_PDF_BYTES = 15 * 1024 * 1024
export const IA_MAX_PDF_TOTAL_BYTES = 75 * 1024 * 1024
export const IA_MAX_PDF_FILES = 5
export const IA_MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const IA_BASE_SYSTEM_PROMPT = `Tu es un analyste commercial senior spécialisé en publicité digitale et média (social ads, search, display, SMS/RCS).
Tu réponds en français, de façon claire et structurée en markdown.
Reste factuel : n'invente pas de chiffres absents des sources fournies.
Si une information manque, indique-le explicitement.`

export function getAnthropicApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim()
  return key || null
}

export function buildIaSystemPrompt(actionHint?: string): string {
  const hint = actionHint?.trim()
  if (!hint) return IA_BASE_SYSTEM_PROMPT
  return `${IA_BASE_SYSTEM_PROMPT}\n\n${hint}`
}
