// middleware.ts (racine)
// Protège toutes les pages sauf /login, /api, _next et assets statiques.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Toujours créer la réponse d'abord (pour pouvoir set les cookies)
  const res = NextResponse.next({ request: { headers: req.headers } })

  // Client Supabase côté edge avec accès cookies (lecture/écriture)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Récupère l’utilisateur courant (si session valide via cookies)
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = req.nextUrl.pathname

  // Routes publiques à laisser passer (pas de redirection)
  // Autoriser explicitement login, api, _next et fichiers statiques courants
  const isPublic =
    pathname === '/login' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(?:js|css|png|jpg|jpeg|gif|svg|ico|txt|woff2?|map)$/)

  if (isPublic) return res

  // Toutes les autres routes sont protégées → redirige si pas connecté
  if (!user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    // on mémorise la cible pour rediriger après login
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Utilisateur OK → on laisse passer
  return res
}

// Matcher: intercepte tout SAUF _next, fichiers statiques, api et /login
export const config = {
  // Exclut _next, fichiers statiques (extensions listées), api et /login
  matcher: [
    '/((?!_next|api|login|static|.*\.(?:js|css|png|jpg|jpeg|gif|svg|ico|txt|woff|woff2|map)$).*)',
  ],
}
