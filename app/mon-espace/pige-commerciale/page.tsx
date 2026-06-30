import { Suspense } from 'react'
import { ScanSearch } from 'lucide-react'
import { PigeCommercialePanel } from '@/components/strategie/PigeCommercialePanel'

export default function PigeCommercialePage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-3 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <ScanSearch className="h-6 w-6" aria-hidden />
            </span>
            Pige commerciale
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Accédez aux bibliothèques d&apos;annonces et archivez vos captures dans votre espace
            personnel.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="py-16 text-center text-muted-foreground">Chargement…</div>
          }
        >
          <PigeCommercialePanel />
        </Suspense>
      </div>
    </div>
  )
}
