'use client'

import Link from 'next/link'
import { adminNavTabClass } from '@/lib/nav-admin-styles'

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
    <Link href={href} onClick={onClick} className={adminNavTabClass(active, className)}>
      {label}
    </Link>
  )
}
