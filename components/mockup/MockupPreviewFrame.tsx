'use client'

import type { ReactNode } from 'react'
import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import { resolveMockupVisualFormat } from '@/lib/mockup'
import { MockupFeedShell } from '@/components/mockup/MockupFeedShell'
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
  feedPreview?: boolean
}

export function MockupPreviewFrame({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
  feedPreview = false,
}: MockupPreviewFrameProps) {
  const resolvedFormat = resolveMockupVisualFormat(platform, visualFormat)
  const props = {
    platform,
    clientName,
    imageSrc,
    logoSrc,
    caption,
    visualFormat: resolvedFormat,
    ctaLabel,
  }

  let mockup: ReactNode

  switch (platform) {
    case 'instagram':
      mockup = <InstagramFeedMockup {...props} />
      break
    case 'facebook':
      mockup = <FacebookPostMockup {...props} />
      break
    case 'linkedin':
      mockup = <LinkedInPostMockup {...props} />
      break
    case 'tiktok':
      mockup = <TikTokFeedMockup {...props} />
      break
    case 'snapchat':
      mockup = <SnapchatStoryMockup {...props} />
      break
    default:
      return null
  }

  if (feedPreview && resolvedFormat === 'square') {
    return <MockupFeedShell platform={platform}>{mockup}</MockupFeedShell>
  }

  return mockup
}
