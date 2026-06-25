import { VENTE2_STUDIO_TARIFS_HREF } from '@/lib/nav-config'
import {
  canAccessDemandesPotentiels,
  canAccessDocuments,
  canAccessStudioTarifs,
  isAdminRole,
  type UserRole,
} from '@/lib/roles'

/** Assets statiques accessibles sans session (login, favicon, polices). */
export const PUBLIC_STATIC_EXACT = new Set([
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/images/base-presentation.jpg',
])

export const PUBLIC_STATIC_PREFIXES = ['/fonts/'] as const

const SENSITIVE_STATIC_EXT =
  /\.(?:pdf|key|xlsx|xls|pptx?|docx?|zip|csv|png|jpe?g|gif|webp|svg)$/i

export function isPublicStaticAsset(pathname: string): boolean {
  if (PUBLIC_STATIC_EXACT.has(pathname)) return true
  return PUBLIC_STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function isSensitiveStaticAsset(pathname: string): boolean {
  if (isPublicStaticAsset(pathname)) return false
  return SENSITIVE_STATIC_EXT.test(pathname)
}

/** Routes API accessibles sans session. */
export const PUBLIC_API_PREFIXES = [
  '/api/auth/password',
  '/api/auth/register',
  '/api/auth/session',
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

  if (!canAccessDocuments(role) && (pathname === '/documents' || pathname.startsWith('/documents/'))) {
    return '/home'
  }

  if (
    !canAccessDemandesPotentiels(role) &&
    (pathname === '/demandes-potentiels' ||
      pathname === '/formation/demandes-potentiels' ||
      pathname.startsWith('/formation/demandes-potentiels/'))
  ) {
    return '/diffusion'
  }

  if (
    pathname.startsWith('/ia') ||
    pathname.startsWith('/calcul-cpm-cpc') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/tuto')
  ) {
    if (!isAdmin) return '/home'
  }

  if (pathname.startsWith('/calculateur-vente-2') || pathname.startsWith('/strategie')) {
    if (pathname.startsWith(VENTE2_STUDIO_TARIFS_HREF)) {
      if (!canAccessStudioTarifs(role)) return '/home'
      return null
    }
    if (!isAdmin) return '/home'
  }

  return null
}

export function canAccessAdminCalculatorPath(
  pathname: string,
  role: UserRole | null,
  isAdmin: boolean,
): boolean {
  return resolvePathAccessViolation(pathname, role, isAdmin) === null
}

export function isAdminFromRole(role: UserRole | null): boolean {
  return isAdminRole(role)
}
