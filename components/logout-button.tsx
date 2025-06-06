'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      Se déconnecter
    </Button>
  )
} 