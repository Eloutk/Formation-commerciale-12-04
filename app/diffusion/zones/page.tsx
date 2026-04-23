'use client'

import dynamic from 'next/dynamic'
import { Loader2, MapPin } from 'lucide-react'

const ZonesDiffusionTool = dynamic(
  () =>
    import('@/components/diffusion/ZonesDiffusionTool').then((m) => ({
      default: m.ZonesDiffusionTool,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-9 w-9 animate-spin text-[#E94C16]" aria-hidden />
        <p className="text-sm font-medium text-foreground">Chargement de l&apos;outil carte…</p>
        <p className="max-w-sm text-xs text-muted-foreground">Quelques secondes selon votre connexion.</p>
      </div>
    ),
  },
)

export default function CarteZonesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#E94C16]/[0.04] via-background to-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 border-b border-border/60 pb-8">
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <MapPin className="h-6 w-6" aria-hidden />
            </span>
            Carte zones
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Composez une ou plusieurs zones (ville et rayon, département, région), consultez l&apos;aperçu sur la carte,
            estimez la population, puis exportez un PDF pour vos présentations.
          </p>
        </header>
        <ZonesDiffusionTool />
      </div>
    </div>
  )
}
