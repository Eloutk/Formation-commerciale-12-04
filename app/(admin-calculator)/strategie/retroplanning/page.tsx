import { Suspense } from 'react'
import { SavedRecordLoadingBanner } from '@/components/ui/saved-record-loading-banner'
import { StrategieRetroplanningView } from '@/components/strategie/StrategieRetroplanningView'

export default function StrategieRetroplanningPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <SavedRecordLoadingBanner
            className="my-8"
            label="Chargement du rétroplanning…"
            description="Préparation de la page Stratégie — Rétroplanning."
          />
        </div>
      }
    >
      <StrategieRetroplanningView />
    </Suspense>
  )
}
