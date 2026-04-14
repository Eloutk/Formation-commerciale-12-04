import { redirect } from 'next/navigation'

/** Compat : /pdv2 redirige vers l’outil Vente (voir next.config.mjs). */
export default function Pdv2RedirectPage() {
  redirect('/vente2')
}
