import {
  AIDE_LINKS,
  IA_HREF,
  MON_ESPACE_HREF,
  RESSOURCES_LINKS,
  STRATEGIE_LINKS,
  VENTE2_LINKS,
  canShowVente2Nav,
  filterAideLinksByRole,
  filterNavItemsByAdmin,
  filterVente2LinksByRole,
  type NavMenuItem,
} from '@/lib/nav-config'
import { filterFormationModulesForRole, getModulesProgress } from '@/lib/progress'
import type { UserRole } from '@/lib/roles'

export type SiteSearchItem = {
  title: string
  description?: string
  href: string
  category: string
}

function navItemsToSearch(items: NavMenuItem[], category: string): SiteSearchItem[] {
  return items.map((item) => ({
    title: item.label,
    href: item.href,
    category,
  }))
}

export function getSiteSearchItems(params: {
  isAdmin: boolean
  role: UserRole | null
}): SiteSearchItem[] {
  const { isAdmin, role } = params
  const items: SiteSearchItem[] = [
    { title: 'Accueil', href: '/home', category: 'Général' },
    { title: 'Calculateur vente', href: '/vente', category: 'Vente' },
    ...navItemsToSearch(filterNavItemsByAdmin(RESSOURCES_LINKS, isAdmin), 'Ressources'),
  ]

  if (canShowVente2Nav(role, isAdmin)) {
    items.push(...navItemsToSearch(filterVente2LinksByRole(VENTE2_LINKS, role, isAdmin), 'Vente 2'))
  }

  if (isAdmin) {
    items.push(...navItemsToSearch(STRATEGIE_LINKS, 'Stratégie'))
    items.push({ title: 'IA', href: IA_HREF, category: 'Admin' })
    items.push({ title: 'Mon espace', href: MON_ESPACE_HREF, category: 'Admin' })
  }

  for (const link of filterAideLinksByRole(AIDE_LINKS, isAdmin, role)) {
    items.push({ title: link.label, href: link.href, category: 'Aide' })
  }

  const { modules } = getModulesProgress()
  for (const module of filterFormationModulesForRole(modules, role)) {
    items.push({
      title: module.title === 'Bilans de campagne' ? 'Rapports de campagne' : module.title,
      description: module.description,
      href: module.href,
      category: 'Formation',
    })
  }

  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })
}

export function filterSiteSearch(query: string, items: SiteSearchItem[]): SiteSearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return items
    .filter((item) => {
      const haystack = `${item.title} ${item.description ?? ''} ${item.category}`.toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 8)
}
