export const MEDIA_SECTORS = [
  'Institutionnel',
  'Immobilier',
  'Automobile',
  'Distribution',
  'Ameublement & Décoration',
  'Ecole & Formation',
  'Loisir',
  'Food',
  'Service',
  'Transport',
] as const

export type MediaSector = (typeof MEDIA_SECTORS)[number]

export const MEDIA_SECTOR_STYLES: Record<
  MediaSector,
  { background: string; color: string }
> = {
  Institutionnel: { background: '#E8711A', color: '#ffffff' },
  Immobilier: { background: '#4CAF50', color: '#ffffff' },
  Automobile: { background: '#E53935', color: '#ffffff' },
  Distribution: { background: '#8E24AA', color: '#ffffff' },
  'Ameublement & Décoration': { background: '#1E88E5', color: '#ffffff' },
  'Ecole & Formation': { background: '#2E7D32', color: '#ffffff' },
  Loisir: { background: '#5C9FD4', color: '#ffffff' },
  Food: { background: '#A89B2E', color: '#ffffff' },
  Service: { background: '#FBC02D', color: '#1a1a1a' },
  Transport: { background: '#00897B', color: '#ffffff' },
}

export function getMediaSectorStyle(sector: string) {
  return (
    MEDIA_SECTOR_STYLES[sector as MediaSector] ?? {
      background: '#64748b',
      color: '#ffffff',
    }
  )
}

export const MEDIA_PLATFORMS = [
  'Meta',
  'Google Ads',
  'TikTok',
  'LinkedIn',
  'Snapchat',
  'YouTube',
  'Display / Programmatique',
  'SMS/RCS',
] as const

export type MediaPlatform = (typeof MEDIA_PLATFORMS)[number]

export const MEDIA_PLATFORM_STYLES: Record<
  MediaPlatform,
  { background: string; color: string }
> = {
  Meta: { background: '#1877F2', color: '#ffffff' },
  'Google Ads': { background: '#4285F4', color: '#ffffff' },
  TikTok: { background: '#010101', color: '#ffffff' },
  LinkedIn: { background: '#0A66C2', color: '#ffffff' },
  Snapchat: { background: '#FFFC00', color: '#1a1a1a' },
  YouTube: { background: '#FF0000', color: '#ffffff' },
  'Display / Programmatique': { background: '#6366F1', color: '#ffffff' },
  'SMS/RCS': { background: '#0D9488', color: '#ffffff' },
}

export function getMediaPlatformStyle(platform: string) {
  return (
    MEDIA_PLATFORM_STYLES[platform as MediaPlatform] ?? {
      background: '#64748b',
      color: '#ffffff',
    }
  )
}

export const MEDIA_MONTHS = [
  { value: '1', label: 'Janvier' },
  { value: '2', label: 'Février' },
  { value: '3', label: 'Mars' },
  { value: '4', label: 'Avril' },
  { value: '5', label: 'Mai' },
  { value: '6', label: 'Juin' },
  { value: '7', label: 'Juillet' },
  { value: '8', label: 'Août' },
  { value: '9', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
] as const

const currentYear = new Date().getFullYear()

export const MEDIA_YEARS = Array.from({ length: 8 }, (_, i) => String(currentYear - i))

export const MEDIA_BUCKET = 'media-library'

export type MediaAsset = {
  id: string
  storage_path: string
  original_filename: string
  mime_type: string | null
  file_size: number | null
  sectors: string[]
  platforms: string[]
  month: number | null
  year: number | null
  client_name: string
  campaign_name: string
  report_link: string | null
  uploaded_by_id: string
  uploaded_by_name: string | null
  created_at: string
}

export type MediaFilters = {
  sectors?: string[]
  platforms?: string[]
  month?: string
  year?: string
  client_name?: string
  campaign_name?: string
}

export function normalizeMediaSectors(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === 'string' && s.length > 0)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export function normalizeMediaPlatforms(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === 'string' && s.length > 0)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export function formatMediaPeriod(month: number | null, year: number | null): string | null {
  const monthLabel = month
    ? MEDIA_MONTHS.find((m) => Number(m.value) === month)?.label ?? String(month)
    : null

  if (monthLabel && year) return `${monthLabel} ${year}`
  if (year) return String(year)
  if (monthLabel) return monthLabel
  return null
}

export function isMediaAccessDenied(status: number) {
  return status === 401 || status === 403
}

export function buildMediaFilterQuery(filters: MediaFilters): string {
  const params = new URLSearchParams()
  filters.sectors?.forEach((sector) => params.append('sector', sector))
  filters.platforms?.forEach((platform) => params.append('platform', platform))
  if (filters.month) params.set('month', filters.month)
  if (filters.year) params.set('year', filters.year)
  if (filters.client_name) params.set('client_name', filters.client_name)
  if (filters.campaign_name) params.set('campaign_name', filters.campaign_name)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function filterMediaAssets(items: MediaAsset[], filters: MediaFilters): MediaAsset[] {
  const sectors = filters.sectors?.filter(Boolean) ?? []
  const platforms = filters.platforms?.filter(Boolean) ?? []
  const month = filters.month?.trim()
  const year = filters.year?.trim()
  const clientName = filters.client_name?.trim().toLowerCase()
  const campaignName = filters.campaign_name?.trim().toLowerCase()

  return items.filter((item) => {
    if (sectors.length > 0 && !sectors.some((sector) => item.sectors.includes(sector))) {
      return false
    }
    if (platforms.length > 0 && !platforms.some((platform) => item.platforms.includes(platform))) {
      return false
    }
    if (month && item.month !== Number(month)) return false
    if (year && item.year !== Number(year)) return false
    if (clientName && !item.client_name.toLowerCase().includes(clientName)) return false
    if (campaignName && !item.campaign_name.toLowerCase().includes(campaignName)) return false
    return true
  })
}
