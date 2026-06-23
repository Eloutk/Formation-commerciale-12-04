'use client'

import { FileText, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  formatIaMaxPdfPerFileMb,
  formatIaMaxPdfTotalMb,
  mergeIaPdfFiles,
  validateIaPdfFiles,
} from '@/lib/ia-pdf'
import { IA_MAX_PDF_FILES } from '@/lib/ia-config'

type IaPdfUploadFieldProps = {
  files: File[]
  onFilesChange: (files: File[]) => void
  onError?: (message: string | null) => void
  idPrefix?: string
}

export function IaPdfUploadField({
  files,
  onFilesChange,
  onError,
  idPrefix = 'ia-pdf',
}: IaPdfUploadFieldProps) {
  const handlePick = (incoming: FileList | null) => {
    if (!incoming?.length) return
    const merged = mergeIaPdfFiles(files, Array.from(incoming))
    const validationError = validateIaPdfFiles(merged)
    if (validationError) {
      onError?.(validationError)
      return
    }
    onError?.(null)
    onFilesChange(merged)
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
    onError?.(null)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-input`}>
        Documents PDF ({files.length}/{IA_MAX_PDF_FILES}) — max {formatIaMaxPdfPerFileMb()} Mo
        / fichier, {formatIaMaxPdfTotalMb()} Mo au total
      </Label>
      <input
        id={`${idPrefix}-input`}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(event) => {
          handlePick(event.target.files)
          event.target.value = ''
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="justify-start gap-2"
          disabled={files.length >= IA_MAX_PDF_FILES}
          onClick={() => document.getElementById(`${idPrefix}-input`)?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {files.length === 0 ? 'Importer des PDF' : 'Ajouter des PDF'}
        </Button>
      </div>
      {files.length > 0 ? (
        <ul className="space-y-2 rounded-md border bg-muted/20 p-3">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)} Mo
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(index)}
                aria-label={`Retirer ${file.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          Plusieurs PDF possibles — l&apos;analyse croisera les informations et fera des liens entre
          les documents.
        </p>
      )}
    </div>
  )
}
