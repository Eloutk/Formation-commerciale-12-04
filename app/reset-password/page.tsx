"use client";

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import supabase from '@/utils/supabase/client'

export default function ResetPasswordPage(): JSX.Element {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qpCode = searchParams?.get('code') || ''
  const qpAccess = searchParams?.get('access_token') || ''
  const [code, setCode] = useState(qpCode)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // 1) Échanger le code/access_token pour obtenir une session
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Support hash fragments (#code=... or #access_token=...)
        if (typeof window !== 'undefined') {
          const hash = window.location.hash?.replace(/^#/, '')
          if (hash) {
            const hp = new URLSearchParams(hash)
            const hashCode = hp.get('code')
            if (hashCode && !code) setCode(hashCode)
          }
        }

        const codeOrToken = code || qpAccess
        if (!codeOrToken) throw new Error('Lien invalide ou expiré.')
        const { error } = await supabase.auth.exchangeCodeForSession(codeOrToken)
        if (error) throw error
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
  }, [qpCode, qpAccess])

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
    else {
      setMessage('Mot de passe mis à jour. Vous pouvez vous connecter.')
      setTimeout(() => router.push('/login'), 1500)
    }
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

