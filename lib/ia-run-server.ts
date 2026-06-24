import type Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient, extractAnthropicText } from '@/lib/anthropic-client'
import { getIaActionSystemHint } from '@/lib/ia-action-prompts'
import { getIaAction, type IaActionId } from '@/lib/ia-actions'
import {
  IA_MAX_IMAGE_BYTES,
  IA_MAX_PDF_BYTES,
  IA_MODEL,
  buildIaSystemPrompt,
} from '@/lib/ia-config'
import { appendMultiPdfAnalysisInstruction, isPdfFile } from '@/lib/ia-pdf'

type RunIaActionParams = {
  actionId: IaActionId
  prePrompt: string
  pdfFiles?: File[]
  clientImage?: File | null
  url?: string | null
  clientName?: string | null
  maxTokens?: number
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchUrlContentAsText(url: string): Promise<string> {
  const normalized = normalizeUrl(url)
  let parsed: URL
  try {
    parsed = new URL(normalized)
  } catch {
    throw new Error('URL invalide.')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Seules les URLs http(s) sont acceptées.')
  }

  const response = await fetch(normalized, {
    headers: {
      'User-Agent': 'LinkAcademy-IA/1.0 (admin analysis)',
      Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(20_000),
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Impossible d'accéder à l'URL (${response.status}).`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const raw = await response.text()
  const text = contentType.includes('html') ? htmlToPlainText(raw) : raw.trim()

  if (!text) {
    throw new Error('Aucun contenu textuel exploitable n’a été extrait de cette URL.')
  }

  return text.slice(0, 80_000)
}

async function readPdfBase64(file: File): Promise<string> {
  if (!isPdfFile(file)) {
    throw new Error('Seuls les fichiers PDF sont acceptés.')
  }
  if (file.size > IA_MAX_PDF_BYTES) {
    throw new Error(`PDF trop volumineux (max ${Math.round(IA_MAX_PDF_BYTES / (1024 * 1024))} Mo).`)
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  return buffer.toString('base64')
}

async function readImageBlock(file: File): Promise<Anthropic.ImageBlockParam> {
  if (!isImageFile(file)) {
    throw new Error('La photo client doit être une image (JPEG, PNG, WebP…).')
  }
  if (file.size > IA_MAX_IMAGE_BYTES) {
    throw new Error(
      `Image trop volumineuse (max ${Math.round(IA_MAX_IMAGE_BYTES / (1024 * 1024))} Mo).`,
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const mediaType =
    file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp'
      ? file.type
      : 'image/jpeg'

  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: mediaType,
      data: base64,
    },
  }
}

export async function runIaAction(params: RunIaActionParams): Promise<string> {
  const action = getIaAction(params.actionId)
  if (!action) throw new Error('Action IA inconnue.')
  if (action.status !== 'available') {
    throw new Error('Cette action n’est pas encore disponible.')
  }

  const prePrompt = params.prePrompt.trim()
  if (!prePrompt) {
    throw new Error('Le pré-prompt est vide. Renseignez une consigne pour cadrer l’analyse.')
  }

  const client = createAnthropicClient()
  const content: Anthropic.ContentBlockParam[] = []

  if (action.inputKind === 'pdf' || action.inputKind === 'pdf_and_image') {
    const pdfFiles = params.pdfFiles ?? []
    if (pdfFiles.length === 0) {
      throw new Error('Veuillez joindre au moins un PDF.')
    }

    for (let index = 0; index < pdfFiles.length; index++) {
      const file = pdfFiles[index]!
      const pdfBase64 = await readPdfBase64(file)
      content.push({
        type: 'text',
        text:
          pdfFiles.length > 1
            ? `--- Document PDF ${index + 1}/${pdfFiles.length} : ${file.name} ---`
            : `--- Document PDF : ${file.name} ---`,
      })
      content.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: pdfBase64,
        },
      })
    }
  }

  if (action.inputKind === 'pdf_and_image') {
    if (!params.clientImage) {
      throw new Error('Veuillez joindre la photo client.')
    }
    content.push(await readImageBlock(params.clientImage))
  }

  if (action.inputKind === 'url') {
    if (!params.url?.trim()) {
      throw new Error('Veuillez renseigner une URL.')
    }
    const pageText = await fetchUrlContentAsText(params.url)
    content.push({
      type: 'text',
      text: `Contenu extrait de l'URL ${normalizeUrl(params.url)} :\n\n${pageText}`,
    })
  }

  const clientBit = params.clientName?.trim()
    ? `Nom du client : ${params.clientName.trim()}\n\n`
    : ''

  const pdfCount = params.pdfFiles?.length ?? 0
  const finalPrompt = appendMultiPdfAnalysisInstruction(prePrompt, pdfCount)

  content.push({
    type: 'text',
    text: `${clientBit}${finalPrompt}`,
  })

  const message = await client.messages.create({
    model: IA_MODEL,
    max_tokens: params.maxTokens ?? 4096,
    system: buildIaSystemPrompt(getIaActionSystemHint(params.actionId)),
    messages: [{ role: 'user', content }],
  })

  const result = extractAnthropicText(message.content)
  if (!result) {
    throw new Error('Claude n’a pas renvoyé de texte analysable.')
  }

  return result
}

export function resolveIaInputLabel(params: {
  actionId: IaActionId
  pdfFiles?: File[]
  url?: string | null
  clientName?: string | null
}): { inputKind: 'pdf' | 'url' | 'pdf_image'; inputLabel: string; inputUrl: string | null } {
  const action = getIaAction(params.actionId)!
  if (action.inputKind === 'url') {
    const normalized = params.url?.trim() ? normalizeUrl(params.url) : ''
    return { inputKind: 'url', inputLabel: normalized, inputUrl: normalized || null }
  }

  const pdfFiles = params.pdfFiles ?? []
  const pdfLabel =
    pdfFiles.length === 0
      ? 'PDF'
      : pdfFiles.length === 1
        ? pdfFiles[0]!.name
        : `${pdfFiles.length} PDF : ${pdfFiles.map((f) => f.name).join(', ')}`

  if (action.inputKind === 'pdf_and_image') {
    return { inputKind: 'pdf_image', inputLabel: pdfLabel, inputUrl: null }
  }
  return {
    inputKind: 'pdf',
    inputLabel: pdfLabel || params.clientName?.trim() || 'PDF',
    inputUrl: null,
  }
}

export { isImageFile, normalizeUrl }
