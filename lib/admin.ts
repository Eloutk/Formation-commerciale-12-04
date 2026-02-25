import supabase from '@/utils/supabase/client'

/**
 * Vérifie si l'utilisateur connecté a un rôle admin
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !data) return false

    const role = typeof data.role === 'string' ? data.role.trim().toLowerCase() : ''
    return role === 'admin' || role === 'super_admin'
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
