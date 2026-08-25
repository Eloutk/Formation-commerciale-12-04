"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import supabase from "@/utils/supabase/client"

function recoveryErrorToFrench(raw: unknown) {
  const msg = typeof raw === "string" ? raw : ""
  const normalized = msg.toLowerCase()
  if (normalized.includes("auth session missing") || normalized.includes("session missing")) {
    return "Le lien de réinitialisation est invalide ou a expiré. Demandez un nouvel email depuis la page de connexion."
  }
  if (normalized.includes("expired") || normalized.includes("invalid")) {
    return "Lien invalide ou expiré. Demandez un nouvel email depuis la page de connexion."
  }
  return msg || "Impossible de mettre à jour le mot de passe."
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [canUpdate, setCanUpdate] = useState(false)

  useEffect(() => {
    let cancelled = false

    const finish = (err: string | null, ok: boolean) => {
      if (cancelled) return
      setCanUpdate(ok)
      setError(err)
      setReady(true)
      const url = new URL(window.location.href)
      if (url.hash || url.searchParams.has("code")) {
        window.history.replaceState(null, "", "/reset-password")
      }
    }

    const establish = async () => {
      const {
        data: { session: existing },
      } = await supabase.auth.getSession()
      if (existing) {
        finish(null, true)
        return
      }

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
      const queryParams = new URLSearchParams(window.location.search)
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")
      const code = queryParams.get("code") || hashParams.get("code")

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (!exchangeError) {
          finish(null, true)
          return
        }
        const {
          data: { session: afterExchange },
        } = await supabase.auth.getSession()
        if (afterExchange) {
          finish(null, true)
          return
        }
        finish(
          "Lien invalide ou expiré. Demandez un nouvel email depuis la page de connexion.",
          false,
        )
        return
      }

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (sessionError) {
          finish("Session invalide ou expirée. Rouvrez le lien depuis l'email.", false)
          return
        }
        finish(null, true)
        return
      }

      finish(
        "Lien invalide ou expiré. Demandez un nouvel email depuis la page de connexion.",
        false,
      )
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setCanUpdate(true)
        setError(null)
        setReady(true)
      }
    })

    void establish()
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!canUpdate) {
      setError("Lien invalide ou expiré. Demandez un nouvel email depuis la page de connexion.")
      return
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(recoveryErrorToFrench(updateError.message))
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
            disabled={!canUpdate || loading}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
            minLength={8}
            required
            disabled={!canUpdate || loading}
          />
          <button
            type="submit"
            disabled={loading || !canUpdate}
            className="w-full bg-orange-600 text-white p-2 rounded-md disabled:opacity-50 font-medium hover:bg-orange-700 transition-colors"
          >
            {loading ? "Mise à jour..." : "Valider"}
          </button>
          {message && <p className="text-green-700 font-medium">{message}</p>}
          {!canUpdate && (
            <p className="text-sm text-gray-600 text-center">
              <Link href="/login" className="text-orange-600 underline underline-offset-2">
                Retour à la connexion
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
