import { redirect } from 'next/navigation'

/** Compat : /pdv2 redirige vers le calculateur Vente 2 (voir next.config.mjs). */
export default function Pdv2RedirectPage() {
  redirect('/calculateur-vente-2')
}
