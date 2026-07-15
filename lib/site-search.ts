import {
  ACADEMY_LINKS,
  GUIDES_LINKS,
  GUIDES_FAQ_HREF,
  GUIDES_LEXIQUE_HREF,
  IA_HREF,
  MON_ESPACE_LINKS,
  STRATEGIE_LINKS,
  VENTE2_LINKS,
  isExternalNavHref,
  type NavMenuItem,
} from '@/lib/nav-config'
import { TUTO_ITEMS } from '@/lib/nav-aide'
import { FAQ_ITEMS } from '@/lib/faq-items'
import { GLOSSARY_TERMS } from '@/lib/glossary-terms'
import { filterFormationModulesForRole, getModulesProgress } from '@/lib/progress'
import { canAccessCta, type UserRole } from '@/lib/roles'
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
  cpAdminOnly?: boolean
  hiddenForClient?: boolean
}

function navItemsToSearch(items: NavMenuItem[], category: string): SearchableItem[] {
  return items.map((item) => ({
    id: `nav-${item.href}`,
    title: item.label,
    href: item.href,
    category,
    ...(item.adminOnly ? { adminOnly: true } : {}),
    ...(item.cpAdminOnly ? { cpAdminOnly: true } : {}),
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
  if (item.cpAdminOnly && !canAccessCta(role)) return false
  if (item.title === 'Vue admin' && !isAdmin) return false
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
    ...navItemsToSearch(GUIDES_LINKS, 'Guides'),
    ...navItemsToSearch(ACADEMY_LINKS, 'Academy'),
    ...navItemsToSearch(VENTE2_LINKS, 'Vente 2'),
    ...navItemsToSearch(STRATEGIE_LINKS, 'Stratégie'),
    ...navItemsToSearch(MON_ESPACE_LINKS, 'Mon espace'),
    ...(isAdmin
      ? [
          {
            id: 'nav-ia',
            title: 'IA',
            href: IA_HREF,
            category: 'IA',
            keywords: ['intelligence artificielle'],
            adminOnly: true,
          } satisfies SearchableItem,
        ]
      : []),
  ]

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
      href: GUIDES_LEXIQUE_HREF,
      category: 'Lexique',
      keywords: [term.term, term.definition, term.category],
    })
  }

  for (const [index, faq] of FAQ_ITEMS.entries()) {
    items.push({
      id: `faq-${index}`,
      title: faq.question,
      description: faq.answer,
      href: GUIDES_FAQ_HREF,
      category: 'FAQ',
      keywords: [faq.question, faq.answer],
    })
  }

  for (const [index, tuto] of TUTO_ITEMS.entries()) {
    items.push({
      id: `tuto-${index}`,
      title: tuto.label,
      href: tuto.href,
      category: 'Tuto',
      keywords: [tuto.label, 'vidéo', 'vimeo'],
      external: tuto.external ?? isExternalNavHref(tuto.href),
    })
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
