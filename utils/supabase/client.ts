"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function shouldProxyAuth(url: string) {
  return url.startsWith(`${supabaseUrl}/auth/v1/`)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    // Proxy Supabase Auth requests through our own domain to avoid browser blockers/timeouts.
    // This keeps REST requests direct, but routes /auth/v1/* through /api/supabase-auth-proxy.
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url

      if (!shouldProxyAuth(url)) {
        return fetch(input as any, init)
      }

      const method = (init?.method || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET')) ?? 'GET'
      const headersObj: Record<string, string> = {}
      const headers = new Headers(init?.headers || (typeof input !== 'string' && !(input instanceof URL) ? input.headers : undefined))
      headers.forEach((value, key) => {
        headersObj[key] = value
      })

      let body: string | null = null
      const rawBody = init?.body
      if (typeof rawBody === 'string') body = rawBody

      const proxyRes = await fetch('/api/supabase-auth-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, headers: headersObj, body }),
      })

      return proxyRes
    },
  },
  auth: {
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase
