import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login')
  return <>{children}</>
}
