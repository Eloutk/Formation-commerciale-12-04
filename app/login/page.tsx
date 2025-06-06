"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: 'Inscription réussie',
        description: 'Vérifiez votre email pour confirmer votre compte',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur d\'inscription',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleSignUp}
              className="w-full"
            >
              {isLoading ? 'Inscription en cours...' : 'Créer un compte'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

