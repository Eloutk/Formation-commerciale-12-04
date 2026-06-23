'use client'

import { useSearchParams } from 'next/navigation'
import { IaActionsPanel } from '@/components/ia/ia-actions-panel'

export default function IaPage() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('analysis')

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">IA</h1>
          <p className="text-muted-foreground">
            Outils d&apos;analyse Claude — réservés aux administrateurs. Les résultats sont
            enregistrés dans Mon espace.
          </p>
        </div>

        <IaActionsPanel initialAnalysisId={analysisId} />
      </div>
    </div>
  )
}
