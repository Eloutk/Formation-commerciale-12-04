/** Template officiel pour la présentation globale IA — même fichier que /guides/document */
import { GUIDES_DOCUMENT_HREF } from '@/lib/nav-config'

export const IA_PRESENTATION_TEMPLATE = {
  title: 'Base de présentation 2026',
  description: 'Base PowerPoint Link Academy — présentation 2026',
  /** Fichier servi depuis /public */
  publicPath: '/Base de presentation 2026.pptx',
  downloadFilename: 'Base de presentation 2026.pptx',
  format: 'powerpoint' as const,
  documentsPagePath: GUIDES_DOCUMENT_HREF,
} as const

/** Chemin local par défaut — surchargeable via IA_PPTX_TEMPLATE_PATH */
export const IA_PPTX_TEMPLATE_DOWNLOAD_PATH =
  '/Users/emilieoutteryck/Downloads/Base de presentation 2026 ppt.pptx'
