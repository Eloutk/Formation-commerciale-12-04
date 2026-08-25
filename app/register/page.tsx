"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from "lucide-react"
import { markSessionStarted } from '@/lib/auth-session-ttl'
import { LINK_FR_SUFFIX, normalizeAuthEmail, suggestLinkFrEmail } from '@/lib/auth-email'

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
      message: "Seuls les emails @link.fr sont acceptés",
    }
  }

  return { isValid: true, message: "" }
}

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const emailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    const normalized = normalizeAuthEmail(newEmail)
    if (normalized && normalized !== LINK_FR_SUFFIX) {
      const validation = validateEmail(normalized)
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

    const emailFromDom = emailInputRef.current?.value ?? email
    const normalizedEmail = normalizeAuthEmail(emailFromDom)
    setEmail(normalizedEmail)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    const emailValidation = validateEmail(normalizedEmail)
    if (!emailValidation.isValid) {
      setError(emailValidation.message)
      setEmailError(emailValidation.message)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: normalizedEmail, password, name }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof payload?.error === 'string' ? payload.error : 'Une erreur est survenue lors de la création du compte')
        setLoading(false)
        return
      }
      if (payload?.session?.access_token && payload?.session?.refresh_token) {
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
              event: 'SIGNED_IN',
              session: payload.session,
            }),
          })
        } catch {}
        markSessionStarted()
      }
      setSuccess("Compte créé avec succès ! Redirection...")
      router.push('/academy/diffusion')
    } catch {
      setError("Une erreur est survenue lors de la création du compte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-muted-foreground mt-2">Inscrivez-vous pour accéder à l&apos;intranet</p>
        <p className="text-xs text-gray-500 mt-1">
          Seuls les emails @link.fr sont acceptés
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
        <div>
          <label className="block text-sm font-medium mb-2">Prénom/surnom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prénom ou surnom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={(e) => {
              const suggested = suggestLinkFrEmail(e.target.value)
              setEmail(suggested)
              const normalized = normalizeAuthEmail(suggested)
              if (normalized && normalized !== LINK_FR_SUFFIX) {
                setEmailError(validateEmail(normalized).message)
              } else {
                setEmailError("")
              }
            }}
            placeholder="prenom.nom@link.fr"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              emailError ? 'border-red-400' : 'border-gray-300'
            }`}
            required
            disabled={loading}
            autoComplete="username"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            Astuce : saisissez votre prénom.nom — @link.fr est ajouté automatiquement.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              disabled={loading}
            >
              {showPassword ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
              title={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
              disabled={loading}
            >
              {showConfirmPassword ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
            </button>
          </div>
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
        <p className="text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-orange-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
