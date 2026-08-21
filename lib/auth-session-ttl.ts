/** Durée max d’une session avant reconnexion obligatoire (30 jours). */
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export const SESSION_STARTED_AT_KEY = 'link_session_started_at'

export function markSessionStarted(now = Date.now()) {
  try {
    window.localStorage.setItem(SESSION_STARTED_AT_KEY, String(now))
  } catch {
    // ignore
  }
}

export function clearSessionStartedMarker() {
  try {
    window.localStorage.removeItem(SESSION_STARTED_AT_KEY)
  } catch {
    // ignore
  }
}

export function readStoredSessionStartedAt(): number | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STARTED_AT_KEY)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

/**
 * True si la session dépasse 30 jours depuis la dernière connexion réelle
 * (last_sign_in_at Supabase) ou le marqueur local posé à la connexion.
 */
export function isSessionPastMaxAge(options: {
  lastSignInAt?: string | null
  startedAtMs?: number | null
  now?: number
}): boolean {
  const now = options.now ?? Date.now()
  const candidates: number[] = []

  if (options.lastSignInAt) {
    const t = new Date(options.lastSignInAt).getTime()
    if (!Number.isNaN(t)) candidates.push(t)
  }
  if (options.startedAtMs != null && Number.isFinite(options.startedAtMs)) {
    candidates.push(options.startedAtMs)
  }

  if (candidates.length === 0) return false

  const started = Math.max(...candidates)
  return now - started > SESSION_MAX_AGE_MS
}
