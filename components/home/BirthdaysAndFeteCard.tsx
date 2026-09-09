'use client'

import { Cake, Globe2, PartyPopper } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { homeCard } from '@/components/home/home-card-styles'
import { formatDaysUntil, type UpcomingBirthday } from '@/lib/home-events'
import { cn } from '@/lib/utils'

type BirthdaysAndFeteCardProps = {
  todayNames: string[]
  upcoming: UpcomingBirthday[]
  worldDays?: string[]
  loading?: boolean
}

export function BirthdaysAndFeteCard({
  todayNames,
  upcoming,
  worldDays = [],
  loading = false,
}: BirthdaysAndFeteCardProps) {
  const todayBirthdays = upcoming.filter((item) => item.isToday)
  const laterBirthdays = upcoming.filter((item) => !item.isToday).slice(0, 2)

  return (
    <Card className={homeCard.root}>
      <CardHeader className={homeCard.header}>
        <div className={homeCard.titleRow}>
          <Cake className={homeCard.titleIcon} />
          <CardTitle className={homeCard.title}>Aujourd&apos;hui</CardTitle>
        </div>
        <p className={homeCard.subtitle}>Anniversaires, fête & journée mondiale</p>
      </CardHeader>
      <CardContent className={cn(homeCard.content, 'gap-2')}>
        {loading ? (
          <p className={homeCard.bodyMuted}>Chargement…</p>
        ) : (
          <>
            <div className="shrink-0 space-y-1.5">
              <section className="rounded-md border border-border/70 bg-[#FAFAFA] px-2.5 py-1.5">
                <p className={cn(homeCard.sectionTitle, '!mb-1')}>Anniversaires</p>
                {todayBirthdays.length > 0 ? (
                  <ul className="flex flex-wrap gap-1">
                    {todayBirthdays.map((item) => (
                      <li
                        key={`${item.name}-${item.month}-${item.day}`}
                        className="home-birthday-today rounded border border-[#E94C16]/40 bg-[#E94C16]/10 px-2 py-0.5 text-xs font-semibold text-[#E94C16]"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={homeCard.bodyMuted}>Aucun aujourd&apos;hui.</p>
                )}
                {laterBirthdays.length > 0 ? (
                  <ul className="mt-1 space-y-0.5">
                    {laterBirthdays.map((item) => (
                      <li
                        key={`${item.name}-${item.month}-${item.day}`}
                        className="flex items-center justify-between gap-2 text-[11px] leading-tight"
                      >
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatDaysUntil(item.daysUntil)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <section className="rounded-md border border-[#E94C16]/20 bg-[#E94C16]/[0.04] px-2.5 py-1.5">
                <p className={cn(homeCard.sectionTitle, '!mb-0.5')}>
                  <PartyPopper className={homeCard.sectionIcon} />
                  Fête du jour
                </p>
                {todayNames.length > 0 ? (
                  <p className="text-xs font-medium leading-snug">
                    On fête {formatFeteNames(todayNames)}.
                  </p>
                ) : (
                  <p className={homeCard.bodyMuted}>Aucune fête renseignée.</p>
                )}
              </section>
            </div>

            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border/70 bg-[#FAFAFA] px-2.5 py-2">
              <p className={cn(homeCard.sectionTitle, '!mb-1.5')}>
                <Globe2 className={homeCard.sectionIcon} />
                Journée mondiale
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {worldDays.length > 0 ? (
                  <ul className="space-y-1.5">
                    {worldDays.map((label) => (
                      <li
                        key={label}
                        className="rounded-md border border-border/60 bg-card px-2.5 py-2 text-xs leading-snug"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={homeCard.bodyMuted}>Aucune journée mondiale aujourd&apos;hui.</p>
                )}
              </div>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function formatFeteNames(names: string[]): string {
  const shown = names.slice(0, 4)
  const base =
    shown.length === 1
      ? shown[0]
      : shown.length === 2
        ? `${shown[0]} et ${shown[1]}`
        : `${shown.slice(0, -1).join(', ')} et ${shown[shown.length - 1]}`
  return names.length > 4 ? `${base}…` : base
}
