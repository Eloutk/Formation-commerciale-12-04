'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { HeaderNavMenu } from '@/components/nav/header-nav-menu'
import { MobileNavMenu } from '@/components/nav/mobile-nav-menu'
import { useAuthAccess } from '@/components/auth-context'
import { isMonEspacePath, withActiveMonEspaceItems } from '@/lib/nav-config'

export function MonEspaceHeaderNavMenu() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAdmin, role } = useAuthAccess()

  return (
    <HeaderNavMenu
      label="Mon espace"
      active={isMonEspacePath(pathname)}
      accent
      align="end"
      items={withActiveMonEspaceItems(pathname, searchParams, isAdmin, role)}
    />
  )
}

export function MonEspaceMobileNavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAdmin, role } = useAuthAccess()

  return (
    <MobileNavMenu
      label="Mon espace"
      active={isMonEspacePath(pathname)}
      accent
      items={withActiveMonEspaceItems(pathname, searchParams, isAdmin, role)}
      onNavigate={onNavigate}
    />
  )
}
