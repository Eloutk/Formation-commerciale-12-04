"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

interface User {
  id: string
  name: string
  email: string
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
      return false
    }
    const metaName = (u.user_metadata as any)?.full_name as string | undefined
    // lire dans profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', u.id)
      .maybeSingle()
    const profileName = profile?.full_name as string | undefined
    const currentName = (metaName || profileName || '').trim()
    setUser({ id: u.id, name: currentName, email: u.email || '' })
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
        // Fast path for auth pages to avoid any blocking fetch
        if (pathname === '/login' || pathname === '/register') {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            await checkPseudo()
          } else {
            setUser(null)
          }
          return
        }

        const need = await checkPseudo()
        if (need) {
          // keep on modal
        } else {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user && pathname !== '/login' && pathname !== '/register') {
            router.replace('/login')
          }
        }
      } finally {
        setLoading(false)
      }
    }
    // Fail-safe timeout in case of unexpected hangs
    const timeout = setTimeout(() => setLoading(false), 2000)
    init().finally(() => clearTimeout(timeout))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await checkPseudo()
        if (pathname === '/login' || pathname === '/register') {
          router.replace('/formation')
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
      // update profiles and auth metadata
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
      {!(pathname === '/login' || pathname === '/register') && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
            <Link href="/formation" className="flex items-center gap-2 font-semibold">
              <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
              Link academy
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/formation" className="hover:underline">Formation</Link>
              <Link href="/pdv" className="hover:underline">PDV</Link>
              <Link href="/documents" className="hover:underline">Documents</Link>
              <Link href="/glossaire" className="hover:underline">Glossaire</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <MobileNav />
              </div>
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-600">Bonjour, {user.name || user.email}</span>
                  <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Se déconnecter</button>
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