'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNavItemClass } from '@/lib/nav-admin-styles'
import { openNavLink } from '@/lib/nav-aide'
import type { NavMenuGroup, NavMenuItem } from '@/lib/nav-config'

const childButtonClassName = (isActive?: boolean, adminOnly?: boolean) =>
  cn(
    'rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent/80 active:bg-accent',
    adminOnly
      ? adminNavItemClass(isActive)
      : isActive && 'font-medium text-orange-600',
  )

export function MobileNavMenu({
  label,
  active,
  accent = false,
  items,
  groups = [],
  onNavigate,
}: {
  label: string
  active?: boolean
  accent?: boolean
  items: NavMenuItem[]
  groups?: NavMenuGroup[]
  onNavigate?: () => void
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
            ? 'text-orange-600 hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950/40'
            : 'text-foreground hover:bg-accent/80 active:bg-accent',
        )}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {label}
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
              className={childButtonClassName(item.isActive, item.adminOnly)}
              onClick={() => handleSelect(item.href)}
            >
              {item.label}
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
                    className={childButtonClassName(item.isActive, item.adminOnly)}
                    onClick={() => handleSelect(item.href)}
                  >
                    {item.label}
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
