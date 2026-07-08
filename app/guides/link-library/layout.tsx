import { redirect } from 'next/navigation'
import { getPrimarySessionUser } from '@/lib/media-session'

export default async function LinkLibraryLayout({ children }: { children: React.ReactNode }) {
  const user = await getPrimarySessionUser()
  if (!user) redirect('/login?redirect=/guides/link-library')
  return <>{children}</>
}
