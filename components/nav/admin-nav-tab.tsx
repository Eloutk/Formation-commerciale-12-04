'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AdminNavTab({
  href,
  label,
  active,
  className,
  onClick,
}: {
  href: string
  label: string
  active?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'rounded-md px-3 py-2 font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700',
        active && 'bg-orange-50',
        className,
      )}
    >
      {label}
    </Link>
  )
}
