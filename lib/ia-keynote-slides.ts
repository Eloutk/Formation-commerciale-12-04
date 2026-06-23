export type ParsedKeynoteSlide = {
  index: number
  title: string
  body: string
  notes: string
}

const SLIDE_HEADER = /^##\s*Slide\s+(\d+)\s*(?:[—–\-:]+\s*|\s*:\s*)(.+)$/im

function extractSection(block: string, label: string): string {
  const pattern = new RegExp(
    `${label}\\s*:\\s*\\n([\\s\\S]*?)(?=\\n[A-Za-zÀ-ÿ][^:\\n]{0,80}:\\s*\\n|$)`,
    'i',
  )
  const match = block.match(pattern)
  return match?.[1]?.trim() ?? ''
}

function extractBulletSection(block: string, label: string): string {
  const raw = extractSection(block, label)
  if (!raw) return ''
  const lines = raw
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
  return lines.join('\n')
}

export function parsePresentationSlides(markdown: string): ParsedKeynoteSlide[] {
  const parts = markdown.split(SLIDE_HEADER).slice(1)
  const slides: ParsedKeynoteSlide[] = []

  for (let i = 0; i < parts.length; i += 3) {
    const index = Number(parts[i])
    const title = String(parts[i + 1] ?? '').trim()
    const block = String(parts[i + 2] ?? '').trim()
    if (!title) continue

    const bodyParts = [
      extractSection(block, 'Objectif de la slide'),
      extractSection(block, 'Message clé'),
      extractBulletSection(block, 'Contenu à intégrer'),
      extractBulletSection(block, 'Chiffres à mettre en avant'),
      extractSection(block, 'Suggestion de visuel'),
    ].filter(Boolean)

    const notes = extractSection(block, 'Note de présentation')

    slides.push({
      index: Number.isFinite(index) ? index : slides.length + 1,
      title,
      body: bodyParts.join('\n\n'),
      notes,
    })
  }

  if (slides.length > 0) return slides

  // Fallback : titres markdown niveau 2
  const fallback = [...markdown.matchAll(/^##\s+(.+)$/gm)]
    .map((match, i) => ({
      index: i + 1,
      title: match[1]!.trim(),
      body: '',
      notes: '',
    }))
    .filter((slide) => slide.title && !/^Slide\s+\d+/i.test(slide.title))

  return fallback.slice(0, 40)
}
