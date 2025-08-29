"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
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
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          setLoading(false)
          return
        }
        if (session?.user) {
          const u = session.user
          const userData = { 
            id: u.id, 
            name: (u.user_metadata as any)?.full_name || '', 
            email: u.email || '' 
          }
          setUser(userData)
        }
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user
        setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || '', email: u.email || '' })
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <Image src="/Logo Link Vertical (Orange).png" alt="Logo Link Academy" width={32} height={32} className="object-contain h-8 w-auto" />
            Link academy
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-gray-500">Chargement...</div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">Bonjour, {user.name || user.email}</span>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Se déconnecter</button>
              </>
            ) : (
              <a href="/login" className="text-sm">Connexion</a>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © {new Date().getFullYear()} Formation Commerciale Link Academy<br />
          Tous droits réservés à l'agence Link
        </div>
      </footer>
    </div>
  )
} 