export type ParsedPresentationSlide = {
  index: number
  title: string
  objective: string
  keyMessage: string
  content: string
  body: string
  metrics: string
  visual: string
  notes: string
}

/** @deprecated Alias historique */
export type ParsedKeynoteSlide = ParsedPresentationSlide

const SLIDE_HEADER =
  /^#{2,3}\s*(?:Slide\s+)?(\d+)\s*(?:[—–\-:]+\s*|\s*:\s*|\s+-\s+|\.\s*)(.+)$/gim

const EXCLUDED_SECTIONS =
  /^formulation client-ready|^règles finales|^recommandations pour la suite$/i

function extractSection(block: string, label: string): string {
  const pattern = new RegExp(
    `(?:\\*\\*)?${label}(?:\\*\\*)?\\s*:\\s*\\n([\\s\\S]*?)(?=\\n(?:#{1,3}\\s|\\*\\*[A-Za-zÀ-ÿ]|[-*•\\d]|\\n(?:Objectif|Message|Contenu|Chiffres|Suggestion|Note)[^:\\n]*:\\s*\\n|$))`,
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

function buildSlide(index: number, title: string, block: string): ParsedPresentationSlide {
  const objective = extractSection(block, 'Objectif de la slide')
  const keyMessage = extractSection(block, 'Message clé')
  const content = extractBulletSection(block, 'Contenu à intégrer')
  const metrics = extractBulletSection(block, 'Chiffres à mettre en avant')
  const visual = extractSection(block, 'Suggestion de visuel')
  const notes = extractSection(block, 'Note de présentation')

  const bodyParts = [objective, content, metrics].filter(Boolean)

  return {
    index,
    title,
    objective,
    keyMessage,
    content,
    body: bodyParts.join('\n\n'),
    metrics,
    visual,
    notes,
  }
}

function stripAnalysisPreamble(markdown: string): string {
  const firstSlide = markdown.search(/^#{2,3}\s*(?:Slide\s+)?\d+/im)
  if (firstSlide <= 0) return markdown
  return markdown.slice(firstSlide)
}

function parseFromSectionHeaders(markdown: string): ParsedPresentationSlide[] {
  const slides: ParsedPresentationSlide[] = []
  const headerPattern = /^##\s+(.+)$/gm
  const matches = [...markdown.matchAll(headerPattern)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]!
    const title = match[1]!.trim()
    if (!title || /^Slide\s+\d+/i.test(title)) continue
    if (EXCLUDED_SECTIONS.test(title)) continue

    const start = (match.index ?? 0) + match[0].length
    const next = matches[i + 1]
    const block = markdown.slice(start, next?.index ?? markdown.length).trim()

    slides.push({
      index: slides.length + 1,
      title,
      objective: '',
      keyMessage: '',
      content: block,
      body: block,
      metrics: '',
      visual: '',
      notes: '',
    })
  }

  return slides.slice(0, 40)
}

export function parsePresentationSlides(markdown: string): ParsedPresentationSlide[] {
  const source = stripAnalysisPreamble(markdown.trim())
  const slides: ParsedPresentationSlide[] = []
  const matches = [...source.matchAll(SLIDE_HEADER)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]!
    const index = Number(match[1])
    const title = String(match[2] ?? '').trim()
    if (!title) continue

    const start = (match.index ?? 0) + match[0].length
    const next = matches[i + 1]
    const block = source.slice(start, next?.index ?? source.length).trim()

    slides.push(
      buildSlide(Number.isFinite(index) ? index : slides.length + 1, title, block),
    )
  }

  if (slides.length > 0) return slides

  const altHeader = /^#{2,3}\s*(\d+)[.)]\s*(.+)$/gm
  const altMatches = [...source.matchAll(altHeader)]
  for (const match of altMatches) {
    const title = String(match[2] ?? '').trim()
    if (!title) continue
    const start = (match.index ?? 0) + match[0].length
    const next = altMatches.find((m) => (m.index ?? 0) > (match.index ?? 0))
    const block = source.slice(start, next?.index ?? source.length).trim()
    slides.push(buildSlide(Number(match[1]), title, block))
  }

  if (slides.length > 0) return slides

  return parseFromSectionHeaders(source)
}
