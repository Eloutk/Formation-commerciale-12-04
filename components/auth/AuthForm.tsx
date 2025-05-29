"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { login, register, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(email, password)
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        })
      } else {
        await register(name, email, password)
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        })
      }
      router.push("/")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLogin ? "Se connecter" : "S'inscrire"}
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-muted-foreground hover:underline"
        >
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </form>
  )
} 