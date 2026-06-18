import { AIDE_LINKS, isAidePath } from '@/lib/nav-aide'

export type NavMenuItem = {
  href: string
  label: string
  isActive?: boolean
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
]

export const VENTE2_SOCIAL_HREF = '/calculateur-vente-2/social-media'
export const VENTE2_SMS_HREF = '/calculateur-vente-2/sms-rcs'

export const VENTE2_LINKS: NavMenuItem[] = [
  { href: VENTE2_SOCIAL_HREF, label: 'Social Media' },
  { href: VENTE2_SMS_HREF, label: 'SMS & RCS' },
]

export const STRATEGIE_LINKS: NavMenuItem[] = [
  { href: '/strategie/social-media', label: 'Social Media' },
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

export function withActiveItems(pathname: string | null | undefined, items: NavMenuItem[]): NavMenuItem[] {
  return items.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.href),
  }))
}

export { isAidePath, AIDE_LINKS }
