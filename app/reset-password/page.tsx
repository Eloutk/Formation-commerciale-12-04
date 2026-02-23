"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/utils/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Vérifie le token dans l’URL et initialise la session
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (!accessToken || !refreshToken) {
      setError("Lien invalide ou expiré")
      setReady(true)
      return
    }

    ;(async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      if (error) {
        setError("Session invalide ou expirée. Rouvrez le lien depuis l'email.")
      }
      setReady(true)
      // Nettoie l’URL
      window.history.replaceState(null, "", "/reset-password")
    })()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Mot de passe mis à jour. Vous pouvez vous connecter.")
      setTimeout(() => router.push("/login"), 1500)
    }
    setLoading(false)
  }

  if (!ready) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/base-presentation.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <p className="relative z-10 text-white text-lg">Vérification du lien...</p>
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{ backgroundImage: "url('/images/base-presentation.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="relative z-10 w-full max-w-md">
        <form onSubmit={onSubmit} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 space-y-4">
          <h1 className="text-xl font-bold text-gray-900">Définir un nouveau mot de passe</h1>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
            minLength={8}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white p-2 rounded-md disabled:opacity-50 font-medium hover:bg-orange-700 transition-colors"
          >
            {loading ? "Mise à jour..." : "Valider"}
          </button>
          {message && <p className="text-green-700 font-medium">{message}</p>}
        </form>
      </div>
    </div>
  )
}
