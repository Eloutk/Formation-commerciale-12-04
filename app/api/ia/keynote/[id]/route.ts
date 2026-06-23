import { NextResponse } from 'next/server'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { getServerSupabase, requireAdminSessionUser } from '@/lib/media-session'
import { generateKeynoteFromAnalysis, isKeynoteGenerationSupported, type KeynoteGenerateResult } from '@/lib/ia-keynote-generate'
import { buildContentDisposition } from '@/lib/http-download-headers'
import { IA_ANALYSIS_PUBLIC_COLUMNS } from '@/lib/ia-pre-prompt-server'

export const runtime = 'nodejs'
export const maxDuration = 300

type RouteContext = { params: { id: string } }

export async function GET(req: Request, context: RouteContext) {
  const auth = await requireAdminSessionUser(req)
  if (auth.status === 401) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }
  if (auth.status === 403) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
  }

  const analysisId = context.params.id
  if (!analysisId) {
    return NextResponse.json({ error: 'Analyse introuvable.' }, { status: 404 })
  }

  const supabase = await getServerSupabase(req)
  const { data, error } = await supabase
    .from('ia_analyses')
    .select(IA_ANALYSIS_PUBLIC_COLUMNS)
    .eq('id', analysisId)
    .eq('user_id', auth.user!.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data?.result) {
    return NextResponse.json({ error: 'Analyse introuvable.' }, { status: 404 })
  }

  try {
    const generated = await generateKeynoteFromAnalysis({
      analysisMarkdown: data.result,
      clientName: data.client_name,
      analysisId,
    })

    const stream = createReadStream(generated.filePath)
    const webStream = Readable.toWeb(stream) as ReadableStream

    const headers = new Headers({
      'Content-Type': 'application/vnd.apple.keynote',
      'Content-Disposition': buildContentDisposition(generated.filename),
      'X-Keynote-Filled': generated.filled ? '1' : '0',
      'X-Keynote-Slides': String(generated.slideCount),
      'X-Keynote-Filled-Slides': String(generated.filledSlideCount),
    })

    const noticeCode = resolveKeynoteNoticeCode(generated)
    if (noticeCode) {
      headers.set('X-Keynote-Notice-Code', noticeCode)
    }

    return new NextResponse(webStream, { status: 200, headers })
  } catch (err) {
    console.error('Keynote download error:', err)
    const message = err instanceof Error ? err.message : 'Génération Keynote impossible.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function resolveKeynoteNoticeCode(generated: KeynoteGenerateResult): string | null {
  if (!isKeynoteGenerationSupported()) return 'template-only'
  if (generated.slideCount === 0) return 'no-slides'
  if (generated.filled) {
    if (generated.filledSlideCount < generated.slideCount) return 'partial-fill'
    return null
  }

  const error = generated.fillError ?? ''
  if (error.includes('-1743') || /automatisation|automation|not authorized/i.test(error)) {
    return 'automation-denied'
  }

  return 'fill-failed'
}
