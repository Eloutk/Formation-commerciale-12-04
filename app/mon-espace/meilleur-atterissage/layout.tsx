import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'
import { MEILLEUR_ATTERISSAGE_HREF } from '@/lib/nav-config'

export default async function MeilleurAtterissageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getPrimarySessionUser()
  if (!user) redirect(`/login?redirect=${MEILLEUR_ATTERISSAGE_HREF}`)
  if (!user.isAdmin) redirect('/home')
  return <>{children}</>
}
