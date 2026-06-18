import { NextResponse } from 'next/server'
import { getPrimarySessionUser, getServerSupabase, isMediaTableMissingError } from '@/lib/media-session'
import { MEDIA_BUCKET } from '@/lib/media-config'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getPrimarySessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const supabase = await getServerSupabase()
    const { data: asset, error } = await supabase
      .from('media_assets')
      .select('storage_path, original_filename')
      .eq('id', params.id)
      .maybeSingle()

    if (error) {
      if (isMediaTableMissingError(error)) {
        return NextResponse.json({ error: 'Médiathèque non configurée' }, { status: 503 })
      }
      return NextResponse.json({ error: 'Média introuvable' }, { status: 404 })
    }

    if (!asset) {
      return NextResponse.json({ error: 'Média introuvable' }, { status: 404 })
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrl(asset.storage_path, 60 * 60 * 24 * 7)

    if (signedError || !signed?.signedUrl) {
      return NextResponse.json({ error: 'Impossible de générer le lien de téléchargement' }, { status: 500 })
    }

    return NextResponse.json({
      url: signed.signedUrl,
      filename: asset.original_filename,
    })
  } catch (error) {
    console.error('Media download route error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
