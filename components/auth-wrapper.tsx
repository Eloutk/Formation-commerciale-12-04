"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

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
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const u = session.user
          setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || '', email: u.email || '' })
        } else {
          setUser(null)
          if (pathname !== '/login' && pathname !== '/register') {
            router.replace('/login')
          }
        }
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user
        setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || '', email: u.email || '' })
        if (pathname === '/login' || pathname === '/register') {
          router.replace('/formation')
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {user && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
              Link academy
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline">Formation</Link>
              <Link href="/pdv" className="hover:underline">PDV</Link>
              <Link href="/documents" className="hover:underline">Documents</Link>
              <Link href="/glossaire" className="hover:underline">Glossaire</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600">Bonjour, {user.name || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Se déconnecter</button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
} 