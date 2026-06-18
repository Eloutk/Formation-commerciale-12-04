import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    },
  )
}

export async function getPrimarySessionUser() {
  const supabase = await getServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, display_name')
    .eq('id', user.id)
    .maybeSingle()

  const displayName =
    (profile as { display_name?: string; full_name?: string } | null)?.display_name ||
    (profile as { display_name?: string; full_name?: string } | null)?.full_name ||
    user.email?.split('@')[0] ||
    'Utilisateur'

  return {
    id: user.id,
    email: user.email || '',
    name: displayName,
  }
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
