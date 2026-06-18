'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { openNavLink } from '@/lib/nav-aide'
import type { NavMenuGroup, NavMenuItem } from '@/lib/nav-config'

const triggerClassName = (active?: boolean, accent?: boolean) =>
  cn(
    'inline-flex items-center gap-1 rounded-md px-3 py-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    accent || active
      ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
      : 'hover:bg-accent hover:text-accent-foreground',
  )

const itemClassName = (isActive?: boolean) =>
  cn('cursor-pointer', isActive && 'bg-orange-50 text-orange-700')

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={triggerClassName(active, accent)}>
          {label}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={contentClassName}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.href}
            className={itemClassName(item.isActive)}
            onSelect={() => handleSelect(item.href)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
        {groups.map((group) => (
          <div key={group.label}>
            {items.length > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.items.map((item) => (
              <DropdownMenuItem
                key={item.href}
                className={itemClassName(item.isActive)}
                onSelect={() => handleSelect(item.href)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
