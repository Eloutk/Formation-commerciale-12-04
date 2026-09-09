import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'
import { MON_ESPACE_ADMIN_QUIZZ_HREF } from '@/lib/nav-config'

export default async function AdminQuizzLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getPrimarySessionUser()
  if (!user) redirect(`/login?redirect=${MON_ESPACE_ADMIN_QUIZZ_HREF}`)
  if (!user.isAdmin) redirect('/home')
  return <>{children}</>
}
