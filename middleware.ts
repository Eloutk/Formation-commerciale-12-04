import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isAdminRole, normalizeUserRole } from '@/lib/roles'
import {
  isPublicApiPath,
  isPublicStaticAsset,
  isSensitiveStaticAsset,
  resolvePathAccessViolation,
} from '@/lib/route-access'

function isPublicAuthPage(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/auth/callback')
  )
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  let res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  })
  res.headers.set('x-pathname', pathname)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- Routes API ---
  if (pathname.startsWith('/api')) {
    if (isPublicApiPath(pathname)) {
      return res
    }
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
    }
    return res
  }

  // --- Assets statiques sensibles ---
  if (isSensitiveStaticAsset(pathname) && !user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    isPublicStaticAsset(pathname)
  ) {
    return res
  }

  const isPublicPage = isPublicAuthPage(pathname)

  if (!user && !isPublicPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(redirectUrl)
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role = normalizeUserRole(profile?.role as string | undefined)
    const isAdmin = isAdminRole(role)
    const violation = resolvePathAccessViolation(pathname, role, isAdmin)

    if (violation) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = violation
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/home'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
  /*
   * Toutes les routes sauf chunks Next internes.
   * Les assets publics explicites sont filtrés dans le handler.
   */
    '/((?!_next/static|_next/image).*)',
  ],
}
