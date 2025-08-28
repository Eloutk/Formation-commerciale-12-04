"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface User {
  id: string
  name: string
  email: string
}

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session au démarrage
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Erreur lors de la vérification de session:", error)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          const u = session.user
          setUser({ 
            id: u.id, 
            name: u.user_metadata?.full_name || '', 
            email: u.email || '' 
          })
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id)
        
        if (event === "SIGNED_IN" && session?.user) {
          const u = session.user
          setUser({ 
            id: u.id, 
            name: u.user_metadata?.full_name || '', 
            email: u.email || '' 
          })
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            Link academy
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Bonjour, {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Se déconnecter
                </button>
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