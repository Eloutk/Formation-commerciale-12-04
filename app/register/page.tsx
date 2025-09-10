"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
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

// Fonction de validation d'email pour @link.fr uniquement
const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Format d'email invalide" }
  }
  
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (!domain) {
    return { isValid: false, message: "Domaine d'email invalide" }
  }
  
  if (domain !== 'link.fr') {
    return { 
      isValid: false, 
      message: "Seuls les emails @link.fr sont acceptés" 
    }
  }
  
  return { isValid: true, message: "" }
}

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    if (newEmail) {
      const validation = validateEmail(newEmail)
      setEmailError(validation.message)
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    // Validation de l'email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.message)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.includes('already registered')) setError("Un compte avec cet email existe déjà")
        else setError("Une erreur est survenue lors de la création du compte")
        setLoading(false)
        return
      }
      // Mettre à jour le nom en asynchrone (non bloquant)
      await supabase.auth.updateUser({ data: { full_name: name } })
      // Synchroniser la session côté serveur si sign-in implicite
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ event: 'SIGNED_IN', session: data.session }),
        })
      } catch {}
      setSuccess("Compte créé avec succès ! Redirection...")
      router.push('/formation')
    } catch (error) {
      setError("Une erreur est survenue lors de la création du compte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-muted-foreground mt-2">Inscrivez-vous pour accéder à la formation</p>
        <p className="text-xs text-gray-500 mt-1">
          Seuls les emails @link.fr sont acceptés
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nom</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            placeholder="exemple@link.fr" 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              emailError ? 'border-red-400' : 'border-gray-300'
            }`} 
            required 
            disabled={loading} 
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" required disabled={loading} />
        </div>
        <button 
          type="submit" 
          disabled={loading || !!emailError} 
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Création du compte..." : "Créer un compte"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">Déjà un compte ?{" "}<Link href="/login" className="text-orange-600 hover:underline">Se connecter</Link></p>
      </div>
    </div>
  )
}

