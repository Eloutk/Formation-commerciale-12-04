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
  const [resetLoading, setResetLoading] = useState(false)
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
    if (hasToken && (type === 'recovery' || !type)) {
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
      console.log('🔐 Tentative de connexion...')
      console.log('📧 Email:', email)
      console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      // Auth via endpoint serveur (contourne les blocages navigateur/extensions)
      const authRes = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const authJson = await authRes.json().catch(() => null)
      if (!authRes.ok) {
        console.error('❌ Erreur auth API:', authJson)
        setError(authJson?.error || "Email ou mot de passe incorrect")
        return
      }

      const access_token = authJson?.session?.access_token as string | undefined
      const refresh_token = authJson?.session?.refresh_token as string | undefined
      const expires_in = authJson?.session?.expires_in as number | undefined
      const token_type = authJson?.session?.token_type as string | undefined
      const user = authJson?.session?.user
      if (!access_token || !refresh_token) {
        console.error('❌ Session incomplète:', authJson)
        setError("Erreur de session (tokens manquants)")
        return
      }

      console.log('🧩 Tokens reçus, écriture localStorage...')

      // ✅ Chemin le plus robuste: écrire directement la session dans le storage attendu par supabase-js
      // (et éviter supabase.auth.setSession qui bloque chez toi)
      try {
        const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL as string).hostname.split('.')[0]
        const storageKey = `sb-${ref}-auth-token`
        const now = Math.floor(Date.now() / 1000)
        const expires_at = expires_in ? now + expires_in : now + 3600
        const payload = {
          access_token,
          refresh_token,
          token_type: token_type || 'bearer',
          expires_in: expires_in || 3600,
          expires_at,
          user: user || null,
        }
        window.localStorage.setItem(storageKey, JSON.stringify(payload))
        console.log('✅ localStorage écrit:', storageKey)
      } catch (e) {
        console.error('❌ Impossible d’écrire localStorage:', e)
        setError("Impossible d'initialiser la session (storage)")
        return
      }

      console.log('✅ Connexion réussie! (storage)')
      
      // Synchroniser la session côté serveur
      try {
        const syncRes = await Promise.race([
          fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          body: JSON.stringify({
            event: 'SIGNED_IN',
            session: { access_token, refresh_token },
          }),
          }),
          new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout sync cookies (8s)')), 8000)),
        ])

        const syncJson = await syncRes.json().catch(() => null)
        if (!syncRes.ok || !syncJson?.ok) {
          console.error('❌ Sync cookies échouée:', syncJson)
          setError("Connexion OK mais cookies non synchronisés (accès sécurisé impossible). Réessaie.")
          return
        }

        console.log('✅ Cookies session synchronisés')
      } catch (syncError) {
        console.error('❌ Erreur sync cookies:', syncError)
        setError("Connexion OK mais cookies non synchronisés (accès sécurisé impossible). Réessaie.")
        return
      }
      
      const requested = search?.get('redirect') || ''
      const redirectTo = (!requested || requested === '/' || requested === '/login') ? '/home' : requested
      console.log('🔄 Redirection vers:', redirectTo)
      
      // Forcer un reload complet pour que le middleware (cookies) s'applique bien
      window.location.assign(redirectTo)
      console.log('✅ Redirect assign appelé')
    } catch (err) {
      console.error('💥 Erreur globale:', err)
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      console.log('🏁 Finally appelé, setLoading(false)')
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
    setResetLoading(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://link-academy.vercel.app'
      const redirectTo = `${origin}/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) setError(error.message)
      else setResetMsg("Un email de réinitialisation a été envoyé si l'adresse est valide.")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-muted-foreground mt-2">Exclusivement réservé aux membres de l'agence Link</p>
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
          disabled={loading || resetLoading}
        >
          {resetLoading ? "Envoi..." : "Mot de passe oublié ?"}
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
