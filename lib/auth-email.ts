export const ALLOWED_REGISTRATION_DOMAIN = 'link.fr'

export function isAllowedRegistrationEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf('@')
  if (at <= 0 || at === normalized.length - 1) return false
  const domain = normalized.slice(at + 1)
  return domain === ALLOWED_REGISTRATION_DOMAIN
}
