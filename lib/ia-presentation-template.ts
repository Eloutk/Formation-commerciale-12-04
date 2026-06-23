/** Template officiel pour la présentation globale IA — même fichier que /documents */
export const IA_PRESENTATION_TEMPLATE = {
  title: 'Base de présentation 2026',
  description: 'Base Keynote Link Academy — présentation 2026',
  /** Fichier servi depuis /public */
  publicPath: '/Base de presentation 2026.key',
  downloadFilename: 'Base de presentation 2026.key',
  format: 'keynote' as const,
  documentsPagePath: '/documents',
} as const

/** Chemin iCloud par défaut (macOS local) — surchargeable via IA_KEYNOTE_TEMPLATE_PATH */
export const IA_KEYNOTE_TEMPLATE_ICLOUD_PATH =
  '/Users/emilieoutteryck/Library/Mobile Documents/com~apple~Keynote/Documents/Base de présentation 2026.key'
