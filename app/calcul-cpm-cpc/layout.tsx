import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function CalculCpmCpcLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login?redirect=/calcul-cpm-cpc')
  if (!user.isAdmin) redirect('/home')
  return <>{children}</>
}
