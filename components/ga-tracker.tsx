'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GATracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    // @ts-ignore
    window.gtag?.('config', GA_ID, { page_path: pagePath })
  }, [pathname, searchParams])

  return null
}

