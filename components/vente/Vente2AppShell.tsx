'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { Vente2Calculator } from '@/components/vente/Vente2Calculator'

import { MON_ESPACE_SMS_HREF, MON_ESPACE_SOCIAL_HREF } from '@/lib/nav-config'

type RouteConfig = {
  view: 'social' | 'sms' | 'kpiMax' | 'calendar'
  pageTitle: string
  pageDescription?: string
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  [MON_ESPACE_SOCIAL_HREF]: {
    view: 'social',
    pageTitle: 'Calculateur Vente 2',
  },
  [MON_ESPACE_SMS_HREF]: {
    view: 'sms',
    pageTitle: 'Calculateur Vente 2 — SMS & RCS',
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
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 flex items-center justify-center text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <Vente2Calculator
        view={config.view}
        pageTitle={config.pageTitle}
        pageDescription={config.pageDescription ?? DEFAULT_DESCRIPTION}
      />
    </Suspense>
  )
}
