/** Plateformes et objectifs — source unique (calculateur Social media / Mon espace). */

export const PLATFORMS_ORDER = [
  'META',
  'Display',
  'Perf max',
  'Demand Gen',
  'Search',
  'Insta only',
  'Facebook only',
  'Youtube',
  'LinkedIn',
  'Snapchat',
  'Tiktok',
  'Spotify',
] as const

export type SocialMediaPlatform = (typeof PLATFORMS_ORDER)[number]

export const META_CUSTOM_OBJECTIVES = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Intéractions',
  'Visites de profil',
  'Réponses évènement',
  'Leads',
] as const

export const INSTA_CUSTOM_OBJECTIVES = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Intéractions',
  'Visites de profil',
] as const

export const DEFAULT_CUSTOM_OBJECTIVES = ['Impressions', 'Clics'] as const

export const TIKTOK_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'conversion'] as const

export const LINKEDIN_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'Leads', 'Likes'] as const

export const SEARCH_CUSTOM_OBJECTIVES = ['Clics', 'Conversion'] as const

export const PERF_MAX_OBJECTIVES = ['Conversion'] as const

export const CUSTOM_OBJECTIVES: Record<SocialMediaPlatform, readonly string[]> = {
  META: META_CUSTOM_OBJECTIVES,
  'Facebook only': META_CUSTOM_OBJECTIVES,
  Display: DEFAULT_CUSTOM_OBJECTIVES,
  'Perf max': PERF_MAX_OBJECTIVES,
  'Demand Gen': DEFAULT_CUSTOM_OBJECTIVES,
  Search: SEARCH_CUSTOM_OBJECTIVES,
  'Insta only': INSTA_CUSTOM_OBJECTIVES,
  Youtube: ['Impressions'],
  LinkedIn: LINKEDIN_CUSTOM_OBJECTIVES,
  Snapchat: DEFAULT_CUSTOM_OBJECTIVES,
  Tiktok: TIKTOK_CUSTOM_OBJECTIVES,
  Spotify: ['Impressions'],
}

export const PLATFORM_LOGOS: Partial<Record<SocialMediaPlatform, string>> = {
  META: '/images/Logo META.png',
  'Facebook only': '/images/facebook-logo-facebook-icon-transparent-free-png.webp',
  Display: '/images/Logo Google.png',
  'Perf max': '/images/Logo Google.png',
  'Demand Gen': '/images/Logo Google.png',
  Search: '/images/Logo Google.png',
  Youtube: '/images/Logo YouTube.png',
  LinkedIn: '/images/Logo LinkedIn.png',
  Snapchat: '/images/Logo Snapchat.png',
  Tiktok: '/images/Logo TikTok.png',
  Spotify: '/images/Logo Spotify.png',
  'Insta only': '/images/Instagram_logo.svg',
}

export function usesMetaObjectives(platform: string): boolean {
  return platform === 'META' || platform === 'Facebook only'
}

/** Objectifs sélectionnables pour une plateforme (aligné sur le calculateur Social media). */
export function getObjectivesForSocialMediaPlatform(platform: string): readonly string[] {
  if (usesMetaObjectives(platform)) {
    return [...META_CUSTOM_OBJECTIVES, 'conversion']
  }
  return CUSTOM_OBJECTIVES[platform as SocialMediaPlatform] ?? DEFAULT_CUSTOM_OBJECTIVES
}

export function getDefaultObjectiveForPlatform(platform: string): string {
  if (platform === 'Perf max') return 'Conversion'
  return getObjectivesForSocialMediaPlatform(platform)[0] ?? 'Impressions'
}
