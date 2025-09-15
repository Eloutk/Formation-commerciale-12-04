"use client";

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage(): JSX.Element {
  const searchParams = useSearchParams()
  // Supabase envoie souvent les tokens dans le hash URL (#access_token=...)
  const qpAccess = searchParams?.get('access_token') || ''
  const qpRefresh = searchParams?.get('refresh_token') || ''
  const [accessToken, setAccessToken] = useState(qpAccess)
  const [refreshToken, setRefreshToken] = useState(qpRefresh)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Ensure we have a valid session from the recovery link
  useEffect(() => {
    // Si pas de token en query, tenter depuis le hash (#access_token=...)
    if (!qpAccess && typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '')
      const hashParams = new URLSearchParams(hash)
      const at = hashParams.get('access_token') || ''
      const rt = hashParams.get('refresh_token') || ''
      if (at) setAccessToken(at)
      if (rt) setRefreshToken(rt)
    }
    let mounted = true
    ;(async () => {
      try {
        if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
        }
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setReady(!!data.session)
      } catch (e: any) {
        if (!mounted) return
        setReady(false)
        setError(e?.message || 'Lien invalide ou expiré.')
      }
    })()
    return () => {
      mounted = false
    }
  }, [qpAccess, accessToken, refreshToken])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else setMessage('Mot de passe mis à jour. Vous pouvez vous connecter.')
  }

  if (!ready) {
    return (
      <div className="min-h-[50vh] w-full flex items-center justify-center px-4">
        <p className="text-center text-sm text-muted-foreground">
          {error || 'Vérification du lien de réinitialisation...'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-semibold text-center">Définir un nouveau mot de passe</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Nouveau mot de passe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Confirmer le mot de passe"
          />
        </div>
        <button disabled={loading} className="w-full rounded p-2 border bg-orange-600 text-white disabled:opacity-50">
          {loading ? 'Mise à jour...' : 'Valider'}
        </button>
        {message && <p className="text-green-700 text-sm text-center">{message}</p>}
        {error && <p className="text-red-700 text-sm text-center">{error}</p>}
      </form>
    </div>
  )
}

