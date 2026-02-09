import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Échanger le code pour une session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Rediriger vers la page d'accueil après confirmation
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
