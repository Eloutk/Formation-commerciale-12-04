import { isAdminRole, type UserRole } from '@/lib/roles'

/**
 * Permissions applicatives configurables par rôle.
 * Les admins / super_admins ont toujours accès à tout (`*`).
 *
 * Exemple pour un client :
 * client: ['mon_espace.view', 'mockup.view'],
 */
export const APP_PERMISSIONS = {
  monEspace: {
    view: 'mon_espace.view',
  },
  mockup: {
    view: 'mockup.view',
    edit: 'mockup.edit',
  },
  media: {
    view: 'media.view',
  },
  vente2: {
    view: 'vente2.view',
  },
  strategie: {
    view: 'strategie.view',
  },
  calculCpmCpc: {
    view: 'calcul_cpm_cpc.view',
  },
} as const

export type AppPermission =
  | (typeof APP_PERMISSIONS)['monEspace'][keyof (typeof APP_PERMISSIONS)['monEspace']]
  | (typeof APP_PERMISSIONS)['mockup'][keyof (typeof APP_PERMISSIONS)['mockup']]
  | (typeof APP_PERMISSIONS)['media'][keyof (typeof APP_PERMISSIONS)['media']]
  | (typeof APP_PERMISSIONS)['vente2'][keyof (typeof APP_PERMISSIONS)['vente2']]
  | (typeof APP_PERMISSIONS)['strategie'][keyof (typeof APP_PERMISSIONS)['strategie']]
  | (typeof APP_PERMISSIONS)['calculCpmCpc'][keyof (typeof APP_PERMISSIONS)['calculCpmCpc']]
  | '*'

export const ROLE_PERMISSIONS: Record<UserRole, readonly AppPermission[]> = {
  user: [],
  client: [],
  crea: [],
  cp: [],
  admin: ['*'],
  super_admin: ['*'],
}

export function hasAppPermission(
  role: UserRole | null | undefined,
  permission: AppPermission,
): boolean {
  if (!role) return false
  if (isAdminRole(role)) return true

  const permissions = ROLE_PERMISSIONS[role] ?? []
  if (permissions.includes('*')) return true
  return permissions.includes(permission)
}

export function listRolePermissions(role: UserRole | null | undefined): readonly AppPermission[] {
  if (!role) return []
  if (isAdminRole(role)) return ['*']
  return ROLE_PERMISSIONS[role] ?? []
}
