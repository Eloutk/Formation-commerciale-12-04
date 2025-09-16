"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import supabase from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState("") // 👈 pour afficher un message après demande de reset
  const router = useRouter()
  const search = useSearchParams()

  // Si le lien de reset envoie vers /login#... (type=recovery), rediriger vers /reset-password
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.substring(1)
    if (!hash) return
    const params = new URLSearchParams(hash)
    const hasToken = params.get('access_token') || params.get('code')
    const type = params.get('type')
    const errorCode = params.get('error_code')
    const errorDesc = params.get('error_description')
    if (hasToken && type === 'recovery') {
      router.replace(`/reset-password#${hash}`)
      return
    }
    // Gérer les liens expirés/invalides renvoyés par Supabase
    if (params.get('error')) {
      const message = errorDesc ? decodeURIComponent(errorDesc) : 'Lien invalide ou expiré'
      setError(message)
      // Nettoyer le hash pour éviter de re-déclencher au refresh
      window.history.replaceState(null, '', '/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError("Email ou mot de passe incorrect")
        setLoading(false)
        return
      }
      // Synchroniser la session côté serveur
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ event: 'SIGNED_IN', session: data.session }),
        })
      } catch {}
      const redirectTo = search?.get('redirect') || '/'
      router.push(redirectTo)
    } catch {
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  // 👇 Nouveau handler pour reset password
  const handlePasswordReset = async () => {
    setError("")
    setResetMsg("")
    if (!email) {
      setError("Veuillez entrer votre email avant de réinitialiser le mot de passe")
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://link-academy.vercel.app/reset-password", // 👈 redirection vers ta page dédiée
    })
    if (error) setError(error.message)
    else setResetMsg("Un email de réinitialisation a été envoyé si l'adresse est valide.")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-muted-foreground mt-2">Connectez-vous pour accéder à votre formation</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}
      {resetMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{resetMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" required disabled={loading} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50">{loading ? "Connexion..." : "Se connecter"}</button>
      </form>

      {/* 👇 Lien mot de passe oublié */}
      <div className="text-center mt-4">
        <button
          onClick={handlePasswordReset}
          className="text-sm text-orange-600 hover:underline"
          disabled={loading}
        >
          Mot de passe oublié ?
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-orange-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
