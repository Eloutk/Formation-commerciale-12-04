'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SavedRecordLoadingBannerProps = {
  label: string
  description?: string
  className?: string
  /** prominent = bloc centré bien visible ; inline = bandeau horizontal */
  variant?: 'prominent' | 'inline'
}

export function SavedRecordLoadingBanner({
  label,
  description = 'Merci de patienter quelques instants.',
  className,
  variant = 'prominent',
}: SavedRecordLoadingBannerProps) {
  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(
          'flex items-center gap-3 rounded-xl border-2 border-[#E94C16]/40 bg-gradient-to-r from-[#E94C16]/12 to-orange-50/90 px-4 py-3 shadow-sm',
          className,
        )}
      >
        <Loader2 className="h-6 w-6 shrink-0 animate-spin text-[#E94C16]" aria-hidden />
        <div className="min-w-0 text-left">
          <p className="text-sm font-semibold text-foreground md:text-base">{label}</p>
          {description ? <p className="text-xs text-muted-foreground md:text-sm">{description}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-[#E94C16]/45 bg-gradient-to-br from-[#E94C16]/12 via-orange-50 to-white px-6 py-12 text-center shadow-md',
        className,
      )}
    >
      <Loader2 className="mb-4 h-11 w-11 animate-spin text-[#E94C16]" aria-hidden />
      <p className="text-base font-semibold text-foreground md:text-lg">{label}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}
