import { redirect } from 'next/navigation'
import { Vente2AppShell } from '@/components/vente/Vente2AppShell'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function AdminCalculatorLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login')
  return <Vente2AppShell>{children}</Vente2AppShell>
}
