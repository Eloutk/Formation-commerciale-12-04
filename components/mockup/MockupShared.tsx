import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import { clientHandle, clientInitial } from '@/lib/mockup'

type ClientAvatarProps = {
  name: string
  logoSrc?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
  bordered?: boolean
  variant?: 'gradient' | 'snapchat' | 'dark' | 'plain'
  shape?: 'circle' | 'square'
}

export function ClientAvatar({
  name,
  logoSrc,
  size = 'md',
  className = '',
  bordered = false,
  variant = 'gradient',
  shape = 'circle',
}: ClientAvatarProps) {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm'
  const shapeClass = shape === 'square' ? 'rounded-md' : 'rounded-full'

  if (logoSrc) {
    return (
      <div
        className={`${sizeClass} shrink-0 overflow-hidden bg-white ${shapeClass} ${
          bordered ? 'border-2 border-white' : 'border border-neutral-200'
        } ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  const variantClass =
    variant === 'snapchat'
      ? 'bg-[#FFFC00] text-black'
      : variant === 'dark'
        ? 'border-2 border-white bg-neutral-800 text-white'
        : variant === 'plain'
          ? 'bg-[#0A66C2] text-white'
          : 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white'

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-semibold ${sizeClass} ${shapeClass} ${variantClass} ${className}`}
    >
      {clientInitial(name)}
    </div>
  )
}

type MockupImageAreaProps = {
  visualFormat: MockupVisualFormat
  imageSrc: string
  className?: string
  fill?: boolean
}

export function mockupAspectClass(
  visualFormat: MockupVisualFormat,
  platform?: MockupPlatformId,
): string {
  if (platform === 'tiktok' || platform === 'snapchat' || visualFormat === 'story') {
    return 'aspect-[9/16]'
  }
  return 'aspect-square'
}

export function mockupRootWidthClass(platform: MockupPlatformId, visualFormat: MockupVisualFormat): string {
  const isVertical = platform === 'tiktok' || platform === 'snapchat' || visualFormat === 'story'
  if (isVertical) return 'w-[340px]'
  if (platform === 'linkedin') return 'w-[552px]'
  if (platform === 'facebook') return 'w-[500px]'
  return 'w-[390px]'
}

export function MockupImageArea({ visualFormat, imageSrc, className = '', fill = false }: MockupImageAreaProps) {
  const aspect = mockupAspectClass(visualFormat)

  if (fill) {
    return (
      <div className={`relative w-full ${aspect} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative w-full ${aspect} bg-neutral-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt="" className="h-full w-full object-cover" />
    </div>
  )
}

type MockupCtaButtonProps = {
  label: string
  platform: MockupPlatformId
  visualFormat: MockupVisualFormat
  className?: string
}

export function MockupCtaButton({ label, platform, visualFormat, className = '' }: MockupCtaButtonProps) {
  if (visualFormat === 'story') {
    if (platform === 'tiktok') {
      return (
        <button
          type="button"
          className={`w-full rounded-sm bg-[#FE2C55] px-4 py-2.5 text-[15px] font-bold text-white ${className}`}
        >
          {label}
        </button>
      )
    }

    if (platform === 'snapchat') {
      return (
        <button
          type="button"
          className={`w-full rounded-full bg-[#FFFC00] px-4 py-2.5 text-[14px] font-bold text-black ${className}`}
        >
          {label}
        </button>
      )
    }

    const isSwipeUp = label.toLowerCase() === 'swipe up'
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-[#8B1A1A] shadow-sm ${className}`}
      >
        {isSwipeUp ? (
          <>
            <span aria-hidden>↑</span>
            <span>{label}</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{label}</span>
          </>
        )}
      </div>
    )
  }

  if (platform === 'facebook') {
    return (
      <button
        type="button"
        className={`w-full rounded-md bg-[#E4E6EB] px-4 py-2.5 text-[15px] font-semibold text-neutral-900 ${className}`}
      >
        {label}
      </button>
    )
  }

  if (platform === 'tiktok') {
    return (
      <button
        type="button"
        className={`w-full rounded-sm bg-[#FE2C55] px-4 py-2.5 text-[15px] font-bold text-white ${className}`}
      >
        {label}
      </button>
    )
  }

  if (platform === 'linkedin') {
    return (
      <button
        type="button"
        className={`shrink-0 rounded-full border border-[#0A66C2] px-4 py-1.5 text-[14px] font-semibold text-[#0A66C2] ${className}`}
      >
        {label}
      </button>
    )
  }

  if (platform === 'snapchat') {
    return (
      <button
        type="button"
        className={`w-full rounded-full bg-[#FFFC00] px-4 py-2.5 text-[14px] font-bold text-black ${className}`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className={`flex items-center justify-between border-t border-neutral-200 px-3 py-2.5 ${className}`}>
      <span className="text-[13px] font-semibold text-[#0095F6]">{label}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" aria-hidden>
        <path d="M9.5 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

export function mockupStoryMaxWidth(
  platform: MockupPlatformId,
  visualFormat: MockupVisualFormat,
): string {
  return `${mockupRootWidthClass(platform, visualFormat)} max-w-full shrink-0`
}

export function clientDomain(name: string): string {
  return `${clientHandle(name)}.fr`
}
