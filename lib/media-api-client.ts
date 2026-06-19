'use client'

import supabase from '@/utils/supabase/client'

function getStorageKey() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!raw) return 'sb-local-auth-token'
  try {
    const ref = new URL(raw).hostname.split('.')[0] || 'local'
    return `sb-${ref}-auth-token`
  } catch {
    return 'sb-local-auth-token'
  }
}

function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(getStorageKey())
    if (!raw) return null
    const stored = JSON.parse(raw) as { access_token?: string }
    return stored.access_token?.trim() || null
  } catch {
    return null
  }
}

export async function getMediaAuthHeaders(): Promise<Record<string, string>> {
  // Préférer localStorage : getSession() peut bloquer via le proxy auth Supabase.
  const storedToken = getStoredAccessToken()
  if (storedToken) {
    return { Authorization: `Bearer ${storedToken}` }
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` }
    }
  } catch {
    // ignore
  }

  return {}
}

export async function mediaFetch(input: string, init?: RequestInit) {
  const authHeaders = await getMediaAuthHeaders()
  const headers = new Headers(init?.headers)
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value)
  })
  return fetch(input, { ...init, headers, credentials: 'include' })
}
