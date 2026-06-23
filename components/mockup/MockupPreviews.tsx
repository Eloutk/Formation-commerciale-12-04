import Image from 'next/image'
import type { ReactNode } from 'react'
import { MoreHorizontal, Music2 } from 'lucide-react'
import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import { clientDisplayName, clientHandle } from '@/lib/mockup'
import {
  ClientAvatar,
  MockupCtaButton,
  MockupImageArea,
  clientDomain,
  mockupAspectClass,
  mockupRootWidthClass,
  mockupStoryMaxWidth,
} from '@/components/mockup/MockupShared'
import {
  FacebookEngagementBar,
  GlobeIcon,
  InstagramAvatarRing,
  InstagramFeedActions,
  InstagramFeedCtaBar,
  LinkedInEngagementBar,
  LinkedInLinkPreviewCard,
  SponsoredMeta,
  StoryCloseControls,
  StoryLinkCta,
  StoryProgressBar,
  TikTokSideActions,
  TikTokTopBar,
} from '@/components/mockup/MockupPlatformUi'

export type MockupPreviewProps = {
  platform: MockupPlatformId
  clientName: string
  imageSrc: string
  logoSrc?: string | null
  caption: string
  visualFormat: MockupVisualFormat
  ctaLabel: string
}

function StoryShell({
  children,
  platform,
  visualFormat,
  className = '',
}: {
  children: ReactNode
  platform: MockupPlatformId
  visualFormat: MockupVisualFormat
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-black text-white shadow-sm ${mockupStoryMaxWidth(platform, visualFormat)} ${className}`}
    >
      {children}
    </div>
  )
}

function truncateCaption(text: string, maxLength = 90): { visible: string; hasMore: boolean } {
  if (text.length <= maxLength) return { visible: text, hasMore: false }
  return { visible: `${text.slice(0, maxLength).trim()}…`, hasMore: true }
}

export function InstagramFeedMockup({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const handle = clientHandle(clientName)
  const { visible, hasMore } = truncateCaption(caption)
  const rootWidth = mockupRootWidthClass(platform, visualFormat)

  if (visualFormat === 'story') {
    return (
      <StoryShell platform={platform} visualFormat={visualFormat}>
        <div className={`relative ${rootWidth} ${mockupAspectClass('story', platform)}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />

          <div className="absolute left-0 right-0 top-0 space-y-3 px-3 pb-2 pt-3">
            <StoryProgressBar />
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <InstagramAvatarRing>
                  <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" variant="gradient" />
                </InstagramAvatarRing>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{handle}</p>
                  <p className="text-[11px] text-white/80">Sponsorisé • ▶ Développer la story</p>
                </div>
              </div>
              <StoryCloseControls />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-5 pt-16">
            <p className="mb-3 line-clamp-2 text-[14px] leading-snug text-white/95">{caption}</p>
            <StoryLinkCta label={ctaLabel} />
          </div>
        </div>
      </StoryShell>
    )
  }

  return (
    <div
      className={`${rootWidth} max-w-full shrink-0 overflow-hidden rounded-none border border-neutral-200 bg-white text-neutral-900 shadow-sm`}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <InstagramAvatarRing>
            <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" />
          </InstagramAvatarRing>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight">{handle}</p>
            <p className="text-[11px] text-neutral-500">Sponsorisé</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden />
      </div>

      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />
      <InstagramFeedCtaBar label={ctaLabel} />
      <InstagramFeedActions />

      <div className="space-y-1 px-3 pb-3 pt-1">
        <p className="text-[13px] font-semibold">1 248 J&apos;aime</p>
        <p className="text-[13px] leading-snug">
          <span className="font-semibold">{handle}</span> {visible}
          {hasMore ? <span className="text-neutral-500"> more</span> : null}
        </p>
      </div>
    </div>
  )
}

export function FacebookPostMockup({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const { visible, hasMore } = truncateCaption(caption, 80)
  const rootWidth = mockupRootWidthClass(platform, visualFormat)

  if (visualFormat === 'story') {
    return (
      <StoryShell platform={platform} visualFormat={visualFormat}>
        <div className={`relative ${rootWidth} ${mockupAspectClass('story', platform)}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />

          <div className="absolute left-0 right-0 top-0 space-y-3 px-3 pb-2 pt-3">
            <StoryProgressBar />
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" variant="gradient" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{displayName}</p>
                  <p className="flex items-center gap-1 text-[11px] text-white/80">
                    Sponsorisé <span>·</span> <GlobeIcon className="h-3 w-3" />
                  </p>
                </div>
              </div>
              <StoryCloseControls />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-5 pt-16">
            <p className="mb-3 line-clamp-2 text-[14px] leading-snug text-white/95">{caption}</p>
            <StoryLinkCta label={ctaLabel} />
          </div>
        </div>
      </StoryShell>
    )
  }

  return (
    <div
      className={`${rootWidth} max-w-full shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm`}
    >
      <div className="flex items-start justify-between px-3 pt-3">
        <div className="flex items-center gap-2.5">
          <ClientAvatar name={clientName} logoSrc={logoSrc} />
          <div>
            <p className="text-[15px] font-semibold leading-tight">{displayName}</p>
            <p className="flex items-center gap-1 text-[12px] text-[#65676B]">
              Sponsorisé <span>·</span> <GlobeIcon className="h-3 w-3 text-[#65676B]" />
            </p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-[#65676B]" aria-hidden />
      </div>

      <p className="px-3 pb-2 pt-2 text-[15px] leading-snug">
        {visible}
        {hasMore ? <span className="font-semibold text-[#65676B]"> Voir plus</span> : null}
      </p>

      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />

      <div className="px-3 py-2">
        <MockupCtaButton label={ctaLabel} platform="facebook" visualFormat="square" />
      </div>

      <FacebookEngagementBar />
    </div>
  )
}

export function LinkedInPostMockup({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const domain = clientDomain(clientName)
  const linkTitle = caption.length > 60 ? `${caption.slice(0, 60).trim()}…` : caption
  const rootWidth = mockupRootWidthClass(platform, visualFormat)

  return (
    <div
      className={`${rootWidth} max-w-full shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm`}
    >
      <div className="flex items-start justify-between px-3 pt-3">
        <div className="flex items-center gap-2.5">
          <ClientAvatar name={clientName} logoSrc={logoSrc} variant="plain" shape="circle" />
          <div>
            <p className="text-[14px] font-semibold leading-tight">{displayName}</p>
            <p className="text-[12px] text-neutral-500">Promu</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-600" aria-hidden />
      </div>

      <p className="px-3 pb-2 pt-1 text-[14px] leading-snug">{caption}</p>
      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />
      <LinkedInLinkPreviewCard title={linkTitle} domain={domain} ctaLabel={ctaLabel} />
      <LinkedInEngagementBar />
    </div>
  )
}

export function TikTokFeedMockup({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const rootWidth = mockupRootWidthClass(platform, visualFormat)

  return (
    <StoryShell platform={platform} visualFormat={visualFormat} className="border-neutral-800">
      <div className={`relative ${rootWidth} ${mockupAspectClass(visualFormat, platform)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

        <TikTokTopBar />
        <TikTokSideActions clientName={clientName} logoSrc={logoSrc} />

        <div className="absolute bottom-0 left-0 right-14 space-y-2 p-3 pb-4">
          <p className="text-[14px] font-bold">{displayName}</p>
          <p className="text-[13px] leading-snug text-white/95">{caption}</p>
          <span className="inline-block rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium">Sponsorisé</span>
          <p className="flex items-center gap-1.5 text-[12px] text-white/90">
            <Music2 className="h-3.5 w-3.5" aria-hidden />
            Son original — {displayName}
          </p>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <MockupCtaButton label={ctaLabel} platform="tiktok" visualFormat="story" />
      </div>
    </StoryShell>
  )
}

export function SnapchatStoryMockup({
  platform,
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const rootWidth = mockupRootWidthClass(platform, visualFormat)

  return (
    <StoryShell platform={platform} visualFormat={visualFormat} className="border-neutral-800">
      <div className={`relative ${rootWidth} ${mockupAspectClass(visualFormat, platform)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />

        <div className="absolute left-0 right-0 top-0 px-3 pb-2 pt-3">
          <div className="mb-3">
            <StoryProgressBar segments={3} active={0} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" variant="snapchat" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{displayName}</p>
                <SponsoredMeta platform="snapchat" />
              </div>
            </div>
            <StoryCloseControls />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 space-y-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pb-6 pt-20">
          <p className="text-[14px] leading-snug text-white/95">{caption}</p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] uppercase tracking-widest text-white/70">Swipe up</span>
            <span className="text-lg" aria-hidden>
              ↑
            </span>
            <MockupCtaButton label={ctaLabel} platform="snapchat" visualFormat="story" />
          </div>
        </div>
      </div>
    </StoryShell>
  )
}

export function MockupPlatformIcon({ platform }: { platform: MockupPlatformId }) {
  if (platform === 'facebook') {
    return (
      <Image
        src="/images/facebook-logo-facebook-icon-transparent-free-png.webp"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
    )
  }

  if (platform === 'instagram') {
    return (
      <Image
        src="/images/Instagram_logo.svg"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
    )
  }

  if (platform === 'linkedin') {
    return (
      <Image src="/images/Logo LinkedIn.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
    )
  }

  if (platform === 'tiktok') {
    return (
      <Image src="/images/Logo TikTok.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
    )
  }

  if (platform === 'snapchat') {
    return (
      <Image src="/images/Logo Snapchat.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
    )
  }

  return null
}
