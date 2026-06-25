import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { StrategieRetroplanningView } from '@/components/strategie/StrategieRetroplanningView'

export default function StrategieRetroplanningPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement…
        </div>
      }
    >
      <StrategieRetroplanningView />
    </Suspense>
  )
}
