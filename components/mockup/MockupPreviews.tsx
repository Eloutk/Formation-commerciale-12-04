import Image from 'next/image'
import type { ReactNode } from 'react'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Music2, Send, Share2 } from 'lucide-react'
import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import { clientDisplayName, clientHandle } from '@/lib/mockup'
import {
  ClientAvatar,
  MockupCtaButton,
  MockupImageArea,
  mockupAspectClass,
  mockupStoryMaxWidth,
} from '@/components/mockup/MockupShared'

export type MockupPreviewProps = {
  clientName: string
  imageSrc: string
  logoSrc?: string | null
  caption: string
  visualFormat: MockupVisualFormat
  ctaLabel: string
}

function StoryShell({
  children,
  visualFormat,
  className = '',
}: {
  children: ReactNode
  visualFormat: MockupVisualFormat
  className?: string
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black text-white shadow-sm ${mockupStoryMaxWidth(visualFormat)} ${className}`}
    >
      {children}
    </div>
  )
}

export function InstagramFeedMockup({
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const handle = clientHandle(clientName)

  if (visualFormat === 'story') {
    return (
      <StoryShell visualFormat={visualFormat}>
        <div className={`relative w-full ${mockupAspectClass('story')}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />

          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <ClientAvatar name={clientName} logoSrc={logoSrc} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{handle}</p>
                <p className="text-[11px] text-white/80">Sponsorisé</p>
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden />
          </div>

          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-4 pb-6">
            <p className="text-[13px] leading-snug text-white/95">{caption}</p>
            <MockupCtaButton label={ctaLabel} platform="instagram" visualFormat="story" />
          </div>
        </div>
      </StoryShell>
    )
  }

  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <ClientAvatar name={clientName} logoSrc={logoSrc} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight">{handle}</p>
            <p className="text-[11px] text-neutral-500">Sponsorisé</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden />
      </div>

      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />

      <div className="space-y-2 px-3 py-2.5">
        <MockupCtaButton label={ctaLabel} platform="instagram" visualFormat="square" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6" aria-hidden />
            <MessageCircle className="h-6 w-6" aria-hidden />
            <Send className="h-6 w-6" aria-hidden />
          </div>
          <Bookmark className="h-6 w-6" aria-hidden />
        </div>
        <p className="text-[13px] font-semibold">1 248 J&apos;aime</p>
        <p className="text-[13px] leading-snug">
          <span className="font-semibold">{handle}</span> {caption}
        </p>
      </div>
    </div>
  )
}

export function FacebookPostMockup({
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)

  if (visualFormat === 'story') {
    return (
      <StoryShell visualFormat={visualFormat} className="border-neutral-200">
        <div className={`relative w-full ${mockupAspectClass('story')}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
          <div className="absolute left-0 right-0 top-0 px-3 py-3">
            <p className="text-[13px] font-semibold">{displayName}</p>
            <p className="text-[11px] text-white/80">Sponsorisé</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-4 pb-6">
            <p className="text-[13px] leading-snug">{caption}</p>
            <MockupCtaButton label={ctaLabel} platform="facebook" visualFormat="story" />
          </div>
        </div>
      </StoryShell>
    )
  }

  return (
    <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <div className="flex items-start justify-between px-4 pt-3">
        <div className="flex items-center gap-2.5">
          <ClientAvatar name={clientName} logoSrc={logoSrc} />
          <div>
            <p className="text-[15px] font-semibold leading-tight">{displayName}</p>
            <p className="text-[12px] text-neutral-500">Sponsorisé</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-600" aria-hidden />
      </div>

      <p className="px-4 pb-3 pt-2 text-[15px] leading-snug">{caption}</p>
      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />
      <div className="border-t border-neutral-200 px-4 py-3">
        <MockupCtaButton label={ctaLabel} platform="facebook" visualFormat="square" />
      </div>
    </div>
  )
}

export function LinkedInPostMockup({
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)

  if (visualFormat === 'story') {
    return (
      <StoryShell visualFormat={visualFormat} className="border-neutral-200">
        <div className={`relative w-full ${mockupAspectClass('story')}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
          <div className="absolute left-0 right-0 top-0 px-3 py-3">
            <p className="text-[13px] font-semibold">{displayName}</p>
            <p className="text-[11px] text-white/80">Promu</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-4 pb-6">
            <p className="text-[13px] leading-snug">{caption}</p>
            <MockupCtaButton label={ctaLabel} platform="linkedin" visualFormat="story" />
          </div>
        </div>
      </StoryShell>
    )
  }

  return (
    <div className="w-full max-w-[552px] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <div className="flex items-start justify-between px-4 pt-4">
        <div className="flex items-center gap-2.5">
          <ClientAvatar name={clientName} logoSrc={logoSrc} />
          <div>
            <p className="text-[14px] font-semibold leading-tight">{displayName}</p>
            <p className="text-[12px] text-neutral-500">Promu</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-neutral-600" aria-hidden />
      </div>

      <p className="px-4 pb-3 pt-3 text-[14px] leading-relaxed">{caption}</p>
      <MockupImageArea visualFormat="square" imageSrc={imageSrc} />
      <div className="border-t border-neutral-200 px-4 py-3">
        <MockupCtaButton label={ctaLabel} platform="linkedin" visualFormat="square" />
      </div>
    </div>
  )
}

export function TikTokFeedMockup({
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const handle = clientHandle(clientName)
  const isStory = visualFormat === 'story'

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black text-white shadow-sm ${
        isStory ? 'max-w-[340px]' : 'max-w-[390px]'
      }`}
    >
      <div className={`relative w-full ${mockupAspectClass(visualFormat)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />

        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" variant="dark" bordered />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">@{handle}</p>
              <p className="text-[11px] text-white/80">Sponsorisé</p>
            </div>
          </div>
          <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden />
        </div>

        <div className={`absolute bottom-0 left-0 p-3 pb-4 ${isStory ? 'right-0 space-y-3' : 'right-12'}`}>
          <p className="mb-1 text-[13px] font-semibold">@{handle}</p>
          <p className="text-[13px] leading-snug text-white/95">{caption}</p>
          {isStory ? (
            <MockupCtaButton label={ctaLabel} platform="tiktok" visualFormat="story" />
          ) : (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-white/90">
              <Music2 className="h-3.5 w-3.5" aria-hidden />
              Son original — {displayName}
            </p>
          )}
        </div>

        {!isStory ? (
          <div className="absolute bottom-4 right-2 flex flex-col items-center gap-4">
            <Heart className="h-6 w-6" aria-hidden />
            <MessageCircle className="h-6 w-6" aria-hidden />
            <Share2 className="h-6 w-6" aria-hidden />
          </div>
        ) : null}
      </div>

      {!isStory ? (
        <div className="border-t border-neutral-800 bg-black px-3 py-2.5">
          <MockupCtaButton label={ctaLabel} platform="tiktok" visualFormat="square" />
        </div>
      ) : null}
    </div>
  )
}

export function SnapchatStoryMockup({
  clientName,
  imageSrc,
  logoSrc,
  caption,
  visualFormat,
  ctaLabel,
}: MockupPreviewProps) {
  const displayName = clientDisplayName(clientName)
  const isStory = visualFormat === 'story'

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-black text-white shadow-sm ${
        isStory ? 'max-w-[340px]' : 'max-w-[390px]'
      }`}
    >
      <div className={`relative w-full ${mockupAspectClass(visualFormat)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />

        <div className="absolute left-0 right-0 top-0 px-3 pb-2 pt-3">
          {isStory ? (
            <div className="mb-3 h-0.5 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <ClientAvatar name={clientName} logoSrc={logoSrc} size="sm" variant="snapchat" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{displayName}</p>
                <p className="text-[11px] text-white/85">Publicité</p>
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 space-y-3 p-4 pb-6">
          <p className="text-[14px] leading-snug text-white/95">{caption}</p>
          <MockupCtaButton label={ctaLabel} platform="snapchat" visualFormat={visualFormat} />
        </div>
      </div>
    </div>
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

  if (platform === 'tiktok') {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-black text-[9px] font-bold text-white">
        TT
      </span>
    )
  }

  if (platform === 'snapchat') {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#FFFC00] text-[9px] font-bold text-black">
        SC
      </span>
    )
  }

  const label = platform === 'instagram' ? 'IG' : 'in'
  const className =
    platform === 'instagram'
      ? 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white'
      : 'bg-[#0A66C2] text-white'

  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${className}`}>
      {label}
    </span>
  )
}
