'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthAccess } from '@/components/auth-context'
import {
  fetchHomePlayAttention,
  HOME_PLAY_ATTENTION_EVENT,
} from '@/lib/home-play-attention'
import { cn } from '@/lib/utils'

type HomeLogoLinkProps = {
  className?: string
  showLabel?: boolean
  /** Affiche le libellé aussi sur mobile (menu drawer). */
  alwaysShowLabel?: boolean
  onNavigate?: () => void
}

export function HomeLogoLink({
  className,
  showLabel = true,
  alwaysShowLabel = false,
  onNavigate,
}: HomeLogoLinkProps) {
  const pathname = usePathname()
  const { authReady } = useAuthAccess()
  const [pendingCount, setPendingCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!authReady) return
    const state = await fetchHomePlayAttention()
    setPendingCount(state.pendingCount)
  }, [authReady])

  useEffect(() => {
    void refresh()
  }, [refresh, pathname])

  useEffect(() => {
    if (!authReady) return
    const onRefresh = () => {
      void refresh()
    }
    const onFocus = () => {
      void refresh()
    }
    window.addEventListener(HOME_PLAY_ATTENTION_EVENT, onRefresh)
    window.addEventListener('focus', onFocus)
    const id = window.setInterval(onRefresh, 60_000)
    return () => {
      window.removeEventListener(HOME_PLAY_ATTENTION_EVENT, onRefresh)
      window.removeEventListener('focus', onFocus)
      window.clearInterval(id)
    }
  }, [authReady, refresh])

  const needsAttention = pendingCount > 0
  const label =
    pendingCount === 1
      ? '1 activité Home à faire aujourd’hui'
      : `${pendingCount} activités Home à faire aujourd’hui`

  return (
    <Link
      href="/home"
      onClick={onNavigate}
      className={cn('relative flex shrink-0 items-center gap-2 font-semibold', className)}
      aria-label={needsAttention ? `Link academy — ${label}` : 'Link academy — Accueil'}
      title={needsAttention ? label : 'Accueil'}
    >
      <span className="relative inline-flex">
        <Image
          src="/Logo Link Vertical (Orange).png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-auto object-contain"
        />
        {needsAttention ? (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E94C16] opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#E94C16] text-[9px] font-bold leading-none text-white">
              {pendingCount}
            </span>
          </span>
        ) : null}
      </span>
      {showLabel ? (
        <span className={alwaysShowLabel ? 'inline' : 'hidden sm:inline'}>Link academy</span>
      ) : null}
      {needsAttention && showLabel ? (
        <span
          className={cn(
            'items-center rounded-full bg-[#E94C16]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E94C16]',
            alwaysShowLabel ? 'inline-flex' : 'hidden md:inline-flex'
          )}
        >
          Home
        </span>
      ) : null}
    </Link>
  )
}
