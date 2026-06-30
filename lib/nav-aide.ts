export type TutoItem = {
  label: string
  href: string
  /** Lien externe (ex. Vimeo) — ouverture dans un nouvel onglet */
  external?: boolean
}

export const TUTO_ITEMS: TutoItem[] = [
  {
    label: 'Accès commentaires',
    href: 'https://vimeo.com/814894285/31f18d2b1c',
    external: true,
  },
  {
    label: 'Récupérer les prospects',
    href: 'https://vimeo.com/814894268/d3f521224f',
    external: true,
  },
  {
    label: 'Rapport campagne',
    href: 'https://vimeo.com/814894245/c4b8212ce8',
    external: true,
  },
  {
    label: 'Google Analytics',
    href: 'https://vimeo.com/814894231/5ab6e43a31',
    external: true,
  },
  {
    label: 'Accès Pixel',
    href: 'https://vimeo.com/814894180/5678db7f69',
    external: true,
  },
  {
    label: 'Accès GTM',
    href: 'https://vimeo.com/858612678/20b378c6b3',
    external: true,
  },
  {
    label: 'Attribution Administrateur',
    href: 'https://vimeo.com/814894211/04137c9e4d',
    external: true,
  },
]
export function isExternalNavHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

export function openNavLink(href: string, routerPush: (path: string) => void) {
  if (isExternalNavHref(href)) {
    window.open(href, '_blank', 'noopener,noreferrer')
    return
  }
  routerPush(href)
}
