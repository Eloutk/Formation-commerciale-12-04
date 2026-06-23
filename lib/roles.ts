export type UserRole = 'user' | 'admin' | 'super_admin' | 'client'

export const USER_ROLES: readonly UserRole[] = [
  'user',
  'client',
  'admin',
  'super_admin',
] as const

export function normalizeUserRole(role: string | undefined | null): UserRole | null {
  const roleNorm = typeof role === 'string' ? role.trim().toLowerCase() : ''
  if (roleNorm === 'user') return 'user'
  if (roleNorm === 'client') return 'client'
  if (roleNorm === 'admin') return 'admin'
  if (roleNorm === 'super_admin') return 'super_admin'
  return null
}

export function isAdminRole(role: string | undefined | null): boolean {
  const normalized = normalizeUserRole(role)
  return normalized === 'admin' || normalized === 'super_admin'
}

export function isClientRole(role: string | undefined | null): boolean {
  return normalizeUserRole(role) === 'client'
}

export function formatUserRoleLabel(role: UserRole | null): string {
  switch (role) {
    case 'client':
      return 'Client'
    case 'admin':
      return 'Administrateur'
    case 'super_admin':
      return 'Super administrateur'
    case 'user':
      return 'Utilisateur'
    default:
      return 'Utilisateur'
  }
}
