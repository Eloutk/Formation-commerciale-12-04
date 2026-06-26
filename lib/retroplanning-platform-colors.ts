import { adjustColorTint } from '@/app/vente/calendar/colors'
import type { RetroplanningPlatform } from '@/lib/retroplanning-platforms'

type PlatformStyle = { background: string; color: string }

/** Couleurs marque plus contrastées pour le Gantt rétroplanning. */
export const RETROPLANNING_PLATFORM_STYLES: Record<RetroplanningPlatform, PlatformStyle> = {
  META: { background: '#0866FF', color: '#ffffff' },
  Display: { background: '#7C3AED', color: '#ffffff' },
  'Perf max': { background: '#EA4335', color: '#ffffff' },
  'Demand Gen': { background: '#0F9D58', color: '#ffffff' },
  Search: { background: '#F4B400', color: '#1a1a1a' },
  'Insta only': { background: '#E1306C', color: '#ffffff' },
  'Facebook only': { background: '#0866FF', color: '#ffffff' },
  Youtube: { background: '#FF0000', color: '#ffffff' },
  LinkedIn: { background: '#0A66C2', color: '#ffffff' },
  Snapchat: { background: '#FFFC00', color: '#1a1a1a' },
  Tiktok: { background: '#000000', color: '#ffffff' },
  Spotify: { background: '#1DB954', color: '#ffffff' },
}

const PHASE_TINTS = [0, 0.35, 0.55, -0.2, 0.2] as const

function retroplanningPlatformBase(platform: string): string {
  return platform.includes('::') ? platform.split('::')[0]! : platform
}

export function getRetroplanningPlatformColor(platform: string): string {
  const base = retroplanningPlatformBase(platform)
  return RETROPLANNING_PLATFORM_STYLES[base as RetroplanningPlatform]?.background ?? '#64748b'
}

export function getRetroplanningPlatformStyle(platform: string): PlatformStyle {
  const base = retroplanningPlatformBase(platform)
  return (
    RETROPLANNING_PLATFORM_STYLES[base as RetroplanningPlatform] ?? {
      background: '#64748b',
      color: '#ffffff',
    }
  )
}

export function getRetroplanningPlatformPhaseColor(platformKey: string, phaseIndex: number): string {
  const base = getRetroplanningPlatformColor(platformKey)
  const tint = PHASE_TINTS[Math.min(phaseIndex, PHASE_TINTS.length - 1)] ?? 0
  if (tint === 0) return base
  return adjustColorTint(base, tint)
}
