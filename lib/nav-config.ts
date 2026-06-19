import { AIDE_LINKS, isAidePath } from '@/lib/nav-aide'

export type NavMenuItem = {
  href: string
  label: string
  isActive?: boolean
  /** Visible et accessible uniquement aux administrateurs */
  adminOnly?: boolean
}

export type NavMenuGroup = {
  label: string
  items: NavMenuItem[]
}

export const RESSOURCES_LINKS: NavMenuItem[] = [
  { href: '/diffusion', label: 'Diffusion' },
  { href: '/chefferie', label: 'Chefferie de projet' },
  { href: '/studio', label: 'Studio' },
  { href: '/cartographie', label: 'Cartographie' },
  { href: '/media', label: 'Média', adminOnly: true },
]

export function filterNavItemsByAdmin<T extends { adminOnly?: boolean }>(
  items: T[],
  isAdmin: boolean,
): T[] {
  return items.filter((item) => !item.adminOnly || isAdmin)
}

export const VENTE2_SOCIAL_HREF = '/calculateur-vente-2/social-media'
export const VENTE2_SMS_HREF = '/calculateur-vente-2/sms-rcs'
export const STRATEGIE_SOCIAL_HREF = '/strategie/social-media'
export const MON_ESPACE_HREF = '/mon-espace'

export const VENTE2_LINKS: NavMenuItem[] = [
  { href: VENTE2_SOCIAL_HREF, label: 'Social Media' },
  { href: VENTE2_SMS_HREF, label: 'SMS & RCS' },
]

export const STRATEGIE_LINKS: NavMenuItem[] = [
  { href: STRATEGIE_SOCIAL_HREF, label: 'Social Media' },
  { href: '/strategie/retroplanning', label: 'Rétroplanning' },
]

export function isPathActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isRessourcesPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return RESSOURCES_LINKS.some((item) => isPathActive(pathname, item.href))
}

export function isVente2Path(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname.startsWith('/calculateur-vente-2')
}

export function isStrategiePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname.startsWith('/strategie')
}

export function isMonEspacePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === MON_ESPACE_HREF || pathname.startsWith(`${MON_ESPACE_HREF}/`)
}

export function withActiveItems(pathname: string | null | undefined, items: NavMenuItem[]): NavMenuItem[] {
  return items.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.href),
  }))
}

export { isAidePath, AIDE_LINKS }
