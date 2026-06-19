import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getServerSupabase,
  isMediaTableMissingError,
  requireAdminSessionUser,
} from '@/lib/media-session'
import { MEDIA_BUCKET } from '@/lib/media-config'

async function deleteMediaAssetRow(
  supabase: SupabaseClient,
  assetId: string,
): Promise<{ ok: true } | { ok: false; reason: 'no_rows' | 'error' }> {
  const { data: rpcDeleted, error: rpcError } = await supabase.rpc('delete_media_asset', {
    asset_id: assetId,
  })

  if (!rpcError && rpcDeleted === true) {
    return { ok: true }
  }

  if (rpcError) {
    const msg = rpcError.message.toLowerCase()
    const functionMissing =
      rpcError.code === 'PGRST202' ||
      msg.includes('could not find the function') ||
      msg.includes('delete_media_asset')
    if (!functionMissing) {
      console.error('Media delete rpc error:', rpcError)
    }
  }

  const { data, error } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', assetId)
    .select('id')

  if (error) {
    console.error('Media delete error:', error)
    return { ok: false, reason: 'error' }
  }

  if (!data?.length) {
    return { ok: false, reason: 'no_rows' }
  }

  return { ok: true }
}

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

    const deleted = await deleteMediaAssetRow(supabase, params.id)
    if (!deleted.ok) {
      const message =
        deleted.reason === 'no_rows'
          ? 'La suppression a échoué. Exécutez supabase/media-library-migration-delete.sql dans Supabase.'
          : 'Impossible de supprimer le média'
      return NextResponse.json({ error: message }, { status: deleted.reason === 'no_rows' ? 403 : 500 })
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
