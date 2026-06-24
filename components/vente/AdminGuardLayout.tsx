'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthAccess } from '@/components/auth-context'
import { VENTE2_STUDIO_TARIFS_HREF } from '@/lib/nav-config'
import { canAccessStudioTarifs } from '@/lib/roles'

function canAccessAdminCalculatorRoute(pathname: string | null, role: ReturnType<typeof useAuthAccess>['role'], isAdmin: boolean): boolean {
  if (isAdmin) return true
  if (!pathname?.startsWith(VENTE2_STUDIO_TARIFS_HREF)) return false
  return canAccessStudioTarifs(role)
}

export function AdminGuardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin, role, authReady } = useAuthAccess()
  const allowed = canAccessAdminCalculatorRoute(pathname, role, isAdmin)

  useEffect(() => {
    if (!authReady) return
    if (!allowed) router.replace('/home')
  }, [authReady, allowed, router])

  if (!authReady) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  if (!allowed) {
    return null
  }

  return <>{children}</>
}
