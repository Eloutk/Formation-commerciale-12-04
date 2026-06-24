'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Palette } from 'lucide-react'

export function StudioTarifsPanel() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Palette className="h-8 w-8 text-[#E94C16]" aria-hidden />
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-3">Calculateur Vente 2 — Tarifs studio</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Référentiel tarifaire studio pour chiffrer les prestations créatives Link Academy lors
            de vos briefs et devis.
          </p>
        </div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Grille tarifaire studio</CardTitle>
            <CardDescription>
              Espace réservé aux administrateurs — contenu en cours de structuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Cet onglet centralisera les tarifs studio (création, déclinaisons, motion, options)
              pour faciliter la lecture d&apos;un brief côté commercial.
            </p>
            <p>
              En attendant, vous pouvez consulter la présentation de référence dans{' '}
              <Link href="/documents" className="text-[#E94C16] hover:underline">
                Documents
              </Link>{' '}
              — « Formation studio janvier 2026 ».
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/studio">
                Guide des formats studio
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
