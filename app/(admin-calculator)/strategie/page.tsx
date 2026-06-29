import { redirect } from 'next/navigation'
import { STRATEGIE_PLAN_MEDIA_HREF } from '@/lib/nav-config'

export default function StrategiePage() {
  redirect(STRATEGIE_PLAN_MEDIA_HREF)
}
