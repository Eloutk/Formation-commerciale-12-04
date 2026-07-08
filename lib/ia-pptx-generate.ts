import fs from 'node:fs/promises'
import path from 'node:path'
import { head } from '@vercel/blob'
import Automizer, { modify, type ISlide } from 'pptx-automizer'
import { IA_PRESENTATION_TEMPLATE, IA_PPTX_TEMPLATE_DOWNLOAD_PATH } from '@/lib/ia-presentation-template'
import {
  getTemplateShapeTargets,
  mapTemplateSlideIndex,
  pickFallbackBodyId,
  shapeExistsOnSlide,
} from '@/lib/ia-presentation-template-shapes'
import { parsePresentationSlides, type ParsedPresentationSlide } from '@/lib/ia-presentation-slides'

export type PptxGenerateResult = {
  filePath: string
  filename: string
  filled: boolean
  slideCount: number
  filledSlideCount: number
  fillError?: string
}

async function downloadTemplateFromBlob(): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN manquant.')
  }

  const pathname = IA_PRESENTATION_TEMPLATE.downloadFilename
  const blob = await head(pathname, { token })
  const cachePath = path.join(process.cwd(), '.generated', 'templates', pathname)
  await fs.mkdir(path.dirname(cachePath), { recursive: true })

  const response = await fetch(blob.downloadUrl)
  if (!response.ok) {
    throw new Error(`Impossible de télécharger le template depuis Vercel Blob (${response.status}).`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(cachePath, buffer)
  return cachePath
}

async function resolveTemplatePath(): Promise<string> {
  const candidates = [
    process.env.IA_PPTX_TEMPLATE_PATH?.trim(),
    path.join(process.cwd(), 'public', IA_PRESENTATION_TEMPLATE.downloadFilename),
    IA_PPTX_TEMPLATE_DOWNLOAD_PATH,
  ].filter((value): value is string => Boolean(value))

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // try next
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      return await downloadTemplateFromBlob()
    } catch {
      // fall through
    }
  }

  throw new Error(
    'Template PowerPoint introuvable. Uploadez « Base de presentation 2026.pptx » sur Vercel Blob, copiez-le dans public/ ou définissez IA_PPTX_TEMPLATE_PATH.',
  )
}

function buildOutputFilename(clientName: string | undefined, analysisId: string): string {
  const safeClient = (clientName ?? 'Client')
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/gi, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
  const date = new Date().toISOString().slice(0, 10)
  return `Presentation-${safeClient || 'Client'}-${date}-${analysisId.slice(0, 8)}.pptx`
}

async function ensureOutputDir(): Promise<string> {
  const dir = path.join(process.cwd(), '.generated', 'ia-presentations')
  await fs.mkdir(dir, { recursive: true })
  return dir
}

function formatSlideBody(data: ParsedPresentationSlide): string {
  const parts = [
    data.objective ? `Objectif : ${data.objective}` : '',
    data.content || data.body,
    data.metrics ? `Chiffres clés :\n${data.metrics}` : '',
    data.visual ? `Visuel suggéré : ${data.visual}` : '',
    data.notes ? `Note orale : ${data.notes}` : '',
  ].filter(Boolean)

  return parts.join('\n\n')
}

function splitBulletLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
}

function applyTextToShape(slide: ISlide, shapeName: string, text: string): void {
  const trimmed = text.trim()
  if (!trimmed) return

  const lines = splitBulletLines(trimmed)
  if (lines.length > 1) {
    slide.modifyElement(shapeName, [
      modify.setMultiText(
        lines.map((line) => ({
          paragraph: { bullet: true, level: 0 },
          textRuns: [{ text: line }],
        })),
      ),
    ])
    return
  }

  slide.modifyElement(shapeName, [modify.setText(trimmed)])
}

async function fillSlideFromData(
  slide: ISlide,
  data: ParsedPresentationSlide,
  templateSlideNum: number,
): Promise<boolean> {
  const textIds = await slide.getAllTextElementIds()
  if (textIds.length === 0) return false

  const targets = getTemplateShapeTargets(templateSlideNum)
  const bodyText = [
    data.keyMessage ? `Message clé : ${data.keyMessage}` : '',
    formatSlideBody(data),
  ]
    .filter(Boolean)
    .join('\n\n')

  let filled = 0

  if (targets.title && data.title && shapeExistsOnSlide(textIds, targets.title)) {
    applyTextToShape(slide, targets.title, data.title)
    filled++
  }

  if (
    targets.subtitle &&
    data.keyMessage &&
    shapeExistsOnSlide(textIds, targets.subtitle)
  ) {
    applyTextToShape(slide, targets.subtitle, data.keyMessage)
    filled++
  }

  const bodyId =
    targets.body && shapeExistsOnSlide(textIds, targets.body)
      ? targets.body
      : pickFallbackBodyId(textIds, targets)

  if (bodyId && bodyText) {
    applyTextToShape(slide, bodyId, bodyText)
    filled++
  }

  if (filled === 0 && data.title) {
    const titleId =
      (targets.title && shapeExistsOnSlide(textIds, targets.title) ? targets.title : undefined) ??
      textIds.find((id) => /titre|aime|texte/i.test(id) && !/PETIT|RAPPEL/i.test(id))

    if (titleId) {
      applyTextToShape(slide, titleId, `${data.title}\n\n${bodyText}`.trim())
      filled++
    }
  }

  return filled > 0
}

async function fillPresentation(
  templatePath: string,
  outputPath: string,
  slides: ParsedPresentationSlide[],
): Promise<{ filledSlideCount: number; error?: string }> {
  const templateDir = path.dirname(templatePath)
  const templateName = path.basename(templatePath)
  const outputDir = path.dirname(outputPath)
  const outputName = path.basename(outputPath)

  const automizer = new Automizer({
    templateDir,
    outputDir,
    removeExistingSlides: true,
    autoImportSlideMasters: true,
    cleanup: true,
    compression: 1,
    verbosity: 0,
  })

  const pres = automizer.loadRoot(templateName).load(templateName, 'template')
  const info = await pres.getInfo()
  const templateSlideCount = info.slidesByTemplate('template')?.length ?? 0

  if (templateSlideCount === 0) {
    return { filledSlideCount: 0, error: 'Le template PowerPoint ne contient aucune slide.' }
  }

  let filledSlideCount = 0

  for (let iaIndex = 0; iaIndex < slides.length; iaIndex++) {
    const slideData = slides[iaIndex]!
    const templateSlideNum = mapTemplateSlideIndex(iaIndex, templateSlideCount)

    pres.addSlide('template', templateSlideNum, (slide: ISlide) => {
      slide.prepare(async () => {
        const ok = await fillSlideFromData(slide, slideData, templateSlideNum)
        if (ok) filledSlideCount++
      })
    })
  }

  try {
    await pres.write(outputName)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ecriture PowerPoint impossible.'
    return { filledSlideCount: 0, error: message }
  }

  try {
    await fs.access(path.join(outputDir, outputName))
  } catch {
    return {
      filledSlideCount: 0,
      error: 'Le fichier PowerPoint n\'a pas pu être généré.',
    }
  }

  if (slides.length > 0 && filledSlideCount === 0) {
    return {
      filledSlideCount: 0,
      error: 'Aucune zone texte remplie dans le template PowerPoint.',
    }
  }

  return { filledSlideCount }
}

async function copyTemplate(outputPath: string): Promise<void> {
  const source = await resolveTemplatePath()
  await fs.copyFile(source, outputPath)
}

export async function generatePptxFromAnalysis(params: {
  analysisMarkdown: string
  clientName?: string | null
  analysisId: string
}): Promise<PptxGenerateResult> {
  const slides = parsePresentationSlides(params.analysisMarkdown)
  const dir = await ensureOutputDir()
  const filename = buildOutputFilename(params.clientName ?? undefined, params.analysisId)
  const outputPath = path.join(dir, filename)

  let filled = false
  let filledSlideCount = 0
  let fillError: string | undefined

  if (slides.length > 0) {
    try {
      const templatePath = await resolveTemplatePath()
      const fillResult = await fillPresentation(templatePath, outputPath, slides)
      filledSlideCount = fillResult.filledSlideCount
      fillError = fillResult.error
      filled = filledSlideCount > 0 && !fillResult.error
    } catch (error) {
      fillError = error instanceof Error ? error.message : 'Generation PowerPoint impossible.'
    }
  } else {
    fillError =
      'Aucune slide detectee dans l analyse IA. Verifiez le format ## Slide X — Titre.'
  }

  if (!filled && slides.length === 0) {
    await copyTemplate(outputPath)
  } else {
    try {
      await fs.access(outputPath)
    } catch {
      fillError =
        fillError ??
        'Le fichier PowerPoint n\'a pas pu être généré. Réessayez dans quelques secondes.'
    }
  }

  return {
    filePath: outputPath,
    filename,
    filled,
    slideCount: slides.length,
    filledSlideCount,
    fillError,
  }
}

export function isPptxGenerationSupported(): boolean {
  return true
}
