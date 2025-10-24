"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.substring(1) : ''
    if (hash) {
      const params = new URLSearchParams(hash)
      const hasToken = params.get('access_token') || params.get('code')
      const type = params.get('type')
      if (hasToken && (type === 'recovery' || !type)) {
        router.replace(`/reset-password#${hash}`)
        return
      }
    }
    router.replace('/home')
  }, [router])

  return null
}

