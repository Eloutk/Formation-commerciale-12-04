import type { MockupPlatformId, MockupVisualFormat } from '@/lib/mockup'
import { clientInitial } from '@/lib/mockup'

type ClientAvatarProps = {
  name: string
  logoSrc?: string | null
  size?: 'sm' | 'md'
  className?: string
  bordered?: boolean
  variant?: 'gradient' | 'snapchat' | 'dark'
}

export function ClientAvatar({
  name,
  logoSrc,
  size = 'md',
  className = '',
  bordered = false,
  variant = 'gradient',
}: ClientAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm'

  if (logoSrc) {
    return (
      <div
        className={`${sizeClass} shrink-0 overflow-hidden rounded-full bg-white ${
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
        : 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClass} ${variantClass} ${className}`}
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

export function mockupAspectClass(visualFormat: MockupVisualFormat): string {
  return visualFormat === 'story' ? 'aspect-[9/16]' : 'aspect-square'
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
    const isSwipeUp = label.toLowerCase() === 'swipe up'
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-black shadow-sm ${className}`}
      >
        {isSwipeUp ? (
          <>
            <span aria-hidden>↑</span>
            <span>{label}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </div>
    )
  }

  if (platform === 'facebook') {
    return (
      <button
        type="button"
        className={`w-full rounded-md bg-[#E4E6EB] px-4 py-2.5 text-[14px] font-semibold text-neutral-900 ${className}`}
      >
        {label}
      </button>
    )
  }

  if (platform === 'linkedin') {
    return (
      <button
        type="button"
        className={`w-full rounded-full border border-[#0A66C2] px-4 py-2 text-[14px] font-semibold text-[#0A66C2] ${className}`}
      >
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`w-full rounded-lg bg-[#0095F6] px-4 py-2.5 text-[14px] font-semibold text-white ${className}`}
    >
      {label}
    </button>
  )
}

export function mockupStoryMaxWidth(visualFormat: MockupVisualFormat): string {
  return visualFormat === 'story' ? 'max-w-[340px]' : 'max-w-[390px]'
}
