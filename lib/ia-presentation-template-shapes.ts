/** Zones texte nommées dans « Base de presentation 2026.pptx » (Link Academy). */
export type TemplateShapeTargets = {
  title?: string
  subtitle?: string
  body?: string
}

export function getTemplateShapeTargets(templateSlideNum: number): TemplateShapeTargets {
  switch (templateSlideNum) {
    case 1:
      return { title: 'titre…' }
    case 4:
      return {
        title: 'on vous aime !',
        subtitle: 'PETIT TITRE DE RAPPEL',
        body: 'description d’un insight…',
      }
    case 5:
      return {
        title: 'on vous aime !',
        subtitle: 'PETIT TITRE DE RAPPEL',
        body: 'rappel sur…',
      }
    default:
      return {
        title: 'on vous aime !',
        subtitle: 'PETIT TITRE DE RAPPEL',
        body: 'description d’un insight…',
      }
  }
}

/** Layouts contenu les plus fiables (zones texte vérifiées). */
export const IA_PPTX_CONTENT_SLIDE_NUMS = [4, 5] as const

/** Choix du layout template selon le type de slide IA. */
export function mapTemplateSlideIndex(iaIndex: number, templateSlideCount: number): number {
  if (templateSlideCount <= 0) return 1
  if (iaIndex === 0) return 1

  const pool = IA_PPTX_CONTENT_SLIDE_NUMS.filter((n) => n <= templateSlideCount)
  const contentSlides = pool.length > 0 ? pool : [Math.min(4, templateSlideCount)]
  return contentSlides[(iaIndex - 1) % contentSlides.length] ?? Math.min(4, templateSlideCount)
}

export function shapeExistsOnSlide(textIds: string[], shapeName: string): boolean {
  if (textIds.includes(shapeName)) return true
  const normalized = shapeName.replace(/…$/, '').trim()
  return textIds.some((id) => id === shapeName || id.startsWith(normalized))
}

export function pickFallbackBodyId(textIds: string[], targets: TemplateShapeTargets): string | undefined {
  const candidates = [
    targets.body,
    targets.subtitle,
    'description d’un insight…',
    'rappel sur…',
    'texte gris 42pt',
    'texte…',
  ].filter(Boolean) as string[]

  for (const name of candidates) {
    if (shapeExistsOnSlide(textIds, name)) return name
  }

  return textIds.find((id) => !/date|version|édition|rectangle|116pt|footer/i.test(id))
}
