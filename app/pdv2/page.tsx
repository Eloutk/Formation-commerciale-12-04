import { redirect } from 'next/navigation'
import { MON_ESPACE_SOCIAL_HREF } from '@/lib/nav-config'

/** Compat : /pdv2 redirige vers le calculateur Vente 2 (voir next.config.mjs). */
export default function Pdv2RedirectPage() {
  redirect(MON_ESPACE_SOCIAL_HREF)
}
