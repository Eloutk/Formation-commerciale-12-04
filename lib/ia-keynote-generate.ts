import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { IA_KEYNOTE_TEMPLATE_ICLOUD_PATH, IA_PRESENTATION_TEMPLATE } from '@/lib/ia-presentation-template'
import { parsePresentationSlides, type ParsedKeynoteSlide } from '@/lib/ia-keynote-slides'

const execFileAsync = promisify(execFile)

export type KeynoteGenerateResult = {
  filePath: string
  filename: string
  filled: boolean
  slideCount: number
  filledSlideCount: number
  fillError?: string
}

type KeynoteFillScriptResult = {
  ok?: boolean
  filledSlides?: number
  totalSlides?: number
  errors?: string[]
  outputPath?: string
}

async function resolveTemplatePath(): Promise<string> {
  const candidates = [
    process.env.IA_KEYNOTE_TEMPLATE_PATH?.trim(),
    path.join(process.cwd(), 'public', IA_PRESENTATION_TEMPLATE.downloadFilename),
    IA_KEYNOTE_TEMPLATE_ICLOUD_PATH,
  ].filter((value): value is string => Boolean(value))

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // try next
    }
  }

  throw new Error(
    'Template Keynote introuvable. Copiez « Base de présentation 2026.key » dans public/ ou définissez IA_KEYNOTE_TEMPLATE_PATH.',
  )
}

function scriptPath(): string {
  return path.join(process.cwd(), 'scripts', 'keynote-fill.jxa.js')
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
  return `Presentation-${safeClient || 'Client'}-${date}-${analysisId.slice(0, 8)}.key`
}

async function ensureOutputDir(): Promise<string> {
  const dir = path.join(process.cwd(), '.generated', 'ia-keynotes')
  await fs.mkdir(dir, { recursive: true })
  return dir
}

async function copyTemplate(outputPath: string): Promise<void> {
  const source = await resolveTemplatePath()
  await fs.copyFile(source, outputPath)
}

function parseFillScriptOutput(stdout: string): KeynoteFillScriptResult | null {
  const trimmed = stdout.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed) as KeynoteFillScriptResult
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}$/)
    if (!jsonMatch) return null
    try {
      return JSON.parse(jsonMatch[0]) as KeynoteFillScriptResult
    } catch {
      return null
    }
  }
}

function formatKeynoteAutomationError(error: unknown): string {
  const parts: string[] = []
  if (error && typeof error === 'object') {
    const err = error as { message?: string; stderr?: string; stdout?: string }
    if (err.message) parts.push(err.message)
    if (err.stderr) parts.push(err.stderr)
    if (err.stdout) parts.push(err.stdout)
  }
  const raw = parts.join('\n')
  if (raw.includes('-1743') || /not authorized|automatisation|automation/i.test(raw)) {
    return 'Keynote a refuse l automatisation. Autorisez Terminal ou Cursor a controler Keynote dans Reglages systeme > Confidentialite > Automatisation.'
  }
  return raw || 'Remplissage Keynote impossible.'
}

async function fillWithKeynote(
  outputPath: string,
  slides: ParsedKeynoteSlide[],
): Promise<{ ok: boolean; filledSlideCount: number; error?: string }> {
  if (process.platform !== 'darwin') {
    return { ok: false, filledSlideCount: 0, error: 'macOS requis pour remplir Keynote.' }
  }

  const payload = {
    templatePath: await resolveTemplatePath(),
    outputPath,
    slides: slides.map((slide) => ({
      title: slide.title,
      body: slide.body,
      notes: slide.notes,
    })),
  }

  const payloadPath = path.join(
    os.tmpdir(),
    `ia-keynote-payload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`,
  )

  try {
    await fs.writeFile(payloadPath, JSON.stringify(payload), 'utf8')

    const { stdout, stderr } = await execFileAsync(
      '/usr/bin/osascript',
      ['-l', 'JavaScript', scriptPath(), payloadPath],
      { timeout: 300_000, maxBuffer: 10 * 1024 * 1024 },
    )

    await fs.access(outputPath)
    const parsed = parseFillScriptOutput(stdout)
    const filledSlideCount = parsed?.filledSlides ?? 0

    if (filledSlideCount === 0) {
      const detail = parsed?.errors?.[0] || stderr.trim() || 'Aucune zone texte remplie dans le template.'
      return { ok: false, filledSlideCount: 0, error: detail }
    }

    return { ok: true, filledSlideCount }
  } catch (error) {
    console.warn('Keynote fill failed, fallback to template copy:', error)
    return { ok: false, filledSlideCount: 0, error: formatKeynoteAutomationError(error) }
  } finally {
    await fs.unlink(payloadPath).catch(() => undefined)
  }
}

export async function generateKeynoteFromAnalysis(params: {
  analysisMarkdown: string
  clientName?: string | null
  analysisId: string
}): Promise<KeynoteGenerateResult> {
  const slides = parsePresentationSlides(params.analysisMarkdown)
  const dir = await ensureOutputDir()
  const filename = buildOutputFilename(params.clientName ?? undefined, params.analysisId)
  const outputPath = path.join(dir, filename)

  let filled = false
  let filledSlideCount = 0
  let fillError: string | undefined

  if (slides.length > 0) {
    const fillResult = await fillWithKeynote(outputPath, slides)
    filled = fillResult.ok
    filledSlideCount = fillResult.filledSlideCount
    fillError = fillResult.error
  } else {
    fillError = 'Aucune slide detectee dans l analyse IA. Verifiez le format ## Slide X — Titre.'
  }

  if (!filled) {
    await copyTemplate(outputPath)
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

export function isKeynoteGenerationSupported(): boolean {
  return process.platform === 'darwin'
}
