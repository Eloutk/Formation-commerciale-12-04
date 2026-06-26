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
  isExternalNavHref,
  type NavMenuItem,
} from '@/lib/nav-config'
import { TUTO_ITEMS } from '@/lib/nav-aide'
import { FAQ_ITEMS } from '@/lib/faq-items'
import { GLOSSARY_TERMS } from '@/lib/glossary-terms'
import { filterFormationModulesForRole, getModulesProgress } from '@/lib/progress'
import { isClientRole, type UserRole } from '@/lib/roles'
import { SITE_SEARCH_CATALOG } from '@/lib/site-search-catalog'

export type SiteSearchItem = {
  id: string
  title: string
  description?: string
  href: string
  category: string
  keywords?: string[]
  external?: boolean
}

type SearchableItem = SiteSearchItem & {
  adminOnly?: boolean
  hiddenForClient?: boolean
}

function navItemsToSearch(items: NavMenuItem[], category: string): SearchableItem[] {
  return items.map((item) => ({
    id: `nav-${item.href}`,
    title: item.label,
    href: item.href,
    category,
  }))
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function itemHaystack(item: SearchableItem): string {
  return normalizeSearchText(
    [item.title, item.description ?? '', item.category, ...(item.keywords ?? [])].join(' '),
  )
}

function isItemVisible(item: SearchableItem, isAdmin: boolean, role: UserRole | null): boolean {
  if (item.adminOnly && !isAdmin) return false
  if (item.hiddenForClient && isClientRole(role)) return false
  return true
}

function scoreItem(item: SearchableItem, tokens: string[]): number {
  const title = normalizeSearchText(item.title)
  const haystack = itemHaystack(item)
  let score = 0

  for (const token of tokens) {
    if (!haystack.includes(token)) return -1
    if (title.includes(token)) score += 12
    else if (normalizeSearchText(item.category).includes(token)) score += 4
    else score += 1
  }

  return score
}

export function getSiteSearchItems(params: {
  isAdmin: boolean
  role: UserRole | null
}): SiteSearchItem[] {
  const { isAdmin, role } = params
  const items: SearchableItem[] = [
    ...SITE_SEARCH_CATALOG,
    ...navItemsToSearch(filterNavItemsByAdmin(RESSOURCES_LINKS, isAdmin), 'Ressources'),
  ]

  if (canShowVente2Nav(role, isAdmin)) {
    items.push(...navItemsToSearch(filterVente2LinksByRole(VENTE2_LINKS, role, isAdmin), 'Vente 2'))
  }

  if (isAdmin) {
    items.push(...navItemsToSearch(STRATEGIE_LINKS, 'Stratégie'))
    items.push({
      id: 'nav-ia',
      title: 'IA',
      href: IA_HREF,
      category: 'Admin',
      keywords: ['intelligence artificielle'],
      adminOnly: true,
    })
    items.push({
      id: 'nav-mon-espace',
      title: 'Mon espace',
      href: MON_ESPACE_HREF,
      category: 'Admin',
      adminOnly: true,
    })
  }

  for (const link of filterAideLinksByRole(AIDE_LINKS, isAdmin, role)) {
    items.push({
      id: `nav-aide-${link.href}`,
      title: link.label,
      href: link.href,
      category: 'Aide',
      adminOnly: link.adminOnly,
      hiddenForClient: link.hiddenForClient,
    })
  }

  const { modules } = getModulesProgress()
  for (const module of filterFormationModulesForRole(modules, role)) {
    const title = module.title === 'Bilans de campagne' ? 'Rapports de campagne' : module.title
    items.push({
      id: `formation-${module.id}`,
      title,
      description: module.description,
      href: module.href,
      category: 'Formation',
      keywords: [module.title, module.description],
      hiddenForClient: module.hiddenForClient,
    })
    items.push({
      id: `formation-quiz-${module.id}`,
      title: `Quiz — ${title}`,
      description: `Questionnaire sur le module ${title}`,
      href: `${module.href}/quiz`,
      category: 'Formation — Quiz',
      keywords: ['quiz', 'examen', module.title],
      hiddenForClient: module.hiddenForClient,
    })
  }

  for (const term of GLOSSARY_TERMS) {
    items.push({
      id: `glossaire-${term.id}`,
      title: term.term,
      description: term.definition,
      href: '/glossaire',
      category: 'Glossaire',
      keywords: [term.term, term.definition, term.category],
    })
  }

  for (const [index, faq] of FAQ_ITEMS.entries()) {
    items.push({
      id: `faq-${index}`,
      title: faq.question,
      description: faq.answer,
      href: '/faq',
      category: 'FAQ',
      keywords: [faq.question, faq.answer],
    })
  }

  if (isAdmin) {
    for (const [index, tuto] of TUTO_ITEMS.entries()) {
      items.push({
        id: `tuto-${index}`,
        title: tuto.label,
        href: tuto.href,
        category: 'Tuto',
        keywords: [tuto.label, 'vidéo', 'vimeo'],
        external: tuto.external ?? isExternalNavHref(tuto.href),
        adminOnly: true,
      })
    }
  }

  const seen = new Set<string>()
  return items
    .filter((item) => isItemVisible(item, isAdmin, role))
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .map(({ adminOnly: _a, hiddenForClient: _h, ...item }) => item)
}

export function filterSiteSearch(query: string, items: SiteSearchItem[]): SiteSearchItem[] {
  const tokens = query
    .trim()
    .split(/\s+/)
    .map(normalizeSearchText)
    .filter(Boolean)

  if (tokens.length === 0) return []

  return items
    .map((item) => ({
      item,
      score: scoreItem(item as SearchableItem, tokens),
    }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'fr'))
    .map(({ item }) => item)
}
