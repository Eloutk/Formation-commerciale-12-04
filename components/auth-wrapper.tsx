"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

interface User {
  id: string
  name: string
  email: string
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const u = session.user
          setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || '', email: u.email || '' })
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
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      // Sync server cookies (fire-and-forget)
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
        })
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      // Inform server first
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'SIGNED_OUT' }),
      })
    } catch {}
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
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

      {user && (
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            © {new Date().getFullYear()} Formation Commerciale Link Academy<br />
            Tous droits réservés à l'agence Link
          </div>
        </footer>
      )}
    </div>
  )
} 