export type PigeCommercialeSaveRecord = {
  id: string
  user_id: string
  name: string
  comment: string | null
  image_path: string
  original_filename: string
  mime_type: string | null
  file_size: number | null
  created_at: string
  updated_at: string
}

export function formatPigeCommercialeSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDefaultPigeCommercialeName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').trim()
  if (base) return `Pige — ${base}`
  return `Pige — ${new Date().toLocaleDateString('fr-FR')}`
}
