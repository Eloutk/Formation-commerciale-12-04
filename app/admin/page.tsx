'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkIsAdmin } from '@/lib/admin'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    ;(async () => {
      const ok = await checkIsAdmin()
      setIsAdmin(ok)
      setLoading(false)
      if (!ok) {
        router.replace('/home')
      }
    })()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Espace Administration</CardTitle>
          <CardDescription>
            Cet espace servira au paramétrage administrateur (page d&apos;accueil, contenus mensuels, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pour l&apos;instant, aucun formulaire n&apos;est disponible ici. Si vous avez besoin de modifier un
            paramètre global, merci de contacter l&apos;équipe en charge de la plateforme.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
