"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulation d'un appel d'API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name: "Utilisateur Test",
      email,
    })
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // Simulation d'un appel d'API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name,
      email,
    })
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

