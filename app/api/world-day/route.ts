import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 1. Vérifier que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ show: false }, { status: 401 })
  }

  // 2. Vérifier si ce profil doit voir le popup
  const { data: shouldShow, error: rpcError } = await supabase
    .rpc('should_show_world_day_popup')

  if (rpcError || !shouldShow) {
    return NextResponse.json({ show: false })
  }

  // 3. Récupérer les journées mondiales du jour
  const { data: days, error: daysError } = await supabase
    .rpc('get_todays_world_days')

  if (daysError || !days || days.length === 0) {
    return NextResponse.json({ show: false })
  }

  return NextResponse.json({
    show: true,
    days: days.map((d: { label: string }) => d.label),
  })
}
