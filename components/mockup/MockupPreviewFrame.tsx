'use client'

import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import {
  FacebookPostMockup,
  InstagramFeedMockup,
  LinkedInPostMockup,
  SnapchatStoryMockup,
  TikTokFeedMockup,
} from '@/components/mockup/MockupPreviews'

type MockupPreviewFrameProps = {
  platform: MockupPlatformId
  clientName: string
  imageSrc: string
  logoSrc?: string | null
  caption: string
  visualFormat: MockupVisualFormat
  ctaLabel: string
}

export function MockupPreviewFrame({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewFrameProps) {
  const props = { clientName, imageSrc, logoSrc, caption, visualFormat, ctaLabel }

  switch (platform) {
    case 'instagram':
      return <InstagramFeedMockup {...props} />
    case 'facebook':
      return <FacebookPostMockup {...props} />
    case 'linkedin':
      return <LinkedInPostMockup {...props} />
    case 'tiktok':
      return <TikTokFeedMockup {...props} />
    case 'snapchat':
      return <SnapchatStoryMockup {...props} />
    default:
      return null
  }
}
