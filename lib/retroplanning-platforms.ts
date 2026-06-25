/** Plateformes proposées dans le rétroplanning stratégie. */
export const RETROPLANNING_PLATFORMS = [
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

export type RetroplanningPlatform = (typeof RETROPLANNING_PLATFORMS)[number]

export type RetroplanningCalendarEntry = {
  id: string
  platform: string
  operationName: string
  startDate: string
  endDate: string
}
