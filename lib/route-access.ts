import { ATTERRISSAGE_HREF, IA_HREF } from '@/lib/nav-config'
import { isAdminRole, type UserRole } from '@/lib/roles'

/** Assets statiques accessibles sans session (login, favicon, polices, branding). */
export const PUBLIC_STATIC_EXACT = new Set([
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/images/base-presentation.jpg',
  '/Logo Link Vertical (Orange).png',
  '/placeholder-logo.png',
  '/placeholder-logo.svg',
  '/placeholder.jpg',
  '/placeholder.svg',
  '/placeholder-user.jpg',
])

export const PUBLIC_STATIC_PREFIXES = ['/fonts/', '/images/'] as const

/** Documents métier à protéger — pas les images (Next/Image les charge sans cookies). */
const SENSITIVE_STATIC_EXT =
  /\.(?:pdf|key|xlsx|xls|pptx?|docx?|zip|csv)$/i

function normalizeAssetPath(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

export function isPublicStaticAsset(pathname: string): boolean {
  const path = normalizeAssetPath(pathname)
  if (PUBLIC_STATIC_EXACT.has(path)) return true
  return PUBLIC_STATIC_PREFIXES.some((prefix) => path.startsWith(prefix))
}

export function isSensitiveStaticAsset(pathname: string): boolean {
  if (isPublicStaticAsset(pathname)) return false
  return SENSITIVE_STATIC_EXT.test(normalizeAssetPath(pathname))
}

/** Routes API accessibles sans session. */
export const PUBLIC_API_PREFIXES = [
  '/api/auth/password',
  '/api/auth/register',
  '/api/auth/session',
  '/api/auth/me',
  '/api/auth/session-info',
  '/api/supabase-auth-proxy',
] as const

export function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/**
 * Retourne l'URL de redirection si l'utilisateur n'a pas accès à ce chemin, sinon null.
 */
export function resolvePathAccessViolation(
  pathname: string,
  role: UserRole | null,
  isAdmin: boolean,
): string | null {
  if (pathname.startsWith('/test-supabase')) return '/login'

  if (pathname.startsWith('/admin') && !isAdmin) {
    return '/home'
  }

  if (pathname.startsWith(IA_HREF) && !isAdmin) {
    return '/home'
  }

  if (pathname.startsWith(ATTERRISSAGE_HREF) && !isAdmin) {
    return '/home'
  }

  return null
}

export function canAccessAdminCalculatorPath(
  _pathname: string,
  _role: UserRole | null,
  _isAdmin: boolean,
): boolean {
  return true
}

export function isAdminFromRole(role: UserRole | null): boolean {
  return isAdminRole(role)
}
