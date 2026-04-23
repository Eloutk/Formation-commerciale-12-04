'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

const ZonesDiffusionTool = dynamic(
  () =>
    import('@/components/diffusion/ZonesDiffusionTool').then((m) => ({
      default: m.ZonesDiffusionTool,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground py-10 text-center">Chargement de la carte…</p>
    ),
  },
)

export default function CarteZonesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <MapPin className="h-7 w-7 shrink-0 text-[#E94C16]" aria-hidden />
          Carte zones
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Visualisez une zone autour d&apos;une ville et d&apos;un rayon, un département ou une région. Exportez une
          image pour vos présentations clients.
        </p>
      </div>
      <ZonesDiffusionTool />
    </div>
  )
}
