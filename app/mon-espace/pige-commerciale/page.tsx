import { Suspense } from 'react'
import { PigeCommercialePanel } from '@/components/strategie/PigeCommercialePanel'

export default function PigeCommercialePage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Pige commerciale</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
