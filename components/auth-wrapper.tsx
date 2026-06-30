"use client"

import { useEffect, useRef, useState, useMemo, Suspense } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DoorOpen } from 'lucide-react'
import { MobileNav } from '@/components/mobile-nav'
import { HeaderNavMenu } from '@/components/nav/header-nav-menu'
import { MonEspaceHeaderNavMenu } from '@/components/nav/mon-espace-nav-menu'
import { HeaderSearch } from '@/components/nav/header-search'
import { AdminNavTab } from '@/components/nav/admin-nav-tab'
import {
  ACADEMY_LINKS,
  GUIDES_LINKS,
  STRATEGIE_LINKS,
  VENTE2_LINKS,
  IA_HREF,
  MON_ESPACE_LINKS,
  canShowVente2Nav,
  isAcademyPath,
  isGuidesPath,
  isIaPath,
  isMonEspacePath,
  isStrategiePath,
  isVente2Path,
  withActiveItems,
} from '@/lib/nav-config'

// ✅ On utilise uniquement le client Supabase centralisé
import supabase from "@/utils/supabase/client"
import { checkIsAdmin, getCurrentUserRole } from "@/lib/admin"
import { AuthAccessContext } from "@/components/auth-context"
import { hasAppPermission } from "@/lib/permissions"
import { isAdminRole, normalizeUserRole, type UserRole } from "@/lib/roles"

interface User {
  id: string
  name: string
  email: string
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [adminResolved, setAdminResolved] = useState(false)
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
    pathname?.startsWith("/auth/callback")
  const pathnameRef = useRef(pathname)
  const hydrateInFlightRef = useRef<Promise<boolean> | null>(null)
  const lastHydrateAtRef = useRef(0)
  const checkPseudoInFlightRef = useRef<Promise<boolean> | null>(null)
  const routeGuardInFlightRef = useRef(false)

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

  const isAccessTokenExpired = (accessToken: string | undefined) => {
    const exp = decodeJwtClaims(accessToken)?.exp as number | undefined
    if (!exp) return false
    return exp <= Math.floor(Date.now() / 1000) + 30
  }

  const clearClientSession = () => {
    try {
      window.localStorage.removeItem(getStorageKey())
    } catch {}
    setUser(null)
    setIsAdmin(false)
    setRole(null)
    setAdminResolved(true)
    setMustCompleteName(false)
  }

  const hasServerSession = async () => {
    try {
      const res = await withTimeout(
        fetch('/api/auth/me', { credentials: 'include' }),
        4000,
        'auth-me',
      )
      if (!res.ok) return false
      const json = await res.json().catch(() => null)
      return !!json?.user
    } catch {
      return false
    }
  }

  const syncLocalSessionToServer = async () => {
    const stored = getStoredSession()
    if (!stored?.access_token || !stored?.refresh_token) return false
    if (isAccessTokenExpired(stored.access_token)) return false
    try {
      const res = await withTimeout(
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            event: 'SIGNED_IN',
            session: {
              access_token: stored.access_token,
              refresh_token: stored.refresh_token,
            },
          }),
        }),
        4000,
        'sync-session',
      )
      return res.ok
    } catch {
      return false
    }
  }

  const ensureServerSession = async () => {
    if (await hasServerSession()) return true
    if (!hasLocalSession()) return false
    if (await syncLocalSessionToServer()) {
      return hasServerSession()
    }
    return false
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
    if (isAccessTokenExpired(stored.access_token)) {
      try {
        window.localStorage.removeItem(getStorageKey())
      } catch {}
      return null
    }

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
          setRole(null)
          setAdminResolved(true)
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
          setRole(null)
          setAdminResolved(true)
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
        const roleValue = normalizeUserRole((profile as any)?.role as string | undefined)
        setRole(roleValue)
        setIsAdmin(isAdminRole(roleValue))
        setAdminResolved(true)
      } catch {
        // Garder l'état admin précédent en cas de timeout / erreur réseau
        setAdminResolved(true)
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
          setRole(null)
          setAdminResolved(true)
          return false
        }
      }
    })().finally(() => {
      setAdminResolved(true)
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
        if (!hasLocalSession()) {
          await hydrateClientSessionFromServer()
        } else {
          await ensureServerSession()
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
          const ok = await ensureServerSession()
          if (ok) router.replace('/home')
          else clearClientSession()
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAdmin(false)
        setRole(null)
        setAdminResolved(true)
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
    Promise.all([checkIsAdmin(), getCurrentUserRole()]).then(([ok, nextRole]) => {
      if (!cancelled) {
        setIsAdmin(ok)
        setRole(nextRole)
        setAdminResolved(true)
      }
    })
    return () => { cancelled = true }
  }, [user, loading])

  useEffect(() => {
    if (loading) return
    if (routeGuardInFlightRef.current) return

    const runRouteGuard = async () => {
      routeGuardInFlightRef.current = true
      try {
        const isPublic =
          pathname === '/login' ||
          pathname === '/register' ||
          pathname?.startsWith('/reset-password')

        if (isPublic) {
          if (user && pathname !== '/reset-password') {
            const ok = await ensureServerSession()
            if (ok) router.replace('/home')
            else clearClientSession()
          }
          return
        }

        if (!user) {
          if (!hasLocalSession()) {
            await hydrateClientSessionFromServer()
          }
          const session = await getSessionFast()
          if (session) {
            await checkPseudo()
            return
          }
          router.replace('/login')
          return
        }

        const serverOk = await ensureServerSession()
        if (!serverOk) {
          clearClientSession()
          router.replace('/login')
          return
        }

        if (pathname === '/') {
          router.replace('/home')
        }
      } finally {
        routeGuardInFlightRef.current = false
      }
    }

    void runRouteGuard()
  }, [pathname, user, loading, router])

  const handleLogout = async () => {
    // Make logout immediate in the UI, then best-effort clear cookies + local session.
    setUser(null)
    setIsAdmin(false)
    setRole(null)
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

  const guidesActive = isGuidesPath(pathname)
  const academyActive = isAcademyPath(pathname)
  const vente2Active = isVente2Path(pathname)
  const strategieActive = isStrategiePath(pathname)
  const monEspaceActive = isMonEspacePath(pathname)
  const iaActive = isIaPath(pathname)
  const authAccessValue = useMemo(
    () => ({
      isAdmin,
      isClient: role === 'client',
      role,
      userName: user?.name?.trim()
        ? user.name.trim()
        : user?.email
          ? user.email.split('@')[0]
          : null,
      authReady: !loading && adminResolved,
      hasPermission: (permission: Parameters<typeof hasAppPermission>[1]) =>
        hasAppPermission(role, permission),
    }),
    [isAdmin, role, user, loading, adminResolved],
  )

  if (loading && !isPublicPath) {
    return (
      <AuthAccessContext.Provider value={authAccessValue}>
        <div className="min-h-screen flex items-center justify-center">Chargement...</div>
      </AuthAccessContext.Provider>
    )
  }

  return (
    <AuthAccessContext.Provider value={authAccessValue}>
    <div className="min-h-screen flex flex-col">
      {!isPublicPath && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center gap-3 px-4 mx-auto">
            <Link href="/home" className="flex shrink-0 items-center gap-2 font-semibold">
              <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
              <span className="hidden sm:inline">Link academy</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-sm shrink-0">
              <HeaderNavMenu
                label="Stratégie"
                active={strategieActive}
                items={withActiveItems(pathname, STRATEGIE_LINKS)}
              />
              <HeaderNavMenu
                label="Guides"
                active={guidesActive}
                items={withActiveItems(pathname, GUIDES_LINKS)}
              />
              <HeaderNavMenu
                label="Academy"
                active={academyActive}
                items={withActiveItems(pathname, ACADEMY_LINKS)}
              />

              {canShowVente2Nav(role, isAdmin) && (
                <HeaderNavMenu
                  label="Vente 2"
                  active={vente2Active}
                  items={withActiveItems(pathname, VENTE2_LINKS)}
                />
              )}
              {isAdmin && (
                <AdminNavTab href={IA_HREF} label="IA" active={iaActive} className="px-3 py-2" />
              )}
            </nav>

            <HeaderSearch
              isAdmin={isAdmin}
              role={role}
              className="hidden md:block min-w-0 flex-1 max-w-sm lg:max-w-xs xl:max-w-sm"
            />

            <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
              <HeaderSearch isAdmin={isAdmin} role={role} compact className="md:hidden" />
              <Suspense
                fallback={
                  <HeaderNavMenu
                    label="Mon espace"
                    active={monEspaceActive}
                    accent
                    align="end"
                    items={MON_ESPACE_LINKS}
                  />
                }
              >
                <MonEspaceHeaderNavMenu />
              </Suspense>
              <div className="lg:hidden">
                <MobileNav user={user} isAdmin={isAdmin} role={role} onLogout={handleLogout} />
              </div>
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogout}
                    className="h-9 w-9 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    aria-label="Se déconnecter"
                    title="Se déconnecter"
                  >
                    <DoorOpen className="h-4 w-4" aria-hidden />
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Link href="/login" aria-label="Se connecter" title="Se connecter">
                    <DoorOpen className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
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
    </AuthAccessContext.Provider>
  )
}
