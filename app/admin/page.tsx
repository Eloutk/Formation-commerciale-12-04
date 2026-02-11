'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkIsAdmin } from '@/lib/admin'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const ok = await checkIsAdmin()
      router.replace(ok ? '/admin/newsletter' : '/home')
    })()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
      Chargement...
    </div>
  )
}

