import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

interface SendValidationPayload {
  pdfBase64: string
  fileName: string
  firstName: string
  message: string
  clientName?: string
  userName?: string
  userId?: string | null
}

async function sendValidation(
  supabase: any,
  sessionUserId: string,
  payload: SendValidationPayload,
): Promise<{ filePath: string; signedUrl: string | null }> {
  const { pdfBase64, fileName, firstName, message, clientName, userName, userId } = payload

  // 1) Upload du PDF dans le bucket Supabase Storage "pdv"
  const pdfBuffer = Buffer.from(pdfBase64, 'base64')
  const filePath = `strategies/${randomUUID()}.pdf`

  const { error: uploadError } = await supabase
    .storage
    .from('pdv')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  // 2) Générer une URL signée de 7 jours pour ce PDF (pour Make ou autre consommateur)
  let signedUrl: string | null = null
  const { data: signed, error: signedError } = await supabase
    .storage
    .from('pdv')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 jours

  if (signedError) {
    // On ne bloque pas l'insert si la génération de l'URL échoue, on log juste l'erreur
    // Make pourra toujours régénérer une URL à partir de pdf_path
    console.error('Error creating signed URL for PDV PDF:', signedError)
  } else {
    signedUrl = signed?.signedUrl ?? null
  }

  // 3) Insérer la ligne dans pdv_validations avec chemin + URL signée
  const { error: insertError } = await supabase
    .from('pdv_validations')
    .insert({
      user_id: userId || sessionUserId,
      user_name: userName || firstName,
      client_name: clientName || null,
      message,
      pdf_filename: fileName,
      pdf_path: filePath,
      pdf_url: signedUrl,
    })

  if (insertError) {
    throw insertError
  }

  return { filePath, signedUrl }
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { pdfBase64, fileName, firstName, message, clientName, userName, userId } = body || {}

  if (!pdfBase64 || !fileName || !firstName || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Upload + insertion en base (bucket "pdv" + table "pdv_validations")
    const { filePath, signedUrl } = await sendValidation(supabase, session.user.id, {
      pdfBase64,
      fileName,
      firstName,
      message,
      clientName,
      userName,
      userId,
    })

    // On renvoie à l'appelant le chemin dans le bucket + une URL signée (facultative)
    return NextResponse.json({
      ok: true,
      pdf_path: filePath,
      pdf_url: signedUrl,
    })
  } catch (error: any) {
    console.error('Error saving PDV validation:', error)
    return NextResponse.json({ error: error.message || 'Failed to save validation' }, { status: 500 })
  }
}
