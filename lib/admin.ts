import supabase from '@/utils/supabase/client'

export function isAdminRole(role: string | undefined | null): boolean {
  const roleNorm = typeof role === 'string' ? role.trim().toLowerCase() : ''
  return roleNorm === 'admin' || roleNorm === 'super_admin'
}

/**
 * Vérifie si l'utilisateur connecté a un rôle admin
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !profile?.role) return false

    return isAdminRole(profile.role as string)
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Récupère le profil complet de l'utilisateur connecté
 */
export async function getCurrentUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) return null

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}
