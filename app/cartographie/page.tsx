'use client'

import dynamic from 'next/dynamic'
import { ExternalLink, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MONDAY_DEMANDE_POTENTIEL =
  'https://link599528.monday.com/boards/1397138702/views/28918344'
const MONDAY_POTENTIELS_AUDIENCE = 'https://link599528.monday.com/boards/5025723216'

const ZonesDiffusionTool = dynamic(() => import('@/components/diffusion/ZonesDiffusionTool'), {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-9 w-9 animate-spin text-[#E94C16]" aria-hidden />
        <p className="text-sm font-medium text-foreground">Chargement de l&apos;outil de cartographie…</p>
        <p className="max-w-sm text-xs text-muted-foreground">Quelques secondes selon votre connexion.</p>
      </div>
    ),
  },
)

export default function CartographiePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#E94C16]/[0.04] via-background to-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 border-b border-border/60 pb-8">
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <MapPin className="h-6 w-6" aria-hidden />
            </span>
            Cartographie
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Composez une ou plusieurs zones (ville et rayon, département, région, codes postaux), consultez l&apos;aperçu
            sur la carte et estimez la population.
          </p>
        </header>

        <section
          className="mb-6 rounded-lg border border-[#E94C16]/25 bg-gradient-to-br from-[#E94C16]/[0.06] to-background px-3 py-2.5 shadow-sm sm:px-4 sm:py-3"
          aria-label="Liens Monday.com — potentiels"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-center text-xs font-medium text-foreground sm:text-left sm:shrink-0">
              Potentiels &amp; audience (Monday.com)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 sm:min-w-0 sm:flex-1">
              <Button
                asChild
                size="sm"
                className="h-9 w-full border-0 bg-[#E94C16] px-3 text-xs text-white hover:bg-[#d43f12] sm:w-auto sm:shrink-0"
              >
                <a
                  href={MONDAY_DEMANDE_POTENTIEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  Faire une demande de potentiel
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 w-full border border-[#E94C16] bg-background px-3 text-xs text-[#E94C16] hover:bg-[#E94C16]/10 sm:w-auto sm:shrink-0"
              >
                <a
                  href={MONDAY_POTENTIELS_AUDIENCE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  Potentiels d&apos;audience
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <ZonesDiffusionTool />
      </div>
    </div>
  )
}
