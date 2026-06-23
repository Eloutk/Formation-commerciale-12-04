'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNavItemClass, adminNavTriggerClass } from '@/lib/nav-admin-styles'
import { openNavLink } from '@/lib/nav-aide'
import type { NavMenuGroup, NavMenuItem } from '@/lib/nav-config'

const triggerClassName = (active?: boolean, accent?: boolean) =>
  cn(
    'inline-flex items-center gap-1 rounded-md px-3 py-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    accent
      ? adminNavTriggerClass(active, true)
      : active
        ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
        : 'hover:bg-accent hover:text-accent-foreground',
  )

const itemClassName = (isActive?: boolean, adminOnly?: boolean) =>
  cn(
    'flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent',
    adminOnly ? adminNavItemClass(isActive) : isActive && 'bg-orange-50 text-orange-700',
  )

export function HeaderNavMenu({
  label,
  active,
  accent = false,
  items,
  groups = [],
  contentClassName = 'w-56',
}: {
  label: string
  active?: boolean
  accent?: boolean
  items: NavMenuItem[]
  groups?: NavMenuGroup[]
  contentClassName?: string
}) {
  const router = useRouter()

  const handleSelect = (href: string) => {
    openNavLink(href, router.push)
  }

  return (
    <div className="group/nav-menu relative">
      <button
        type="button"
        className={triggerClassName(active, accent)}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown
          className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover/nav-menu:rotate-180 group-focus-within/nav-menu:rotate-180"
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'pointer-events-none invisible absolute left-0 top-full z-50 pt-1 opacity-0',
          'transition-[opacity,visibility] duration-150',
          'group-hover/nav-menu:pointer-events-auto group-hover/nav-menu:visible group-hover/nav-menu:opacity-100',
          'group-focus-within/nav-menu:pointer-events-auto group-focus-within/nav-menu:visible group-focus-within/nav-menu:opacity-100',
          contentClassName,
        )}
      >
        {/* Pont invisible entre le bouton et le panneau pour éviter la fermeture au survol */}
        <div className="absolute inset-x-0 -top-2 h-3" aria-hidden />
        <div
          role="menu"
          className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {items.map((item) => (
            <button
              key={item.href}
              type="button"
              role="menuitem"
              className={itemClassName(item.isActive, item.adminOnly)}
              onClick={() => handleSelect(item.href)}
            >
              {item.label}
            </button>
          ))}
          {groups.map((group) => (
            <div key={group.label}>
              {items.length > 0 ? <div className="my-1 h-px bg-border" role="separator" /> : null}
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  role="menuitem"
                  className={itemClassName(item.isActive, item.adminOnly)}
                  onClick={() => handleSelect(item.href)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
