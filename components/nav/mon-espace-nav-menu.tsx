'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { HeaderNavMenu } from '@/components/nav/header-nav-menu'
import { MobileNavMenu } from '@/components/nav/mobile-nav-menu'
import { useAuthAccess } from '@/components/auth-context'
import {
  isMonEspacePath,
  MON_ESPACE_MES_PROJETS_HREF,
  withActiveMonEspaceItems,
} from '@/lib/nav-config'
import {
  countUnseenVente2StrategyShares,
  markVente2StrategySharesSeen,
} from '@/lib/vente2-strategies-storage'

function useSharedProjectsBadge() {
  const pathname = usePathname()
  const { authReady } = useAuthAccess()
  const [sharedBadgeCount, setSharedBadgeCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!authReady) return
    try {
      const n = await countUnseenVente2StrategyShares()
      setSharedBadgeCount(n)
    } catch {
      setSharedBadgeCount(0)
    }
  }, [authReady])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Quand on ouvre Mes projets, marquer les partages comme vus puis rafraîchir le badge
  useEffect(() => {
    if (!authReady) return
    if (!pathname?.startsWith(MON_ESPACE_MES_PROJETS_HREF)) return
    let cancelled = false
    void markVente2StrategySharesSeen()
      .then(() => {
        if (!cancelled) setSharedBadgeCount(0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [authReady, pathname])

  // Rafraîchir périodiquement (nouvelles partages pendant la session)
  useEffect(() => {
    if (!authReady) return
    const id = window.setInterval(() => {
      void refresh()
    }, 60_000)
    const onFocus = () => {
      void refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [authReady, refresh])

  return sharedBadgeCount
}

export function MonEspaceHeaderNavMenu() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAdmin, role } = useAuthAccess()
  const sharedBadgeCount = useSharedProjectsBadge()

  return (
    <HeaderNavMenu
      label="Mon espace"
      active={isMonEspacePath(pathname)}
      accent
      align="end"
      badgeCount={sharedBadgeCount}
      items={withActiveMonEspaceItems(pathname, searchParams, isAdmin, role, sharedBadgeCount)}
    />
  )
}

export function MonEspaceMobileNavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAdmin, role } = useAuthAccess()
  const sharedBadgeCount = useSharedProjectsBadge()

  return (
    <MobileNavMenu
      label="Mon espace"
      active={isMonEspacePath(pathname)}
      accent
      badgeCount={sharedBadgeCount}
      items={withActiveMonEspaceItems(pathname, searchParams, isAdmin, role, sharedBadgeCount)}
      onNavigate={onNavigate}
    />
  )
}
