'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthAccess } from '@/components/auth-context'

export function AdminGuardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAdmin, authReady } = useAuthAccess()

  useEffect(() => {
    if (!authReady) return
    if (!isAdmin) router.replace('/home')
  }, [authReady, isAdmin, router])

  if (!authReady) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
