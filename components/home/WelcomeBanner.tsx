'use client'

import { Flame } from 'lucide-react'
import { GamificationHelpDialog } from '@/components/home/GamificationHelpDialog'
import { firstNameFromDisplayName } from '@/lib/daily-question-cycle'

type WelcomeBannerProps = {
  userName: string | null
  totalPoints: number
  currentStreak: number
  statsLoading?: boolean
}

export function WelcomeBanner({
  userName,
  totalPoints,
  currentStreak,
  statsLoading = false,
}: WelcomeBannerProps) {
  const firstName = firstNameFromDisplayName(userName)

  return (
    <section className="shrink-0 overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent px-3 py-1.5 sm:px-4 sm:py-2">
        <h1 className="!text-base !leading-tight sm:!text-lg">
          Bonjour{firstName ? ` ${firstName}` : ''} 👋
        </h1>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-x-3">
          <GamificationHelpDialog />
          {statsLoading ? (
            <p className="text-[11px] text-muted-foreground">Chargement…</p>
          ) : (
            <div className="flex items-center gap-3 whitespace-nowrap text-[11px] sm:text-xs">
              <span>
                <strong className="text-sm sm:text-base">{totalPoints}</strong> pts
              </span>
              <div className="flex items-center gap-1.5 rounded-md bg-[#E94C16]/10 px-2 py-1">
                <Flame className="h-3.5 w-3.5 shrink-0 text-[#E94C16]" />
                <span className="font-semibold text-[#E94C16]">
                  {currentStreak > 0 ? `${currentStreak} j.` : '—'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
