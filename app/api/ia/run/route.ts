import { NextResponse } from 'next/server'
import { getIaAction, isIaActionId } from '@/lib/ia-actions'
import { buildDefaultIaAnalysisName } from '@/lib/ia-analyses'
import { IA_MODEL, getAnthropicApiKey } from '@/lib/ia-config'
import {
  buildPrezFinalPrompt,
  isIaPrezOutputMode,
  prezOutputModeLabel,
} from '@/lib/ia-prez'
import { IA_ANALYSIS_PUBLIC_COLUMNS, resolveIaPrePromptServer } from '@/lib/ia-pre-prompt-server'
import { validateIaPdfFiles } from '@/lib/ia-pdf'
import { resolveIaInputLabel, runIaAction } from '@/lib/ia-run-server'
import { getServerSupabase, requireAdminSessionUser } from '@/lib/media-session'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  const auth = await requireAdminSessionUser(req)
  if (auth.status === 401) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }
  if (auth.status === 403) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
  }

  if (!getAnthropicApiKey()) {
    return NextResponse.json(
      {
        error:
          'Clé API Anthropic absente. Ajoutez ANTHROPIC_API_KEY=sk-ant-… dans .env.local (racine du projet), sauvegardez, puis redémarrez complètement `npm run dev`.',
      },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const actionIdRaw = String(formData.get('actionId') ?? '')
  if (!isIaActionId(actionIdRaw)) {
    return NextResponse.json({ error: 'Action IA invalide.' }, { status: 400 })
  }

  const action = getIaAction(actionIdRaw)
  if (!action || action.status !== 'available') {
    return NextResponse.json(
      { error: 'Cette action n’est pas encore disponible.' },
      { status: 400 },
    )
  }

  const clientName = String(formData.get('clientName') ?? '')
  const url = String(formData.get('url') ?? '')
  const nameOverride = String(formData.get('name') ?? '').trim()
  const clientImage = formData.get('clientImage')

  const pdfFiles = collectPdfFiles(formData)
  const imageFile = clientImage instanceof File && clientImage.size > 0 ? clientImage : null

  if (action.inputKind === 'pdf' || action.inputKind === 'pdf_and_image') {
    const pdfValidation = validateIaPdfFiles(pdfFiles)
    if (pdfValidation) {
      return NextResponse.json({ error: pdfValidation }, { status: 400 })
    }
  }

  let outputMode: 'written' | 'presentation' | null = null

  const outputModeRaw = String(formData.get('outputMode') ?? '')
  if (!isIaPrezOutputMode(outputModeRaw)) {
    return NextResponse.json(
      { error: 'Choisissez un format : analyse écrite ou présentation globale.' },
      { status: 400 },
    )
  }
  outputMode = outputModeRaw

  const supabase = await getServerSupabase(req)

  try {
    let prePrompt = await resolveIaPrePromptServer(supabase, auth.user!.id, actionIdRaw)

    prePrompt = buildPrezFinalPrompt(prePrompt, { outputMode })

    const result = await runIaAction({
      actionId: actionIdRaw,
      prePrompt,
      pdfFiles,
      clientImage: imageFile,
      url: url || null,
      clientName: clientName || null,
      maxTokens: outputMode === 'presentation' ? 16384 : 4096,
    })

    const { inputKind, inputLabel, inputUrl } = resolveIaInputLabel({
      actionId: actionIdRaw,
      pdfFiles,
      url: url || null,
      clientName: clientName || null,
    })

    const analysisName =
      nameOverride ||
      buildDefaultIaAnalysisName(
        `${action.label} — ${prezOutputModeLabel(outputMode)}`,
        inputLabel,
      )

    const { data, error } = await supabase
      .from('ia_analyses')
      .insert({
        user_id: auth.user!.id,
        action_id: actionIdRaw,
        name: analysisName,
        pre_prompt: prePrompt,
        result,
        model: IA_MODEL,
        input_kind: inputKind,
        input_label: inputLabel,
        input_url: inputUrl,
        client_name: clientName.trim() || null,
      })
      .select(IA_ANALYSIS_PUBLIC_COLUMNS)
      .single()

    if (error) {
      console.error('IA analysis insert error:', error)
      return NextResponse.json(
        {
          error:
            'Analyse générée mais enregistrement impossible. Exécutez supabase/ia-analyses.sql dans Supabase.',
          result,
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      analysis: result,
      record: data,
      model: IA_MODEL,
      outputMode,
      presentationDownloadUrl:
        outputMode === 'presentation' && data?.id ? `/api/ia/pptx/${data.id}` : null,
    })
  } catch (error) {
    console.error('IA run error:', error)
    const message = formatIaRunError(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function formatIaRunError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = Number((error as { status?: number }).status)
    if (status === 502 || status === 503) {
      return `Service Claude temporairement indisponible (${status}). Réessayez dans quelques instants. Si le problème persiste, vérifiez le modèle configuré (${IA_MODEL}).`
    }
    if (status === 401) {
      return 'Clé API Anthropic refusée. Vérifiez ANTHROPIC_API_KEY dans .env.local.'
    }
    if (status === 429) {
      return 'Quota ou limite de débit Anthropic atteint. Réessayez plus tard.'
    }
  }

  const raw = error instanceof Error ? error.message : 'Erreur lors de l’analyse.'
  if (raw.includes('502 Bad Gateway') || raw.includes('503 Service Unavailable')) {
    return `Service Claude indisponible. Le modèle ${IA_MODEL} est peut-être incorrect ou retiré — consultez la doc Anthropic des modèles actifs.`
  }
  return raw
}

function collectPdfFiles(formData: FormData): File[] {
  const fromFiles = formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (fromFiles.length > 0) return fromFiles

  const legacy = formData.get('file')
  if (legacy instanceof File && legacy.size > 0) return [legacy]

  return []
}
