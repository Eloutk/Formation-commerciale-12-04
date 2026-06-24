import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function DemandesPotentielsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login?redirect=/formation/demandes-potentiels')
  if (user.isClient) redirect('/diffusion')
  return <>{children}</>
}
