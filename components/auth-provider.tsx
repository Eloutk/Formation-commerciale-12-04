"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
// Supabase removed: fallback to local mock auth for now

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

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      setUser({ id: 'local', name: 'Utilisateur', email })
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
      router.push('/')
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

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      setUser({ id: 'local', name, email })
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    })
    router.push('/login')
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

