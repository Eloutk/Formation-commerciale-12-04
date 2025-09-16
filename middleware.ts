import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Public assets (toujours accessibles)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  // ✅ Pages publiques : login, register, reset-password
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/reset-password')
  ) {
    return NextResponse.next()
  }

  // Tous les autres chemins passent par la logique côté client (AuthWrapper)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff|woff2)$).*)',
  ],
}
