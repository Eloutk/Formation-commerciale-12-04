export const PLATFORM_COLORS: Record<string, string> = {
  META: '#E94C16',
  Display: '#4285F4',
  'Insta only': '#E4405F',
  Youtube: '#FF0000',
  LinkedIn: '#0A66C2',
  Snapchat: '#FFFC00',
  Tiktok: '#000000',
  Spotify: '#1DB954',
}

export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] ?? '#94a3b8'
}
