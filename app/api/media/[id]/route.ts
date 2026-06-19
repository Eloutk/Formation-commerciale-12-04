import { NextResponse } from 'next/server'
import {
  getServerSupabase,
  isMediaTableMissingError,
  requireAdminSessionUser,
} from '@/lib/media-session'
import { MEDIA_BUCKET } from '@/lib/media-config'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminSessionUser(req)
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.status === 401 ? 'Non authentifié' : 'Accès réservé aux administrateurs' },
      { status: auth.status ?? 403 },
    )
  }

  try {
    const supabase = await getServerSupabase(req)
    const { data: asset, error } = await supabase
      .from('media_assets')
      .select('id, storage_path, original_filename')
      .eq('id', params.id)
      .maybeSingle()

    if (error) {
      if (isMediaTableMissingError(error)) {
        return NextResponse.json({ error: 'Médiathèque non configurée' }, { status: 503 })
      }
      console.error('Media delete lookup error:', error)
      return NextResponse.json({ error: 'Impossible de supprimer le média' }, { status: 500 })
    }

    if (!asset) {
      return NextResponse.json({ error: 'Média introuvable' }, { status: 404 })
    }

    const { error: storageError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([asset.storage_path])

    if (storageError) {
      console.error('Media storage delete error:', storageError)
    }

    const { error: deleteError } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Media delete error:', deleteError)
      return NextResponse.json({ error: 'Impossible de supprimer le média' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: `« ${asset.original_filename} » a été supprimé.`,
    })
  } catch (error) {
    console.error('Media delete route error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
