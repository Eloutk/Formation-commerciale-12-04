import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ProxyBody = {
  url?: string
  method?: string
  headers?: Record<string, string>
  body?: string | null
}

function isAllowedAuthUrl(url: string, supabaseUrl: string) {
  return url.startsWith(`${supabaseUrl}/auth/v1/`)
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

    const body = (await req.json().catch(() => ({}))) as ProxyBody
    const url = typeof body.url === 'string' ? body.url : ''
    const method = (typeof body.method === 'string' ? body.method : 'GET').toUpperCase()
    const headers = (body.headers && typeof body.headers === 'object' ? body.headers : {}) as Record<string, string>
    const requestBody = typeof body.body === 'string' ? body.body : null

    if (!url || !isAllowedAuthUrl(url, supabaseUrl)) {
      return NextResponse.json({ error: 'URL not allowed' }, { status: 400 })
    }

    // Only allow common auth methods
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const upstreamHeaders: Record<string, string> = {
      ...headers,
      apikey: anonKey,
    }

    // Ensure we always send an Authorization header to Supabase
    if (!upstreamHeaders.Authorization && !upstreamHeaders.authorization) {
      upstreamHeaders.Authorization = `Bearer ${anonKey}`
    }

    const upstreamRes = await fetch(url, {
      method,
      headers: upstreamHeaders,
      body: requestBody,
    })

    const resBody = await upstreamRes.arrayBuffer()
    const contentType = upstreamRes.headers.get('content-type') || 'application/json'

    return new Response(resBody, {
      status: upstreamRes.status,
      headers: {
        'content-type': contentType,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Proxy error' }, { status: 500 })
  }
}

