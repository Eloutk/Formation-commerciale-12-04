import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies }) as any
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

