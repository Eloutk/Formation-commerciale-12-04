import { adjustColorTint } from '@/app/vente/calendar/colors'
import { MEDIA_PLATFORM_STYLES } from '@/lib/media-config'
import type { RetroplanningPlatform } from '@/lib/retroplanning-platforms'

type PlatformStyle = { background: string; color: string }

function mediaStyle(key: keyof typeof MEDIA_PLATFORM_STYLES): PlatformStyle {
  return MEDIA_PLATFORM_STYLES[key]
}

/** Couleurs marque alignées sur Stratégie — Social Media (media-config). */
export const RETROPLANNING_PLATFORM_STYLES: Record<RetroplanningPlatform, PlatformStyle> = {
  META: mediaStyle('Meta'),
  Display: mediaStyle('Display / Programmatique'),
  'Perf max': mediaStyle('Google Ads'),
  'Demand Gen': { background: '#34A853', color: '#ffffff' },
  Search: mediaStyle('Google Ads'),
  'Insta only': { background: '#E1306C', color: '#ffffff' },
  'Facebook only': mediaStyle('Meta'),
  Youtube: mediaStyle('YouTube'),
  LinkedIn: mediaStyle('LinkedIn'),
  Snapchat: mediaStyle('Snapchat'),
  Tiktok: mediaStyle('TikTok'),
  Spotify: { background: '#1DB954', color: '#ffffff' },
}

const PHASE_TINTS = [0, 0.3, 0.5, -0.15, 0.15] as const

function retroplanningPlatformBase(platform: string): string {
  return platform.includes('::') ? platform.split('::')[0]! : platform
}

export function getRetroplanningPlatformColor(platform: string): string {
  const base = retroplanningPlatformBase(platform)
  return RETROPLANNING_PLATFORM_STYLES[base as RetroplanningPlatform]?.background ?? '#94a3b8'
}

export function getRetroplanningPlatformStyle(platform: string): PlatformStyle {
  const base = retroplanningPlatformBase(platform)
  return (
    RETROPLANNING_PLATFORM_STYLES[base as RetroplanningPlatform] ?? {
      background: '#94a3b8',
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
