'use client'

import { usePathname } from 'next/navigation'
import { Vente2Calculator } from '@/components/vente/Vente2Calculator'

type RouteConfig = {
  view: 'social' | 'sms' | 'kpiMax' | 'calendar'
  pageTitle: string
  pageDescription?: string
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/calculateur-vente-2/social-media': {
    view: 'social',
    pageTitle: 'Calculateur Vente 2',
  },
  '/calculateur-vente-2/sms-rcs': {
    view: 'sms',
    pageTitle: 'Calculateur Vente 2 — SMS & RCS',
  },
  '/strategie/retroplanning': {
    view: 'calendar',
    pageTitle: 'Stratégie — Rétroplanning',
    pageDescription:
      'Planifiez et visualisez le rétroplanning de vos campagnes Social media et SMS / RCS.',
  },
}

const DEFAULT_DESCRIPTION =
  'Outil à titre informatif : estimez prix, volumes et planning pour la lecture d’une brief — sans valeur contractuelle.'

function resolveRouteConfig(pathname: string | null): RouteConfig | undefined {
  if (!pathname) return undefined
  const entries = Object.entries(ROUTE_CONFIG) as [string, RouteConfig][]
  return entries.find(([path]) => pathname === path || pathname.startsWith(`${path}/`))?.[1]
}

export function Vente2AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const config = resolveRouteConfig(pathname)

  if (!config) {
    return <>{children}</>
  }

  return (
    <Vente2Calculator
      view={config.view}
      pageTitle={config.pageTitle}
      pageDescription={config.pageDescription ?? DEFAULT_DESCRIPTION}
    />
  )
}
