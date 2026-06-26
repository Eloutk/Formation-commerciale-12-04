import { IA_PRESENTATION_TEMPLATE } from '@/lib/ia-presentation-template'

export type SiteDocument = {
  id: string
  title: string
  description: string
  href: string
  downloadFilename: string
  format: 'pdf' | 'powerpoint' | 'keynote' | 'xlsx'
}

export type SiteDocumentSection = {
  id: string
  title: string
  description: string
  items: SiteDocument[]
}

export const SITE_DOCUMENT_SECTIONS: SiteDocumentSection[] = [
  {
    id: 'guides',
    title: 'Guides',
    description: 'Documentation métier Link Academy — formats, chefferie et performance.',
    items: [
      {
        id: 'guide-formats',
        title: 'Guide des formats',
        description: 'Formats publicitaires, contraintes visuelles et bonnes pratiques — V8.2',
        href: '/Guide des formats visuels et des contraintes V8.2.pdf',
        downloadFilename: 'Guide des formats visuels et des contraintes V8.2.pdf',
        format: 'pdf',
      },
      {
        id: 'guide-chefferie',
        title: 'Guide chefferie de projet',
        description: 'Diffusion, production, Monday, rapports, devis et besoins clients.',
        href: '/Guide de la Chefferie de Projet - V1.pdf',
        downloadFilename: 'Guide de la Chefferie de Projet - V1.pdf',
        format: 'pdf',
      },
      {
        id: 'guide-performance',
        title: 'Guide Perf Max et Gen Ads',
        description: 'Lecture des performances publicitaires et optimisation — V1.2',
        href: '/Guide Performance Ads V1.2.pdf',
        downloadFilename: 'Guide Performance Ads V1.2.pdf',
        format: 'pdf',
      },
    ],
  },
  {
    id: 'presentations',
    title: 'Présentations',
    description: 'Templates pour vos restitutions client et formations.',
    items: [
      {
        id: 'base-presentation-2026',
        title: IA_PRESENTATION_TEMPLATE.title,
        description: IA_PRESENTATION_TEMPLATE.description,
        href: IA_PRESENTATION_TEMPLATE.publicPath,
        downloadFilename: IA_PRESENTATION_TEMPLATE.downloadFilename,
        format: 'powerpoint',
      },
      {
        id: 'formation-studio-2026',
        title: 'Formation studio janvier 2026',
        description: 'Présentation Keynote — version 3.5 LITE',
        href: '/Formation studio janvier 2026 3.5 Version LITE.key',
        downloadFilename: 'Formation studio janvier 2026 3.5 Version LITE.key',
        format: 'keynote',
      },
    ],
  },
  {
    id: 'fiches-plateformes',
    title: 'Fiches plateformes',
    description: 'Synthèses par régie publicitaire.',
    items: [
      'Instagram.pdf',
      'LinkedIn.pdf',
      'Youtube.pdf',
      'Snapchat.pdf',
      'Spotify.pdf',
      'Tiktok.pdf',
      'Search.pdf',
    ].map((filename) => ({
      id: filename.replace('.pdf', '').toLowerCase(),
      title: filename.replace('.pdf', ''),
      description: `Fiche récapitulative ${filename.replace('.pdf', '')}`,
      href: `/${filename}`,
      downloadFilename: filename,
      format: 'pdf' as const,
    })),
  },
]

export function formatDocumentLabel(format: SiteDocument['format']): string {
  if (format === 'powerpoint') return 'PowerPoint'
  if (format === 'keynote') return 'Keynote'
  if (format === 'xlsx') return 'Excel'
  return 'PDF'
}
