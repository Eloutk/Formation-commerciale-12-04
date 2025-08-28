"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from '@supabase/supabase-js'

// Créer le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Vérifier la session au démarrage
  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Variables d'environnement Supabase manquantes")
      return
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Erreur lors de la vérification de session:", error)
          return
        }

        if (session?.user) {
          const u = session.user
          setUser({
            id: u.id,
            name: u.user_metadata?.full_name || "",
            email: u.email || ""
          })
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error)
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
            name: u.user_metadata?.full_name || "",
            email: u.email || ""
          })
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const sessionUser = data.user
      setUser(sessionUser ? { id: sessionUser.id, name: sessionUser.user_metadata?.full_name || "", email: sessionUser.email || email } : null)
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
      router.push("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 🚀 Fonction register corrigée
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Tentative d'inscription avec:", { email, name })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }  // metadata pour stocker le nom
        }
      })

      if (error) {
        console.error("Erreur Supabase:", error)
        throw error
      }

      console.log("Réponse Supabase:", data)

      if (data.user) {
        setUser({ id: data.user.id, name, email: data.user.email || email })
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        })
        router.push("/")
      } else {
        throw new Error("Aucun utilisateur retourné")
      }
    } catch (error: any) {
      console.error("Erreur complète:", error)
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    })
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
