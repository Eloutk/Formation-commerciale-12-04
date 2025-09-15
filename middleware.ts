import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Public assets
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

  // Always allow public auth pages (login/register/reset-password)
  if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    return NextResponse.next()
  }

  // For other paths, let the client handle redirect based on sessionStorage auth
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon|robots|sitemap|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff|woff2)$).*)',
  ],
} 