"use client"

import { useEffect, useRef, useState } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ On utilise uniquement le client Supabase centralisé
import supabase from "@/utils/supabase/client"
import { checkIsAdmin } from "@/lib/admin"

interface User {
  id: string
  name: string
  email: string
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mustCompleteName, setMustCompleteName] = useState(false)
  const [nickname, setNickname] = useState("")
  const [savingName, setSavingName] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  // Ne pas masquer login / register / reset : sinon un init auth lent ou bloqué laisse l'écran "Chargement..." indéfiniment.
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/auth/callback") ||
    pathname?.startsWith("/test-supabase-connection")
  const pathnameRef = useRef(pathname)
  const hydrateInFlightRef = useRef<Promise<boolean> | null>(null)
  const lastHydrateAtRef = useRef(0)
  const checkPseudoInFlightRef = useRef<Promise<boolean> | null>(null)

  // Avoid Promise.race() "dangling timeout" rejections that can crash the app (white screen).
  const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms)
    })

    try {
      return await Promise.race([Promise.resolve(promise), timeoutPromise])
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  const getStorageKey = () => {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!raw) return 'sb-local-auth-token'
    try {
      const ref = new URL(raw).hostname.split('.')[0] || 'local'
      return `sb-${ref}-auth-token`
    } catch {
      return 'sb-local-auth-token'
    }
  }

  const getStoredSession = () => {
    try {
      const raw = window.localStorage.getItem(getStorageKey())
      if (!raw) return null
      return JSON.parse(raw) as any
    } catch {
      return null
    }
  }

  const decodeJwtClaims = (jwt: string | undefined) => {
    if (!jwt) return null
    const parts = jwt.split('.')
    if (parts.length < 2) return null
    try {
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const json = decodeURIComponent(
        atob(b64)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      )
      return JSON.parse(json) as Record<string, any>
    } catch {
      return null
    }
  }

  const getSessionFast = async () => {
    // Prefer supabase-js session, but do not block the UI if it stalls.
    try {
      const { data: { session } } = await withTimeout(supabase.auth.getSession(), 1500, 'getSession-fast')
      if (session) return session
    } catch {
      // ignore
    }

    const stored = getStoredSession()
    if (!stored?.access_token && !stored?.refresh_token) return null

    const claims = decodeJwtClaims(stored.access_token)
    const id = (claims?.sub as string | undefined) || ''
    const email = (claims?.email as string | undefined) || (stored?.user?.email as string | undefined) || ''
    const user_metadata = (stored?.user?.user_metadata as any) || {}

    return {
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
      token_type: stored.token_type,
      expires_in: stored.expires_in,
      expires_at: stored.expires_at,
      user: id ? { id, email, user_metadata } : (stored.user ?? null),
    } as any
  }

  const hasLocalSession = () => {
    const stored = getStoredSession()
    return !!(stored?.access_token && stored?.refresh_token)
  }

  const hydrateClientSessionFromServer = async () => {
    // Prevent loops: only hydrate if we truly have no local session,
    // and throttle attempts (some browsers/extensions can stall supabase-js).
    if (hasLocalSession()) return true

    const nowMs = Date.now()
    if (nowMs - lastHydrateAtRef.current < 30_000) return false
    lastHydrateAtRef.current = nowMs

    if (hydrateInFlightRef.current) return await hydrateInFlightRef.current
    hydrateInFlightRef.current = (async () => {
      try {
        const res = await withTimeout(fetch('/api/auth/session-info', { credentials: 'include' }), 4000, 'session-info')
        const json = await res.json().catch(() => null)
        const s = json?.session
        if (!s?.access_token || !s?.refresh_token) return false

        const storageKey = getStorageKey()
        const now = Math.floor(Date.now() / 1000)
        const expires_at = typeof s.expires_at === 'number' ? s.expires_at : (now + (s.expires_in || 3600))

        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            access_token: s.access_token,
            refresh_token: s.refresh_token,
            token_type: s.token_type || 'bearer',
            expires_in: s.expires_in || 3600,
            expires_at,
            user: s.user || null,
          })
        )
        return true
      } catch {
        return false
      } finally {
        hydrateInFlightRef.current = null
      }
    })()

    return await hydrateInFlightRef.current
  }

  const checkPseudo = async () => {
    if (checkPseudoInFlightRef.current) return await checkPseudoInFlightRef.current
    checkPseudoInFlightRef.current = (async () => {
      // Important: this must never throw, otherwise the header can get stuck on "Se connecter".
      const run = async () => {
        const session = await getSessionFast()
        const u = session?.user
        const hasTokens = !!(session as any)?.access_token

        if (!u && !hasTokens) {
          setUser(null)
          setIsAdmin(false)
          return false
        }

        // If tokens exist but user is missing, build a minimal user from JWT claims.
        const stableUser = u
          ? u
          : (() => {
              const claims = decodeJwtClaims((session as any)?.access_token)
              return claims?.sub
                ? { id: claims.sub, email: claims.email || '', user_metadata: {} }
                : null
            })()

        if (!stableUser) {
          setUser(null)
          setIsAdmin(false)
          return false
        }

      if (!u) {
        // keep going with stableUser
      }

      // Set a stable fallback user immediately (avoid header flicker)
      const metaName = ((stableUser as any).user_metadata as any)?.full_name as string | undefined
      const fallbackName = (metaName || (((stableUser as any).email || '') as string).split('@')[0] || '').trim()
      let currentName = fallbackName
      setUser({ id: (stableUser as any).id, name: currentName, email: (stableUser as any).email || '' })

      // Then enrich with profile data (but never block the UI)
      try {
        const { data: profile } = await withTimeout(
          supabase.from('profiles').select('full_name, display_name, role').eq('id', (stableUser as any).id).maybeSingle(),
          6000,
          'profiles'
        )
        const displayName = (profile as any)?.display_name as string | undefined
        const profileName = profile?.full_name as string | undefined
        currentName = (displayName || metaName || profileName || fallbackName).trim()
        setUser({ id: (stableUser as any).id, name: currentName, email: (stableUser as any).email || '' })
        const role = (profile as any)?.role as string | undefined
        const roleNorm = typeof role === 'string' ? role.trim().toLowerCase() : ''
        setIsAdmin(roleNorm === 'admin' || roleNorm === 'super_admin')
      } catch {
        // Garder l'état admin précédent en cas de timeout / erreur réseau
      }

      // Ne demander le nom d'affichage que si l'utilisateur n'a aucun nom (ni display_name, ni full_name, ni metadata)
      // Ainsi les utilisateurs qui ont déjà un pseudo/full_name ne sont pas redemandés
      if (!currentName) {
        setNickname((((stableUser as any).email || '') as string).split('@')[0] || '')
        setMustCompleteName(true)
        return true
      }
      setMustCompleteName(false)
      return false
      }

      try {
        return await run()
      } catch {
        // One last attempt: server sees cookies but client lost localStorage session
        try {
          await hydrateClientSessionFromServer()
          return await run()
        } catch {
          setUser(null)
          setIsAdmin(false)
          return false
        }
      }
    })().finally(() => {
      checkPseudoInFlightRef.current = null
    })

    return await checkPseudoInFlightRef.current
  }

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    const initOnce = async () => {
      try {
        // If server cookies say "connected" but browser lost local session, rehydrate once.
        if (!hasLocalSession()) {
          await hydrateClientSessionFromServer()
        }

        await checkPseudo()
      } finally {
        setLoading(false)
      }
    }

    // Safety: never block the whole app for minutes
    withTimeout(initOnce(), 15000, 'init-once').catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        await checkPseudo()
        const p = pathnameRef.current
        if ((p === '/login' || p === '/register') && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          router.replace('/home')
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAdmin(false)
        setMustCompleteName(false)
        router.replace('/login')
      }
      // Note: do NOT call checkPseudo on TOKEN_REFRESHED to avoid loops when refresh stalls.
    })
    return () => subscription.unsubscribe()
  }, [router])

  // Re-vérifier le statut admin via l'API profiles (au cas où le chargement dans checkPseudo a échoué ou le profil était vide)
  useEffect(() => {
    if (!user || loading) return
    let cancelled = false
    checkIsAdmin().then((ok: boolean) => {
      if (!cancelled) setIsAdmin(ok)
    })
    return () => { cancelled = true }
  }, [user, loading])

  useEffect(() => {
    if (loading) return
    const isPublic = pathname === '/login' || pathname === '/register' || pathname === '/reset-password'
    if (isPublic) {
      // Ne pas rediriger depuis /reset-password : l'utilisateur doit d'abord changer son mot de passe
      if (user && pathname !== '/reset-password') router.replace('/home')
      return
    }
    if (!user) {
      router.replace('/login')
      return
    }
    if (pathname === '/') {
      router.replace('/home')
    }
  }, [pathname, user, loading, router])

  const handleLogout = async () => {
    // Make logout immediate in the UI, then best-effort clear cookies + local session.
    setUser(null)
    setIsAdmin(false)
    setMustCompleteName(false)

    // Clear local storage immediately (prevents re-hydration loops)
    try {
      window.localStorage.removeItem(getStorageKey())
    } catch {}

    // Best-effort: clear server cookies (middleware) with timeout
    try {
      await withTimeout(
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ event: 'SIGNED_OUT' }),
        }),
        2500,
        'logout-session'
      )
    } catch {}

    // Best-effort: clear supabase-js local state without blocking navigation
    try {
      await withTimeout(supabase.auth.signOut(), 1500, 'signOut')
    } catch {}

    // Force navigation after cookie clear attempt
    window.location.assign('/login')
  }

  const saveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = nickname.trim()
    if (!name) return
    setSavingName(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user
      if (!u) return
      await supabase.from('profiles').upsert(
        { id: u.id, display_name: name, full_name: name },
        { onConflict: 'id' }
      )
      await supabase.auth.updateUser({ data: { full_name: name } })
      setUser({ id: u.id, name, email: u.email || '' })
      setMustCompleteName(false)
    } finally {
      setSavingName(false)
    }
  }

  if (loading && !isPublicPath) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isPublicPath && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
              <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
              Link academy
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm">
              {/* Ressources — mega menu au survol */}
              <div className="relative group/mega">
                <span
                  className={cn(
                    'inline-flex cursor-default items-center gap-1 rounded-md px-3 py-2 font-medium',
                    'hover:bg-accent hover:text-accent-foreground',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                >
                  Ressources
                  <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover/mega:rotate-180" aria-hidden />
                </span>
                <div
                  className={cn(
                    'pointer-events-none invisible absolute left-0 top-full z-50 w-[min(100vw-2rem,20rem)] pt-2',
                    'opacity-0 transition-[opacity,visibility] duration-150',
                    'group-hover/mega:pointer-events-auto group-hover/mega:visible group-hover/mega:opacity-100',
                    'focus-within:pointer-events-auto focus-within:visible focus-within:opacity-100',
                  )}
                >
                  <div className="pointer-events-auto h-2 -translate-y-2" aria-hidden />
                  <div className="rounded-xl border border-[#E94C16]/20 bg-popover p-4 shadow-lg">
                    <ul className="space-y-0.5">
                      <li>
                        <Link
                          href="/diffusion"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Diffusion
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/chefferie"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Chefferie de projet
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/studio"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Studio
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/diffusion/zones"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Carte zones
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Link href="/vente" className="rounded-md px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground">
                Vente
              </Link>
              {isAdmin && (
                <Link href="/calculateur-vente-2" className="rounded-md px-3 py-2 font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                  Vente 2
                </Link>
              )}

              {/* Aide — mega menu au survol (à gauche de Admin) */}
              <div className="relative group/mega2">
                <span
                  className={cn(
                    'inline-flex cursor-default items-center gap-1 rounded-md px-3 py-2 font-medium',
                    'hover:bg-accent hover:text-accent-foreground',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                >
                  Aide
                  <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover/mega2:rotate-180" aria-hidden />
                </span>
                <div
                  className={cn(
                    'pointer-events-none invisible absolute left-0 top-full z-50 w-[min(100vw-2rem,18rem)] pt-2',
                    'opacity-0 transition-[opacity,visibility] duration-150',
                    'group-hover/mega2:pointer-events-auto group-hover/mega2:visible group-hover/mega2:opacity-100',
                    'focus-within:pointer-events-auto focus-within:visible focus-within:opacity-100',
                  )}
                >
                  <div className="pointer-events-auto h-2 -translate-y-2" aria-hidden />
                  <div className="rounded-xl border border-[#E94C16]/20 bg-popover p-4 shadow-lg">
                    <ul className="space-y-0.5">
                      <li>
                        <Link
                          href="/documents"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Document
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/glossaire"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          Glossaire
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/faq"
                          className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          FAQ
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <Link href="/admin" className="rounded-md px-3 py-2 font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <MobileNav user={user} isAdmin={isAdmin} onLogout={handleLogout} />
              </div>
              {user ? (
                <>
                  <span className="text-sm text-gray-600 max-w-[180px] truncate">
                    {user.name?.trim() ? user.name : (user.email || '').split('@')[0]}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Link href="/login" className="text-sm text-orange-600 hover:underline">Se connecter</Link>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      <Dialog open={mustCompleteName} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complétez votre nom d'affichage</DialogTitle>
            <DialogDescription>
              Merci de renseigner votre nom d'affichage. Il sera visible dans l'application.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveDisplayName} className="space-y-4">
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nom d'affichage" />
            <DialogFooter>
              <Button type="submit" disabled={savingName}>{savingName ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
