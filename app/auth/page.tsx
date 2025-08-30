"use client"

export const dynamic = 'force-dynamic'; // empêche le prerender/caching en prod

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/login")
  }, [router])

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
    </div>
  )
}