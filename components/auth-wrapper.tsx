"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'

// ✅ On utilise uniquement le client Supabase centralisé
import supabase from "@/utils/supabase/client"

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

  const checkPseudo = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const u = session?.user
    if (!u) {
      setUser(null)
      setIsAdmin(false)
      return false
    }
    const metaName = (u.user_metadata as any)?.full_name as string | undefined
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', u.id)
      .maybeSingle()
    const profileName = profile?.full_name as string | undefined
    const currentName = (metaName || profileName || '').trim()
    setUser({ id: u.id, name: currentName, email: u.email || '' })
    const role = (profile as any)?.role as string | undefined
    setIsAdmin(role === 'admin' || role === 'super_admin')
    if (!currentName) {
      setNickname((u.email || '').split('@')[0] || '')
      setMustCompleteName(true)
      return true
    }
    setMustCompleteName(false)
    return false
  }

  useEffect(() => {
    const init = async () => {
      try {
        // Si le serveur (middleware) te considère connecté mais que le navigateur a perdu la session (localStorage vidé),
        // on force une déconnexion serveur pour éviter le cas "je ne suis pas connecté mais /login redirige vers /home".
        const { data: { session: clientSession } } = await supabase.auth.getSession()
        if (!clientSession?.user) {
          try {
            const meRes = await fetch('/api/auth/me', { credentials: 'include' })
            const meJson = await meRes.json().catch(() => null)
            if (meRes.ok && meJson?.user?.id) {
              await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ event: 'SIGNED_OUT' }),
              })
            }
          } catch {}
        }

        // ⚡ Pages publiques : login, register, reset-password
        if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            // Si déjà connecté et on arrive sur une page publique, on renvoie vers /home
            await checkPseudo()
            router.replace('/home')
          } else {
            setUser(null)
          }
          return
        }

        const need = await checkPseudo()
        const { data: { session } } = await supabase.auth.getSession()

        // Si pas connecté et page privée -> forcer /login
        if (
          !session?.user &&
          pathname !== '/login' &&
          pathname !== '/register' &&
          pathname !== '/reset-password'
        ) {
          router.replace('/login')
          return
        }

        // Si connecté et sur la racine / -> aller sur /home
        if (session?.user && pathname === '/') {
          router.replace('/home')
          return
        }

        // Si on a besoin de compléter le pseudo, le dialog s'affiche déjà via mustCompleteName
        if (!need && session?.user) {
          setUser((prev) => prev || { id: session.user.id, name: '', email: session.user.email || '' })
        }
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(() => setLoading(false), 2000)
    init().finally(() => clearTimeout(timeout))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await checkPseudo()
        if (pathname === '/login' || pathname === '/register') {
          router.replace('/home')
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setMustCompleteName(false)
        router.replace('/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      // Déconnexion serveur (cookies middleware)
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ event: 'SIGNED_OUT' }),
        })
      } catch {}
      await supabase.auth.signOut()
    } catch {}
  }

  const saveNickname = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = nickname.trim()
    if (!name) return
    setSavingName(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user
      if (!u) return
      await supabase.from('profiles').upsert({ id: u.id, full_name: name }, { onConflict: 'id' })
      await supabase.auth.updateUser({ data: { full_name: name } })
      setUser({ id: u.id, name, email: u.email || '' })
      setMustCompleteName(false)
    } finally {
      setSavingName(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!(pathname === '/login' || pathname === '/register' || pathname === '/reset-password') && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
              <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
              Link academy
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/home" className="hover:underline">Home</Link>
              <Link href="/diffusion" className="hover:underline">Diffusion</Link>
              <Link href="/chefferie" className="hover:underline">Chefferie de projet</Link>
              <Link href="/studio" className="hover:underline">Studio</Link>
              <Link href="/pdv" className="hover:underline">PDV</Link>
              <Link href="/documents" className="hover:underline">Document</Link>
              <Link href="/glossaire" className="hover:underline">Glossaire</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
              {isAdmin && (
                <Link href="/admin" className="hover:underline text-orange-600">Admin</Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <MobileNav />
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
            <DialogTitle>Choisissez votre pseudo</DialogTitle>
            <DialogDescription>
              Nous devons te redemander ton pseudo.
              Choisis-le bien : comme la photo de ton permis, il va te suivre toute ta vie 🙂
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveNickname} className="space-y-4">
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Votre pseudo" />
            <DialogFooter>
              <Button type="submit" disabled={savingName}>{savingName ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
