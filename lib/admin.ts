import supabase from '@/utils/supabase/client'
import { isAdminRole, normalizeUserRole, type UserRole } from '@/lib/roles'

export { isAdminRole } from '@/lib/roles'

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

export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !profile?.role) return null

    return normalizeUserRole(profile.role as string)
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
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
