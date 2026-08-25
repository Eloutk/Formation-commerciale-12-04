/** Helpers email Link — sans casser l’autofill navigateur. */

export const LINK_FR_SUFFIX = '@link.fr'
export const ALLOWED_REGISTRATION_DOMAIN = 'link.fr'

export function isAllowedRegistrationEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf('@')
  if (at <= 0 || at === normalized.length - 1) return false
  const domain = normalized.slice(at + 1)
  return domain === ALLOWED_REGISTRATION_DOMAIN
}

/**
 * Normalise un email pour la connexion / inscription.
 * - trim + lowercase
 * - si pas de @, ajoute @link.fr
 * - ne réécrit PAS un domaine déjà saisi (ex. autofill complet)
 */
export function normalizeAuthEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return ''
  if (!trimmed.includes('@')) return `${trimmed}${LINK_FR_SUFFIX}`
  return trimmed
}

/**
 * Suggestion douce au blur : complète @link.fr seulement si l’utilisateur
 * a saisi la partie locale sans @.
 */
export function suggestLinkFrEmail(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.includes('@')) return trimmed
  return `${trimmed}${LINK_FR_SUFFIX}`
}
