'use client'

import Link from 'next/link'
import { Download, FileType2, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { IaPrezOutputMode } from '@/lib/ia-prez'
import { IA_PRESENTATION_TEMPLATE } from '@/lib/ia-presentation-template'
import { cn } from '@/lib/utils'

type IaOutputModeFieldsProps = {
  outputMode: IaPrezOutputMode
  onOutputModeChange: (mode: IaPrezOutputMode) => void
}

export function IaOutputModeFields({ outputMode, onOutputModeChange }: IaOutputModeFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Format de sortie</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onOutputModeChange('written')}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              outputMode === 'written'
                ? 'border-violet-500 bg-violet-50/80 ring-1 ring-violet-500/30'
                : 'border-border hover:border-violet-300 hover:bg-violet-50/40',
            )}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <FileType2 className="h-4 w-4 text-violet-600" aria-hidden />
              Analyse écrite
            </div>
            <p className="text-sm text-muted-foreground">
              Document structuré en markdown à partir des sources fournies.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onOutputModeChange('presentation')}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              outputMode === 'presentation'
                ? 'border-violet-500 bg-violet-50/80 ring-1 ring-violet-500/30'
                : 'border-border hover:border-violet-300 hover:bg-violet-50/40',
            )}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <Presentation className="h-4 w-4 text-violet-600" aria-hidden />
              Présentation globale
            </div>
            <p className="text-sm text-muted-foreground">
              Génère un fichier Keynote (.key) à partir du template « {IA_PRESENTATION_TEMPLATE.title} ».
            </p>
          </button>
        </div>
      </div>

      {outputMode === 'presentation' ? (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a
              href={IA_PRESENTATION_TEMPLATE.publicPath}
              download={IA_PRESENTATION_TEMPLATE.downloadFilename}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Template .key
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={IA_PRESENTATION_TEMPLATE.documentsPagePath}>Documents</Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
