import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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

  // ✅ Pages publiques (accessibles sans être connecté)
  const isPublicPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/test-supabase-connection')

  // Préparer une réponse "next" pour pouvoir écrire des cookies si besoin
  let res = NextResponse.next()

  // Client Supabase côté middleware (lecture session via cookies)
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
    }
  )

  // ⚠️ IMPORTANT: getUser() lit/valide la session correctement
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si pas connecté et page privée -> forcer /login
  if (!user && !isPublicPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    const original = `${req.nextUrl.pathname}${req.nextUrl.search}`
    redirectUrl.searchParams.set('redirect', original)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin-only routes
  if (user && pathname.startsWith('/admin')) {
    // Check user's role from profiles (RLS: user can read own profile)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role = (profile?.role as string | undefined) || 'user'
    const isAdmin = role === 'admin' || role === 'super_admin'
    if (!isAdmin) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/home'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Si connecté et on tente d'aller sur une page publique -> renvoyer vers /home
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
    '/((?!api|_next|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff|woff2)$).*)',
  ],
}
