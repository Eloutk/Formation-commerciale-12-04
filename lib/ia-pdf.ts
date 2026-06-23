import { IA_MAX_PDF_BYTES, IA_MAX_PDF_FILES, IA_MAX_PDF_TOTAL_BYTES } from '@/lib/ia-config'

export function isPdfFile(file: File): boolean {
  if (file.type === 'application/pdf') return true
  return file.name.toLowerCase().endsWith('.pdf')
}

export function formatIaMaxPdfPerFileMb(): number {
  return Math.round(IA_MAX_PDF_BYTES / (1024 * 1024))
}

export function formatIaMaxPdfTotalMb(): number {
  return Math.round(IA_MAX_PDF_TOTAL_BYTES / (1024 * 1024))
}

export function validateIaPdfFiles(files: File[]): string | null {
  if (files.length === 0) {
    return 'Veuillez joindre au moins un PDF.'
  }
  if (files.length > IA_MAX_PDF_FILES) {
    return `Maximum ${IA_MAX_PDF_FILES} PDF par analyse.`
  }

  let total = 0
  for (const file of files) {
    if (!isPdfFile(file)) {
      return `« ${file.name} » n'est pas un PDF valide.`
    }
    if (file.size > IA_MAX_PDF_BYTES) {
      return `« ${file.name} » dépasse ${formatIaMaxPdfPerFileMb()} Mo.`
    }
    total += file.size
  }

  if (total > IA_MAX_PDF_TOTAL_BYTES) {
    return `Volume total des PDF limité à ${formatIaMaxPdfTotalMb()} Mo (actuellement ${(total / (1024 * 1024)).toFixed(1)} Mo).`
  }

  return null
}

export function mergeIaPdfFiles(existing: File[], incoming: File[]): File[] {
  const merged = [...existing]
  for (const file of incoming) {
    const duplicate = merged.some(
      (item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified,
    )
    if (!duplicate) merged.push(file)
  }
  return merged.slice(0, IA_MAX_PDF_FILES)
}

export function appendMultiPdfAnalysisInstruction(prompt: string, pdfCount: number): string {
  if (pdfCount <= 1) return prompt

  return `${prompt}

---

**Plusieurs documents PDF fournis (${pdfCount})**

Croise les informations entre tous les documents : compare, synthétise, mets en évidence convergences, contradictions et complémentarités.
Fais des liens explicites entre les sources (ex. « selon le document 1… », « confirmé par le document 2… »).
Si une information n'apparaît que dans un seul document, indique-le clairement.`
}
