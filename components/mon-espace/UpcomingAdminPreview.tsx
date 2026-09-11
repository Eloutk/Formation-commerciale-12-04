'use client'

import type { ReactNode } from 'react'
import { CalendarClock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UpcomingPreviewDay } from '@/lib/admin-upcoming-preview'
import { cn } from '@/lib/utils'

export type UpcomingSlot = {
  day: UpcomingPreviewDay
  content: ReactNode
  meta?: ReactNode
}

type UpcomingAdminPreviewProps = {
  slots: UpcomingSlot[]
  emptyHint?: string
  className?: string
}

export function UpcomingAdminPreview({
  slots,
  emptyHint = 'Rien de programmé pour ces jours.',
  className,
}: UpcomingAdminPreviewProps) {
  return (
    <Card className={cn('border-[#E94C16]/25 bg-[#E94C16]/[0.03]', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-[#E94C16]" aria-hidden />
          À vérifier — 2 prochains jours ouvrés
        </CardTitle>
        <CardDescription>
          Aperçu des 2 prochains jours ouvrés (ex. vendredi → lundi / mardi) pour contrôler le
          contenu avant diffusion.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {slots.map(({ day, content, meta }) => (
          <div
            key={day.iso}
            className="rounded-md border border-border/70 bg-card p-3 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {day.shortLabel}
              </Badge>
              {meta}
            </div>
            <div className="text-sm leading-snug text-foreground">
              {content ?? (
                <p className="text-muted-foreground">{emptyHint}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
