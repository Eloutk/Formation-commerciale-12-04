/** Fichiers hébergés sur Vercel Blob (store privé — voir supabase/documents-storage.sql pour historique). */

export const BASE_PRESENTATION_PPTX_FILENAME = 'Base de presentation 2026.pptx'
export const BASE_PRESENTATION_KEY_FILENAME = 'Base de presentation 2026.key'

/** Pathnames exacts dans le store Vercel Blob (tels qu’uploadés). */
export const BASE_PRESENTATION_BLOB_PATHNAMES = {
  pptx: BASE_PRESENTATION_PPTX_FILENAME,
  key: BASE_PRESENTATION_KEY_FILENAME,
} as const

export type BasePresentationDocumentFormat = keyof typeof BASE_PRESENTATION_BLOB_PATHNAMES

export const BASE_PRESENTATION_DOWNLOAD_API = {
  pptx: '/api/documents/base-presentation-2026/pptx',
  key: '/api/documents/base-presentation-2026/key',
} as const

export function isBasePresentationDocumentFormat(
  value: string,
): value is BasePresentationDocumentFormat {
  return value === 'pptx' || value === 'key'
}

export function basePresentationDownloadFilename(
  format: BasePresentationDocumentFormat,
): string {
  return BASE_PRESENTATION_BLOB_PATHNAMES[format]
}
