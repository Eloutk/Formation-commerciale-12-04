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

  useEffect(() => {
    let mounted = true

    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const code = params.get("code")
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (!code && !accessToken) {
      setError("Lien invalide ou expiré")
      return
    }

    ;(async () => {
      let err: any | null = null
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        err = error
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        err = error
        // Force a session read to ensure propagation
        await supabase.auth.getSession().catch(() => {})
      }

      if (!mounted) return
      if (err) setError("Lien invalide ou expiré")
      setReady(true)
    })()

    // Safety timeout if something hangs
    const t = setTimeout(() => {
      if (!ready && !error) setError("Lien invalide ou expiré")
    }, 8000)

    return () => {
      mounted = false
      clearTimeout(t)
    }
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
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage("Mot de passe mis à jour. Vous pouvez vous connecter.")
      setTimeout(() => router.push("/login"), 1500)
    }
  }

  if (!ready) {
    return <p className="text-center mt-10">{error || "Vérification du lien..."}</p>
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Définir un nouveau mot de passe</h1>

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        minLength={8}
        required
      />

      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full border p-2 rounded"
        minLength={8}
        required
      />

      <button
        disabled={loading}
        className="w-full bg-orange-600 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Mise à jour..." : "Valider"}
      </button>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
