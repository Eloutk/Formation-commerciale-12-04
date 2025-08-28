"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

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
        console.log("🔍 AuthWrapper - Vérification de la session...")
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("❌ Erreur lors de la vérification de session:", error)
          setLoading(false)
          return
        }
        
        console.log("📋 AuthWrapper - Session trouvée:", session?.user?.id)
        console.log("📋 AuthWrapper - Cookies disponibles:", document.cookie ? "Oui" : "Non")
        
        if (session?.user) {
          const u = session.user
          const userData = { 
            id: u.id, 
            name: u.user_metadata?.full_name || '', 
            email: u.email || '' 
          }
          console.log("👤 AuthWrapper - Utilisateur connecté:", userData)
          setUser(userData)
        } else {
          console.log("❌ AuthWrapper - Aucun utilisateur connecté")
        }
      } catch (error) {
        console.error("❌ Erreur lors de la vérification de session:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 AuthWrapper - Auth state change:", event, session?.user?.id)
        
        if (event === "SIGNED_IN" && session?.user) {
          const u = session.user
          const userData = { 
            id: u.id, 
            name: u.user_metadata?.full_name || '', 
            email: u.email || '' 
          }
          console.log("✅ AuthWrapper - Utilisateur connecté:", userData)
          setUser(userData)
        } else if (event === "SIGNED_OUT") {
          console.log("🚪 AuthWrapper - Utilisateur déconnecté")
          setUser(null)
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    console.log("🚪 AuthWrapper - Déconnexion en cours...")
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <Image
              src="/Logo Link Vertical (Orange).png"
              alt="Logo Link Academy"
              width={32}
              height={32}
              className="object-contain h-8 w-auto"
            />
            Link academy
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-gray-500">Chargement...</div>
            ) : user ? (
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
      
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © {new Date().getFullYear()} Formation Commerciale Link Academy<br />
          Tous droits réservés à l'agence Link
        </div>
      </footer>
    </div>
  )
} 