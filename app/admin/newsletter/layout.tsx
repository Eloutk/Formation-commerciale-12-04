import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function AdminNewsletterLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login?redirect=/admin/newsletter')
  if (!user.isAdmin) redirect('/home')
  return <>{children}</>
}
