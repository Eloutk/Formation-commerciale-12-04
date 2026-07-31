'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNavItemClass } from '@/lib/nav-admin-styles'
import { openNavLink } from '@/lib/nav-aide'
import type { NavMenuGroup, NavMenuItem } from '@/lib/nav-config'

const childButtonClassName = (
  isActive?: boolean,
  adminOnly?: boolean,
  accent?: boolean,
  doubleBorder?: boolean,
) =>
  cn(
    'flex items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent/80 active:bg-accent',
    doubleBorder &&
      cn(
        'my-0.5 border-2 border-double',
        accent ? 'border-[#E94C16]/55' : 'border-orange-300/80',
        isActive && (accent ? 'border-[#E94C16]' : 'border-orange-500'),
      ),
    adminOnly
      ? adminNavItemClass(isActive)
      : isActive &&
          (accent
            ? 'bg-[#E94C16]/10 font-medium text-[#E94C16]'
            : 'font-medium text-orange-600'),
  )

function NavBadge({ count }: { count?: number }) {
  if (!count || count <= 0) return null
  return (
    <span
      className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#E94C16] px-1.5 text-[10px] font-bold leading-none text-white"
      aria-label={`${count} partage${count > 1 ? 's' : ''} non vu${count > 1 ? 's' : ''}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}

export function MobileNavMenu({
  label,
  active,
  accent = false,
  items,
  groups = [],
  onNavigate,
  badgeCount,
}: {
  label: string
  active?: boolean
  accent?: boolean
  items: NavMenuItem[]
  groups?: NavMenuGroup[]
  onNavigate?: () => void
  badgeCount?: number
}) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleSelect = (href: string) => {
    onNavigate?.()
    openNavLink(href, router.push)
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm font-medium transition-colors',
          accent
            ? cn(
                'text-orange-600 hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950/40',
                active && 'bg-orange-50 text-orange-700',
              )
            : cn(
                'text-foreground hover:bg-accent/80 active:bg-accent',
                active && 'bg-accent text-accent-foreground',
              ),
        )}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          {label}
          <NavBadge count={badgeCount} />
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div
          className={cn(
            'ml-3 mt-0.5 flex flex-col gap-0.5 border-l-2 pl-3',
            accent ? 'border-[#E94C16]/35' : 'border-border',
          )}
        >
          {items.map((item) => (
            <button
              key={item.href}
              type="button"
              className={childButtonClassName(item.isActive, item.adminOnly, accent, item.doubleBorder)}
              onClick={() => handleSelect(item.href)}
            >
              <span>{item.label}</span>
              <NavBadge count={item.badgeCount} />
            </button>
          ))}
          {groups.map((group) => (
            <div key={group.label} className="pt-1">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    className={childButtonClassName(item.isActive, item.adminOnly, accent, item.doubleBorder)}
                    onClick={() => handleSelect(item.href)}
                  >
                    <span>{item.label}</span>
                    <NavBadge count={item.badgeCount} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
