import type { ReactNode } from 'react'
import type { MockupPlatformId } from '@/lib/mockup'
import {
  Bell,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Heart,
  Home,
  LayoutGrid,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Users,
} from 'lucide-react'

export const FEED_SHELL_WIDTH = 390

type MockupFeedShellProps = {
  platform: MockupPlatformId
  children: ReactNode
}

function EmbeddedPost({ children }: { children: ReactNode }) {
  return (
    <div className="[&>div]:!w-full [&>div]:!max-w-none [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
      {children}
    </div>
  )
}

function StoryCircle({ label }: { label: string }) {
  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-1">
      <div className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[2px]">
        <div className="h-[62px] w-[62px] rounded-full border-2 border-white bg-neutral-200" />
      </div>
      <span className="w-full truncate text-center text-[11px] text-neutral-900">{label}</span>
    </div>
  )
}

function InstagramFeedShell({ children }: { children: ReactNode }) {
  const stories = ['lsublime...', 'perrineni...', 'marie.d...', 'studio...', 'link...']

  return (
    <div
      className="mx-auto w-[390px] max-w-full overflow-hidden rounded-[32px] border border-neutral-300 bg-white shadow-lg"
      style={{ width: FEED_SHELL_WIDTH }}
    >
      {/* En-tête */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex shrink-0 items-center gap-0.5 text-[16px] font-semibold text-neutral-900">
          Pour vous
          <ChevronDown className="h-4 w-4 stroke-[2.5]" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#efefef] px-3 py-2 text-[14px] text-neutral-500">
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">Rechercher</span>
        </div>
      </div>

      {/* Stories */}
      <div className="relative border-b border-neutral-100 pb-3">
        <div className="flex gap-3 overflow-hidden px-3 pt-1">
          {stories.map((label) => (
            <StoryCircle key={label} label={label} />
          ))}
        </div>
        <div className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <ChevronRight className="h-4 w-4 text-neutral-700" aria-hidden />
        </div>
      </div>

      {/* Publication */}
      <EmbeddedPost>{children}</EmbeddedPost>

      {/* Barre de navigation */}
      <div className="flex items-center justify-around border-t border-neutral-200 px-2 py-2.5 pb-3">
        <Home className="h-7 w-7 fill-neutral-900 text-neutral-900" aria-hidden />
        <Search className="h-7 w-7 text-neutral-900" aria-hidden />
        <Clapperboard className="h-7 w-7 text-neutral-900" aria-hidden />
        <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-neutral-900">
          <Plus className="h-4 w-4 stroke-[2.5] text-neutral-900" aria-hidden />
        </div>
        <div className="relative">
          <Heart className="h-7 w-7 text-neutral-900" aria-hidden />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3040] px-0.5 text-[10px] font-bold text-white">
            1
          </span>
        </div>
        <div className="h-7 w-7 rounded-full bg-neutral-300" />
      </div>
    </div>
  )
}

function FacebookHeaderIcon({ children, badge }: { children: ReactNode; badge?: string }) {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb]">
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e41e3f] px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </div>
  )
}

function FacebookFeedShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative mx-auto w-[390px] max-w-full overflow-hidden rounded-[32px] border border-neutral-300 bg-[#f0f2f5] shadow-lg"
      style={{ width: FEED_SHELL_WIDTH }}
    >
      {/* Barre supérieure */}
      <div className="flex items-center justify-between bg-white px-3 py-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-[26px] font-bold leading-none text-white">
          f
        </div>
        <div className="flex items-center gap-1.5">
          <FacebookHeaderIcon>
            <Search className="h-5 w-5 text-neutral-900" aria-hidden />
          </FacebookHeaderIcon>
          <FacebookHeaderIcon>
            <LayoutGrid className="h-5 w-5 text-neutral-900" aria-hidden />
          </FacebookHeaderIcon>
          <FacebookHeaderIcon>
            <MessageCircle className="h-5 w-5 text-neutral-900" aria-hidden />
          </FacebookHeaderIcon>
          <FacebookHeaderIcon badge="20+">
            <Bell className="h-5 w-5 text-neutral-900" aria-hidden />
          </FacebookHeaderIcon>
          <div className="relative ml-0.5 h-9 w-9 shrink-0 rounded-full bg-neutral-300">
            <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-white text-neutral-700 shadow-sm" aria-hidden />
          </div>
        </div>
      </div>

      {/* Compositeur */}
      <div className="border-b border-neutral-200 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-300" />
          <div className="min-w-0 flex-1 rounded-full bg-[#f0f2f5] px-4 py-2.5 text-[15px] text-[#65676B]">
            Quoi de neuf, Emilie ?
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl text-[#f3425f]" aria-hidden>
              📹
            </span>
            <span className="text-xl text-[#45bd62]" aria-hidden>
              🖼
            </span>
            <span className="text-xl text-[#f7b928]" aria-hidden>
              😊
            </span>
          </div>
        </div>
      </div>

      {/* Créer une story */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-3 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f3ff]">
          <Plus className="h-6 w-6 stroke-[2.5] text-[#1877F2]" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-neutral-900">Créer une story</p>
          <p className="text-[13px] leading-snug text-[#65676B]">
            Partagez une photo, une vidéo ou un message
          </p>
        </div>
      </div>

      {/* Publication sponsorisée */}
      <div className="border-b border-neutral-200 bg-white">
        <EmbeddedPost>{children}</EmbeddedPost>
      </div>

      {/* Bouton flottant */}
      <div className="pointer-events-none absolute bottom-5 right-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <Pencil className="h-6 w-6 text-neutral-900" aria-hidden />
      </div>

      {/* Espace bas pour le FAB */}
      <div className="h-16 bg-[#f0f2f5]" />
    </div>
  )
}

function LinkedInNavIcon({
  children,
  active,
  badge,
}: {
  children: ReactNode
  active?: boolean
  badge?: string
}) {
  return (
    <div className="relative flex flex-col items-center px-1.5 pt-1">
      <div className="relative flex h-7 w-7 items-center justify-center text-neutral-600">{children}</div>
      {badge ? (
        <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cc1013] px-0.5 text-[9px] font-bold text-white">
          {badge}
        </span>
      ) : null}
      {active ? <span className="mt-0.5 h-0.5 w-full max-w-[28px] rounded-full bg-neutral-900" /> : null}
    </div>
  )
}

function LinkedInFeedShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto w-[390px] max-w-full overflow-hidden rounded-[32px] border border-neutral-300 bg-[#f3f2ef] shadow-lg"
      style={{ width: FEED_SHELL_WIDTH }}
    >
      {/* Barre de navigation */}
      <div className="flex items-center gap-0.5 border-b border-neutral-200 bg-white px-1.5 py-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#0A66C2] text-[14px] font-bold text-white">
          in
        </div>
        <div className="flex min-w-0 flex-1 items-end justify-around">
          <LinkedInNavIcon>
            <Search className="h-[22px] w-[22px]" aria-hidden />
          </LinkedInNavIcon>
          <LinkedInNavIcon active>
            <Home className="h-[22px] w-[22px] fill-neutral-800 text-neutral-800" aria-hidden />
          </LinkedInNavIcon>
          <LinkedInNavIcon>
            <Users className="h-[22px] w-[22px]" aria-hidden />
          </LinkedInNavIcon>
          <LinkedInNavIcon>
            <Briefcase className="h-[20px] w-[20px]" aria-hidden />
          </LinkedInNavIcon>
          <LinkedInNavIcon>
            <MessageCircle className="h-[20px] w-[20px]" aria-hidden />
          </LinkedInNavIcon>
          <LinkedInNavIcon badge="23">
            <Bell className="h-[22px] w-[22px]" aria-hidden />
          </LinkedInNavIcon>
          <div className="mb-1 h-7 w-7 shrink-0 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Commencer un post */}
      <div className="border-b border-neutral-200 bg-white px-3 pb-2.5 pt-2.5">
        <div className="mb-2.5 flex items-center gap-2">
          <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-300" />
          <div className="flex-1 rounded-full border border-neutral-400 px-4 py-2.5 text-[14px] font-semibold text-neutral-600">
            Commencer un post
          </div>
        </div>
        <div className="flex items-center justify-around text-[13px] font-semibold text-neutral-600">
          <span className="flex items-center gap-1.5">
            <span className="text-base text-[#5f9b41]" aria-hidden>
              ▶
            </span>
            Vidéo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-base text-[#0A66C2]" aria-hidden>
              🖼
            </span>
            Photo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-base text-[#e16737]" aria-hidden>
              📄
            </span>
            Rédiger un article
          </span>
        </div>
      </div>

      <div className="px-3 py-2 text-[12px] leading-snug text-neutral-600">
        Sélectionnez la vue du fil d&apos;actualité :{' '}
        <span className="font-semibold text-neutral-800">Les plus pertinents d&apos;abord</span>
        <ChevronDown className="ml-0.5 inline h-3.5 w-3.5 align-middle" aria-hidden />
      </div>

      {/* Publication sponsorisée (mockup client) */}
      <div className="border-b-[8px] border-[#f3f2ef] bg-white">
        <EmbeddedPost>{children}</EmbeddedPost>
      </div>

      {/* Publication suivante (aperçu) */}
      <div className="bg-white opacity-45">
        <div className="flex items-start gap-2 px-3 py-2.5">
          <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200" />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="h-2.5 w-32 rounded bg-neutral-200" />
            <div className="mt-1.5 h-2 w-44 rounded bg-neutral-100" />
          </div>
          <span className="text-[13px] font-semibold text-[#0A66C2]">+ Suivre</span>
        </div>
        <div className="mx-3 mb-2.5 space-y-1">
          <div className="h-2 w-full rounded bg-neutral-100" />
          <div className="h-2 w-2/3 rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

export function MockupFeedShell({ platform, children }: MockupFeedShellProps) {
  switch (platform) {
    case 'instagram':
      return <InstagramFeedShell>{children}</InstagramFeedShell>
    case 'facebook':
      return <FacebookFeedShell>{children}</FacebookFeedShell>
    case 'linkedin':
      return <LinkedInFeedShell>{children}</LinkedInFeedShell>
    default:
      return <>{children}</>
  }
}

export function supportsFeedPreview(
  platform: MockupPlatformId,
  visualFormat: 'story' | 'square',
): boolean {
  return (
    (platform === 'instagram' || platform === 'facebook' || platform === 'linkedin') &&
    visualFormat === 'square'
  )
}
