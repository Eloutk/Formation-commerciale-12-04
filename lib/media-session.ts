import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { isAdminRole } from '@/lib/admin'
import { isClientRole, normalizeUserRole } from '@/lib/roles'

function getBearerToken(req?: Request) {
  const header = req?.headers.get('Authorization')
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export async function getServerSupabase(req?: Request): Promise<SupabaseClient> {
  const bearer = getBearerToken(req)
  if (bearer) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        },
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      },
    )
  }

  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Route Handler en lecture seule : la session est gérée ailleurs.
          }
        },
      },
    },
  )
}

export async function getPrimarySessionUser(req?: Request) {
  const supabase = await getServerSupabase(req)
  const bearer = getBearerToken(req)

  const {
    data: { user },
  } = bearer
    ? await supabase.auth.getUser(bearer)
    : await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, display_name, role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('Media auth profile lookup failed:', profileError.message, user.id)
  }

  const displayName =
    (profile as { display_name?: string; full_name?: string } | null)?.display_name ||
    (profile as { display_name?: string; full_name?: string } | null)?.full_name ||
    user.email?.split('@')[0] ||
    'Utilisateur'

  const role = normalizeUserRole((profile as { role?: string } | null)?.role)
  const isAdmin = await resolveIsAdmin(supabase, user.id, role)

  return {
    id: user.id,
    email: user.email || '',
    name: displayName,
    role,
    isAdmin,
    isClient: isClientRole(role),
  }
}

async function resolveIsAdmin(
  supabase: SupabaseClient,
  userId: string,
  role?: string | null,
): Promise<boolean> {
  if (isAdminRole(role)) return true

  const { data, error } = await supabase.rpc('is_admin', { user_id: userId })
  if (error) {
    console.error('Media auth is_admin rpc failed:', error.message, userId)
    return false
  }

  return data === true
}

export async function requireAuthenticatedSessionUser(req?: Request) {
  const user = await getPrimarySessionUser(req)
  if (!user) return { user: null, status: 401 as const }
  return { user, status: null }
}

export async function requireAdminSessionUser(req?: Request) {
  const user = await getPrimarySessionUser(req)
  if (!user) return { user: null, status: 401 as const }
  if (!user.isAdmin) return { user: null, status: 403 as const }
  return { user, status: null }
}

export function isMediaTableMissingError(error: { code?: string; message?: string } | null) {
  if (!error) return false
  const msg = (error.message ?? '').toLowerCase()
  // Erreur de colonne manquante ≠ table absente
  if (msg.includes('column') || msg.includes('schema cache')) return false
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    (msg.includes('media_assets') && msg.includes('does not exist'))
  )
}

function isMissingMediaColumnError(error: { message?: string } | null, column: string) {
  if (!error?.message) return false
  const msg = error.message.toLowerCase()
  return msg.includes(column.toLowerCase()) && (msg.includes('column') || msg.includes('schema cache'))
}

export function formatMediaDbError(error: { code?: string; message?: string } | null): string {
  if (!error) return 'Erreur base de données'
  if (isMediaTableMissingError(error)) {
    return 'Médiathèque non configurée. Exécutez supabase/media-library.sql dans le SQL Editor Supabase.'
  }
  if (isMissingMediaColumnError(error, 'platforms')) {
    return 'Migration plateformes requise. Exécutez supabase/media-library-migration-platforms.sql dans Supabase.'
  }
  if (isMissingMediaColumnError(error, 'sectors')) {
    return 'Migration secteurs requise. Exécutez supabase/media-library-migration-sectors.sql dans Supabase.'
  }
  return error.message ?? 'Erreur base de données'
}
