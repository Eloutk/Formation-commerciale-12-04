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
    // Track page view to Supabase
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pagePath, userAgent: navigator.userAgent, referrer: document.referrer })
    }).catch(() => {})
  }, [pathname, searchParams])

  return null
}

