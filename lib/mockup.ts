export type MockupPlatformId = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'snapchat'

export type MockupVisualFormat = 'story' | 'square'

export type MockupCtaId =
  | 'learn_more'
  | 'shop_now'
  | 'sign_up'
  | 'book_now'
  | 'download'
  | 'contact_us'
  | 'get_offer'
  | 'order_now'
  | 'swipe_up'
  | 'see_more'

export type MockupCtaOption = {
  id: MockupCtaId
  label: string
  storyOnly?: boolean
}

export const MOCKUP_CTA_OPTIONS: MockupCtaOption[] = [
  { id: 'learn_more', label: 'En savoir plus' },
  { id: 'shop_now', label: 'Acheter' },
  { id: 'sign_up', label: "S'inscrire" },
  { id: 'book_now', label: 'Réserver' },
  { id: 'download', label: 'Télécharger' },
  { id: 'contact_us', label: 'Nous contacter' },
  { id: 'get_offer', label: "Obtenir l'offre" },
  { id: 'order_now', label: 'Commander' },
  { id: 'see_more', label: 'Voir plus' },
  { id: 'swipe_up', label: 'Swipe up', storyOnly: true },
]

export type MockupPlatform = {
  id: MockupPlatformId
  label: string
  description: string
}

export const MOCKUP_PLATFORMS: MockupPlatform[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Fil ou Story Instagram — publication sponsorisée',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Fil ou Story Facebook — format publicitaire',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Fil LinkedIn — format publication sponsorisée',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Fil TikTok vertical — contenu sponsorisé',
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    description: 'Story Snapchat — publicité verticale',
  },
]

export const MOCKUP_FORMAT_OPTIONS: { id: MockupVisualFormat; label: string; description: string }[] = [
  { id: 'square', label: 'Carré', description: 'Format 1:1 — fil d’actualité / publication' },
  { id: 'story', label: 'Story', description: 'Format 9:16 — plein écran vertical' },
]

export function supportsStoryFormat(platform: MockupPlatformId): boolean {
  return platform === 'instagram' || platform === 'facebook'
}

export function isVerticalOnlyPlatform(platform: MockupPlatformId): boolean {
  return platform === 'tiktok' || platform === 'snapchat'
}

export function getMockupFormatOptions(
  platform: MockupPlatformId,
): { id: MockupVisualFormat; label: string; description: string }[] {
  if (supportsStoryFormat(platform)) return MOCKUP_FORMAT_OPTIONS

  if (isVerticalOnlyPlatform(platform)) {
    return [{ id: 'story', label: 'Vertical', description: 'Format 9:16 — plein écran vertical' }]
  }

  return [MOCKUP_FORMAT_OPTIONS[0]]
}

export function resolveMockupVisualFormat(
  platform: MockupPlatformId,
  visualFormat: MockupVisualFormat,
): MockupVisualFormat {
  const available = getMockupFormatOptions(platform)
  if (available.some((option) => option.id === visualFormat)) return visualFormat
  return available[0]?.id ?? 'square'
}

export function mockupUsesVerticalAspect(platform: MockupPlatformId, visualFormat: MockupVisualFormat): boolean {
  return isVerticalOnlyPlatform(platform) || visualFormat === 'story'
}

export function mockupRootWidthPx(platform: MockupPlatformId, visualFormat: MockupVisualFormat): number {
  const resolved = resolveMockupVisualFormat(platform, visualFormat)
  if (mockupUsesVerticalAspect(platform, resolved)) return 340
  if (platform === 'linkedin') return 552
  if (platform === 'facebook') return 500
  return 390
}

export function clientDisplayName(name: string): string {
  return name.trim() || 'Votre client'
}

export function clientHandle(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
  return slug || 'votreclient'
}

export function clientInitial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'V'
  return trimmed.charAt(0).toUpperCase()
}

export function getMockupCtaOptions(visualFormat: MockupVisualFormat): MockupCtaOption[] {
  if (visualFormat === 'story') return MOCKUP_CTA_OPTIONS
  return MOCKUP_CTA_OPTIONS.filter((option) => !option.storyOnly)
}

export function getMockupCtaLabel(ctaId: MockupCtaId): string {
  return MOCKUP_CTA_OPTIONS.find((option) => option.id === ctaId)?.label ?? 'En savoir plus'
}

export function resolveMockupCta(
  ctaId: MockupCtaId,
  visualFormat: MockupVisualFormat,
): MockupCtaId {
  const available = getMockupCtaOptions(visualFormat)
  if (available.some((option) => option.id === ctaId)) return ctaId
  return available[0]?.id ?? 'learn_more'
}

export function mockupExportFilename(
  clientName: string,
  platform: MockupPlatformId,
  visualFormat: MockupVisualFormat,
  format: 'png' | 'jpeg',
): string {
  const slug = clientHandle(clientName)
  return `mockup-${platform}-${visualFormat}-${slug}.${format === 'jpeg' ? 'jpg' : 'png'}`
}

export function getDefaultMockupCaption(platform: MockupPlatformId, clientName: string): string {
  const displayName = clientDisplayName(clientName)

  switch (platform) {
    case 'instagram':
      return `Découvrez l'univers de ${displayName} — une expérience pensée pour vous.`
    case 'facebook':
      return `${displayName} vous présente sa nouvelle offre. Une campagne conçue pour capter l'attention de votre audience.`
    case 'linkedin':
      return `Chez ${displayName}, nous accompagnons nos clients avec des contenus à forte valeur ajoutée. Voici un aperçu de ce que pourrait donner votre prochaine activation digitale.`
    case 'tiktok':
      return `${displayName} vous présente son offre. Découvrez le contenu sponsorisé dans votre fil.`
    case 'snapchat':
      return `Découvrez l'univers de ${displayName} — une expérience pensée pour vous.`
  }
}

export function resolveMockupCaption(
  customText: string | undefined,
  platform: MockupPlatformId,
  clientName: string,
): string {
  const trimmed = customText?.trim()
  if (trimmed) return trimmed
  return getDefaultMockupCaption(platform, clientName)
}
