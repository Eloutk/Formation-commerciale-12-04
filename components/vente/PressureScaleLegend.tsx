'use client'

import { cn } from '@/lib/utils'
import { SIMULATEUR_PRESSURE_SCALE, type PressureLevel } from '@/lib/simulateur-media-link'

type PressureScaleLegendProps = {
  className?: string
}

/** Classes statiques (scannées par Tailwind) — fond coloré, texte blanc. */
const PRESSURE_BADGE_CLASSES: Record<Exclude<PressureLevel, '—'>, string> = {
  'Pression faible': 'bg-sky-400 text-white',
  'Pression correcte': 'bg-yellow-500 text-white',
  'Bonne pression': 'bg-emerald-500 text-white',
  'Pression forte': 'bg-orange-500 text-white',
  Surpression: 'bg-red-600 text-white',
}

export function pressureBadgeClass(level: PressureLevel): string {
  if (level === '—') return 'bg-muted text-muted-foreground'
  return PRESSURE_BADGE_CLASSES[level]
}

export function PressureBadge({ level }: { level: PressureLevel }) {
  if (level === '—') return <span className="text-muted-foreground">—</span>
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-normal text-left',
        pressureBadgeClass(level),
      )}
    >
      {level}
    </span>
  )
}

export function PressureScaleLegend({ className }: PressureScaleLegendProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-foreground">Échelle de pression publicitaire</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SIMULATEUR_PRESSURE_SCALE.map((step) => (
          <span
            key={step.level}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-center',
              PRESSURE_BADGE_CLASSES[step.level],
            )}
          >
            {step.level}
          </span>
        ))}
      </div>
    </div>
  )
}
