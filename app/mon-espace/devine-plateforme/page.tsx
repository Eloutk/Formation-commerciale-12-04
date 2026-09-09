import { redirect } from 'next/navigation'
import { MON_ESPACE_ADMIN_QUIZZ_HREF } from '@/lib/nav-config'

/** Ancienne URL — redirige vers Admin quizz. */
export default function DevinePlateformeRedirectPage() {
  redirect(MON_ESPACE_ADMIN_QUIZZ_HREF)
}
