import {
  MOCKUP_FORMAT_OPTIONS,
  MOCKUP_PLATFORMS,
  type MockupCtaId,
  type MockupPlatformId,
  type MockupVisualFormat,
} from '@/lib/mockup'

export type MockupSaveContent = {
  version: 1
  clientName: string
  customText: string
  platform: MockupPlatformId
  visualFormat: MockupVisualFormat
  ctaId: MockupCtaId
  feedPreview: boolean
  imageSrc: string | null
  imageName: string | null
  logoSrc: string | null
  logoName: string | null
}

export type MockupSaveRecord = {
  id: string
  user_id: string
  name: string
  client_name: string
  platform: MockupPlatformId
  content: MockupSaveContent
  preview_png_path: string | null
  created_at: string
  updated_at: string
}

export function formatMockupSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMockupPlatformLabel(platform: MockupPlatformId): string {
  return MOCKUP_PLATFORMS.find((item) => item.id === platform)?.label ?? platform
}

export function formatMockupFormatLabel(content: MockupSaveContent): string {
  return formatMockupVisualFormatLabel(content.platform, content.visualFormat)
}

export function formatMockupVisualFormatLabel(
  platform: MockupPlatformId,
  visualFormat?: string | null,
): string {
  if (platform === 'tiktok' || platform === 'snapchat') return 'Vertical'
  return (
    MOCKUP_FORMAT_OPTIONS.find((item) => item.id === visualFormat)?.label ?? visualFormat ?? '—'
  )
}

export function getDefaultMockupSaveName(clientName: string, platform: MockupPlatformId): string {
  const trimmed = clientName.trim()
  const platformLabel = formatMockupPlatformLabel(platform)
  if (trimmed) return `Mockup ${trimmed} — ${platformLabel}`
  return `Mockup — ${platformLabel}`
}

export function buildMockupSaveContent(params: {
  clientName: string
  customText: string
  platform: MockupPlatformId
  visualFormat: MockupVisualFormat
  ctaId: MockupCtaId
  feedPreview: boolean
  imageSrc: string | null
  imageName: string | null
  logoSrc: string | null
  logoName: string | null
}): MockupSaveContent {
  return {
    version: 1,
    clientName: params.clientName,
    customText: params.customText,
    platform: params.platform,
    visualFormat: params.visualFormat,
    ctaId: params.ctaId,
    feedPreview: params.feedPreview,
    imageSrc: params.imageSrc,
    imageName: params.imageName,
    logoSrc: params.logoSrc,
    logoName: params.logoName,
  }
}
