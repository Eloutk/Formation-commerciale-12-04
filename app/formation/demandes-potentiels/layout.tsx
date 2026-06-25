import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'
import { canAccessDemandesPotentiels, DEMANDES_POTENTIELS_HREF } from '@/lib/roles'

export default async function DemandesPotentielsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getPrimarySessionUser()
  if (!user) redirect(`/login?redirect=${DEMANDES_POTENTIELS_HREF}`)
  if (!canAccessDemandesPotentiels(user.role)) redirect('/diffusion')
  return <>{children}</>
}
