/** Template officiel pour la présentation globale IA — même fichier que /guides/document */
import { GUIDES_DOCUMENT_HREF } from '@/lib/nav-config'
import {
  BASE_PRESENTATION_DOWNLOAD_API,
  BASE_PRESENTATION_KEY_FILENAME,
  BASE_PRESENTATION_PPTX_FILENAME,
} from '@/lib/presentation-documents'

const PPTX_HREF = BASE_PRESENTATION_DOWNLOAD_API.pptx
const KEY_HREF = BASE_PRESENTATION_DOWNLOAD_API.key

export const IA_PRESENTATION_TEMPLATE = {
  title: 'Base de présentation 2026',
  description: 'Base Link Academy — présentation 2026, au choix en PowerPoint ou Keynote',
  /** Téléchargement via API (Vercel Blob). */
  publicPath: PPTX_HREF,
  downloadFilename: BASE_PRESENTATION_PPTX_FILENAME,
  keynotePath: KEY_HREF,
  keynoteDownloadFilename: BASE_PRESENTATION_KEY_FILENAME,
  format: 'powerpoint' as const,
  documentsPagePath: GUIDES_DOCUMENT_HREF,
  downloads: [
    {
      format: 'powerpoint' as const,
      href: PPTX_HREF,
      downloadFilename: BASE_PRESENTATION_PPTX_FILENAME,
    },
    {
      format: 'keynote' as const,
      href: KEY_HREF,
      downloadFilename: BASE_PRESENTATION_KEY_FILENAME,
    },
  ],
} as const

/** Chemin local par défaut — surchargeable via IA_PPTX_TEMPLATE_PATH */
export const IA_PPTX_TEMPLATE_DOWNLOAD_PATH =
  '/Users/emilieoutteryck/Downloads/Base de presentation 2026 ppt.pptx'
