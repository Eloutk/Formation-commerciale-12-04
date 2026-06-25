import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Vente2AppShell } from '@/components/vente/Vente2AppShell'
import { getPrimarySessionUser } from '@/lib/media-session'
import { canAccessAdminCalculatorPath } from '@/lib/route-access'

export default async function AdminCalculatorLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login')

  const pathname = headers().get('x-pathname') ?? ''
  if (!canAccessAdminCalculatorPath(pathname, user.role, user.isAdmin)) {
    redirect('/home')
  }

  return <Vente2AppShell>{children}</Vente2AppShell>
}
