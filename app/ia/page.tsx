'use client'

import { useSearchParams } from 'next/navigation'
import { IaActionsPanel } from '@/components/ia/ia-actions-panel'
import { IaGenerationProvider } from '@/components/ia/ia-generation-context'
import { isIaActionId } from '@/lib/ia-actions'

export default function IaPage() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('analysis')
  const actionParam = searchParams.get('action')
  const initialActionId = actionParam && isIaActionId(actionParam) ? actionParam : null

  return (
    <IaGenerationProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">IA</h1>
            <p className="text-muted-foreground">
              Outils d&apos;analyse Claude — réservés aux administrateurs. Les résultats sont
              enregistrés dans Mon espace.
            </p>
          </div>

          <IaActionsPanel initialAnalysisId={analysisId} initialActionId={initialActionId} />
        </div>
      </div>
    </IaGenerationProvider>
  )
}
