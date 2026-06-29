import { AIDE_LINKS, isAidePath, isExternalNavHref, type NavAideLink } from '@/lib/nav-aide'
import { isClientRole, type UserRole } from '@/lib/roles'

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

export const ACADEMY_DIFFUSION_HREF = '/academy/diffusion'

export const GUIDES_STUDIO_HREF = '/guides/studio'
export const GUIDES_MEDIA_HREF = '/guides/media'
export const GUIDES_LEXIQUE_HREF = '/guides/lexique'
export const GUIDES_FAQ_HREF = '/guides/faq'
export const GUIDES_TUTOS_HREF = '/guides/tutos'

export const STRATEGIE_PLAN_MEDIA_HREF = '/strategie/plan-media'
export const STRATEGIE_CARTOGRAPHIE_HREF = '/strategie/cartographie'
export const STRATEGIE_RETROPLANNING_HREF = '/strategie/retroplanning'

export const MON_ESPACE_PIGE_COMMERCIALE_HREF = '/mon-espace/pige-commerciale'

/** @deprecated Alias historique — préférer MON_ESPACE_PIGE_COMMERCIALE_HREF */
export const STRATEGIE_PIGE_COMMERCIALE_HREF = MON_ESPACE_PIGE_COMMERCIALE_HREF

/** @deprecated Alias historique — préférer STRATEGIE_PLAN_MEDIA_HREF */
export const STRATEGIE_SOCIAL_HREF = STRATEGIE_PLAN_MEDIA_HREF

export const MON_ESPACE_SOCIAL_HREF = '/mon-espace/social-media'
export const MON_ESPACE_SMS_HREF = '/mon-espace/sms-rcs'
export const MON_ESPACE_TARIFS_STUDIO_HREF = '/mon-espace/tarifs-studio'
export const MON_ESPACE_MES_PROJETS_HREF = '/mon-espace/mes-projets'

/** @deprecated Alias historique — préférer MON_ESPACE_MES_PROJETS_HREF */
export const MON_ESPACE_HREF = MON_ESPACE_MES_PROJETS_HREF

/** @deprecated Alias historique — préférer MON_ESPACE_SOCIAL_HREF */
export const VENTE2_SOCIAL_HREF = MON_ESPACE_SOCIAL_HREF

/** @deprecated Alias historique — préférer MON_ESPACE_SMS_HREF */
export const VENTE2_SMS_HREF = MON_ESPACE_SMS_HREF

export const VENTE2_STUDIO_TARIFS_HREF = MON_ESPACE_TARIFS_STUDIO_HREF
export const MOCKUP_HREF = '/mockup'
export const IA_HREF = '/ia'

export const ACADEMY_LINKS: NavMenuItem[] = [
  { href: ACADEMY_DIFFUSION_HREF, label: 'Diffusion' },
]

export const GUIDES_LINKS: NavMenuItem[] = [
  { href: GUIDES_STUDIO_HREF, label: 'Studio' },
  { href: GUIDES_MEDIA_HREF, label: 'Média' },
  { href: GUIDES_LEXIQUE_HREF, label: 'Lexique' },
  { href: GUIDES_FAQ_HREF, label: 'FAQ' },
  { href: GUIDES_TUTOS_HREF, label: 'Tutos' },
]

export const STRATEGIE_LINKS: NavMenuItem[] = [
  { href: STRATEGIE_PLAN_MEDIA_HREF, label: 'Plan Média' },
  { href: STRATEGIE_CARTOGRAPHIE_HREF, label: 'Cartographie' },
  { href: STRATEGIE_RETROPLANNING_HREF, label: 'Rétroplanning' },
]

export const MON_ESPACE_LINKS: NavMenuItem[] = [
  { href: MON_ESPACE_MES_PROJETS_HREF, label: 'Mes projets' },
  { href: MON_ESPACE_PIGE_COMMERCIALE_HREF, label: 'Pige commerciale' },
  { href: MON_ESPACE_SOCIAL_HREF, label: 'Social Média' },
  { href: MON_ESPACE_SMS_HREF, label: 'SMS & RCS' },
  { href: MON_ESPACE_TARIFS_STUDIO_HREF, label: 'Tarifs studio' },
]

export const VENTE2_LINKS: NavMenuItem[] = []

/** @deprecated Utiliser ACADEMY_LINKS, GUIDES_LINKS et STRATEGIE_LINKS */
export const RESSOURCES_LINKS: NavMenuItem[] = [
  ...ACADEMY_LINKS,
  ...GUIDES_LINKS.filter((item) => item.href !== GUIDES_LEXIQUE_HREF && item.href !== GUIDES_FAQ_HREF && item.href !== GUIDES_TUTOS_HREF),
  { href: STRATEGIE_CARTOGRAPHIE_HREF, label: 'Cartographie' },
]

export function filterNavItemsByAdmin<T extends { adminOnly?: boolean }>(
  items: T[],
  isAdmin: boolean,
): T[] {
  return items.filter((item) => !item.adminOnly || isAdmin)
}

export function filterAideLinksByRole(
  items: NavAideLink[],
  isAdmin: boolean,
  role: UserRole | null,
): NavAideLink[] {
  const hideForClient = isClientRole(role)
  return items.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    if (item.hiddenForClient && hideForClient) return false
    return true
  })
}

export function filterVente2LinksByRole(
  items: NavMenuItem[],
  _role: UserRole | null,
  _isAdmin: boolean,
): NavMenuItem[] {
  return items
}

export function canShowVente2Nav(_role: UserRole | null, _isAdmin: boolean): boolean {
  return VENTE2_LINKS.length > 0
}

export function isPathActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isAcademyPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname.startsWith('/academy')
}

export function isGuidesPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname.startsWith('/guides')
}

export function isRessourcesPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return (
    isAcademyPath(pathname) ||
    isGuidesPath(pathname) ||
    isPathActive(pathname, STRATEGIE_CARTOGRAPHIE_HREF)
  )
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
  return pathname === '/mon-espace' || pathname.startsWith('/mon-espace/')
}

export function isIaPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === IA_HREF || pathname.startsWith(`${IA_HREF}/`)
}

export function withActiveItems(pathname: string | null | undefined, items: NavMenuItem[]): NavMenuItem[] {
  return items.map((item) => ({
    ...item,
    isActive: isPathActive(pathname, item.href),
  }))
}

export { isAidePath, AIDE_LINKS, isExternalNavHref }
