import type { ReactNode } from 'react'
import type { MockupPlatformId } from '@/lib/mockup'
import { ClientAvatar } from '@/components/mockup/MockupShared'

export function StoryProgressBar({ segments = 1, active = 0 }: { segments?: number; active?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }).map((_, index) => (
        <div key={index} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: index < active ? '100%' : index === active ? '65%' : '0%' }}
          />
        </div>
      ))}
    </div>
  )
}

export function InstagramAvatarRing({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[2px]">
      <div className="rounded-full bg-white p-[1.5px]">{children}</div>
    </div>
  )
}

export function InstagramFeedCtaBar({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-neutral-200 px-3 py-2.5">
      <span className="text-[13px] font-semibold text-[#0095F6]">{label}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" aria-hidden>
        <path d="M9.5 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

export function InstagramFeedActions() {
  return (
    <div className="flex items-center justify-between px-3 pb-1 pt-0.5">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
        </svg>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22z" />
        </svg>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </div>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  )
}

export function FacebookEngagementBar() {
  const items = [
    { label: "J'aime", icon: '👍' },
    { label: 'Commenter', icon: '💬' },
    { label: 'Partager', icon: '↗' },
  ]

  return (
    <div className="flex border-t border-neutral-200">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold text-[#65676B]"
        >
          <span className="text-[15px]" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function LinkedInLinkPreviewCard({
  title,
  domain,
  ctaLabel,
}: {
  title: string
  domain: string
  ctaLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-neutral-200 bg-[#F3F2EF] px-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold leading-snug text-neutral-900">{title}</p>
        <p className="truncate text-[12px] text-neutral-500">{domain}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-full border border-[#0A66C2] px-4 py-1.5 text-[14px] font-semibold text-[#0A66C2]"
      >
        {ctaLabel}
      </button>
    </div>
  )
}

export function LinkedInEngagementBar() {
  const items = ["J'aime", 'Commenter', 'Partager']

  return (
    <div className="flex border-t border-neutral-200">
      {items.map((label) => (
        <div
          key={label}
          className="flex flex-1 items-center justify-center gap-1 py-2.5 text-[12px] font-semibold text-neutral-600"
        >
          <span className="text-neutral-500" aria-hidden>
            {label === "J'aime" ? '👍' : label === 'Commenter' ? '💬' : '↗'}
          </span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export function TikTokSideActions({
  clientName,
  logoSrc,
}: {
  clientName: string
  logoSrc?: string | null
}) {
  const items = [
    { count: '991K', type: 'heart' as const },
    { count: '3456', type: 'comment' as const },
    { count: '1256', type: 'share' as const },
  ]

  return (
    <div className="absolute bottom-20 right-2 flex flex-col items-center gap-5">
      <div className="relative mb-1">
        <ClientAvatar
          name={clientName}
          logoSrc={logoSrc}
          size="lg"
          variant="dark"
          bordered
          className="!h-11 !w-11"
        />
        <div className="absolute -bottom-1.5 left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full bg-[#FE2C55] text-[11px] font-bold leading-none text-white">
          +
        </div>
      </div>
      {items.map((item) => (
        <div key={item.type} className="flex flex-col items-center gap-1">
          {item.type === 'heart' ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
            </svg>
          ) : item.type === 'comment' ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
              <path d="M2.01 10.32c0-4.42 4.03-8 9-8s9 3.58 9 8-4.03 8-9 8a9.86 9.86 0 0 1-4.24-.96L2.01 22z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          )}
          <span className="text-[11px] font-semibold text-white">{item.count}</span>
        </div>
      ))}
      <div className="h-9 w-9 rounded-full border-2 border-neutral-900 bg-neutral-800" aria-hidden />
    </div>
  )
}

export function TikTokTopBar() {
  return (
    <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-3 text-white">
      <div className="flex-1" />
      <div className="flex items-center gap-4 text-[15px] font-semibold">
        <span className="text-white/60">Following</span>
        <span className="relative text-white">
          For You
          <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
        </span>
      </div>
      <div className="flex flex-1 justify-end">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
    </div>
  )
}

export function StoryCloseControls() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </div>
  )
}

export function StoryLinkCta({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-[#8B1A1A] shadow-sm">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span>{label.toUpperCase()}</span>
    </div>
  )
}

export function SponsoredMeta({ platform }: { platform: MockupPlatformId }) {
  if (platform === 'linkedin') {
    return <span className="text-[12px] text-neutral-500">Promu</span>
  }

  if (platform === 'snapchat') {
    return <span className="text-[11px] text-white/85">Publicité</span>
  }

  return <span className="text-[11px] text-neutral-500">Sponsorisé</span>
}

export function GlobeIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM1.5 8a6.5 6.5 0 0 1 11.4-4.3 8.4 8.4 0 0 0-2.1 2.1A6.5 6.5 0 0 0 8 1.5 6.5 6.5 0 0 0 1.5 8Zm13 0a6.5 6.5 0 0 1-9.3 5.9 8.4 8.4 0 0 0 2.1-2.1A6.5 6.5 0 0 0 14.5 8Z" />
    </svg>
  )
}
