'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthAccess } from '@/components/auth-context'

export function AdminGuardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { authReady } = useAuthAccess()

  useEffect(() => {
    if (!authReady) return
    if (!pathname) router.replace('/login')
  }, [authReady, pathname, router])

  if (!authReady) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  return <>{children}</>
}
