import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )
  
  const body = await req.json().catch(() => ({}))
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Aligne les noms de champs avec le tracker client { path, ua, referer }
  const { path, ua, referer } = body || {}
  await supabase
    .from('page_views')
    .insert({ user_id: session.user.id, path, user_agent: ua, referrer: referer })
  return NextResponse.json({ ok: true })
}

