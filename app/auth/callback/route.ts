import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const type = requestUrl.searchParams.get('type')
  const isRecovery = type === 'recovery' || next.startsWith('/reset-password')

  // Recovery: laisser le client échanger le code pour que la session soit dans localStorage
  if (code && isRecovery) {
    const dest = new URL('/reset-password', requestUrl.origin)
    dest.searchParams.set('code', code)
    return NextResponse.redirect(dest)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code)
  }

  const destPath = next.startsWith('/') ? next : '/'
  return NextResponse.redirect(new URL(destPath, requestUrl.origin))
}
