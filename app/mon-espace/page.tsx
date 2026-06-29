import { redirect } from 'next/navigation'
import { MON_ESPACE_MES_PROJETS_HREF } from '@/lib/nav-config'

export default function MonEspaceIndexPage() {
  redirect(MON_ESPACE_MES_PROJETS_HREF)
}
