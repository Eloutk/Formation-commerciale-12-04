import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function AuthPage() {
  // Redirige vers la page de login pour éviter tout rendu inutile de /auth
  redirect('/login')
}