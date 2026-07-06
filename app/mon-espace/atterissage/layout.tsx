import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'
import { ATTERRISSAGE_HREF } from '@/lib/nav-config'

export default async function AtterrissageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getPrimarySessionUser()
  if (!user) redirect(`/login?redirect=${ATTERRISSAGE_HREF}`)
  if (!user.isAdmin) redirect('/home')
  return <>{children}</>
}
