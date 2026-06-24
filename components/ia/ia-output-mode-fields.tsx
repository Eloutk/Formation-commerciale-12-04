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
                ? 'border-[#E94C16] bg-[#E94C16]/[0.08] ring-1 ring-[#E94C16]/30'
                : 'border-border hover:border-[#E94C16]/40 hover:bg-[#E94C16]/[0.04]',
            )}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <FileType2 className="h-4 w-4 text-[#E94C16]" aria-hidden />
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
                ? 'border-[#E94C16] bg-[#E94C16]/[0.08] ring-1 ring-[#E94C16]/30'
                : 'border-border hover:border-[#E94C16]/40 hover:bg-[#E94C16]/[0.04]',
            )}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <Presentation className="h-4 w-4 text-[#E94C16]" aria-hidden />
              Présentation globale
            </div>
            <p className="text-sm text-muted-foreground">
              Génère un fichier PowerPoint (.pptx) à partir du template « {IA_PRESENTATION_TEMPLATE.title} ».
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
              Template .pptx
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
