'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const navTabClass =
  'rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground'

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
    <Link href={href} onClick={onClick} className={cn(navTabClass, className)}>
      {label}
    </Link>
  )
}
