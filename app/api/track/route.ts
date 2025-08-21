import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies }) as any
  const body = await req.json().catch(() => ({}))
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { path, userAgent, referrer } = body || {}
  await supabase.from('page_views').insert({ user_id: session.user.id, path, user_agent: userAgent, referrer })
  return NextResponse.json({ ok: true })
}

