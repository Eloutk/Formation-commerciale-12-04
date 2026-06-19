import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getPrimarySessionUser, getServerSupabase, formatMediaDbError, isMediaTableMissingError, requireAdminSessionUser } from '@/lib/media-session'
import { MEDIA_BUCKET, normalizeMediaPlatforms, normalizeMediaSectors } from '@/lib/media-config'

type UploadMeta = {
  sectors: string[]
  platforms: string[]
  month: number | null
  year: number | null
  clientName: string
  campaignName: string
  reportLink: string | null
}

function buildStoragePath(ext: string, year: number | null, month: number | null) {
  const folder =
    year && month
      ? `uploads/${year}/${String(month).padStart(2, '0')}`
      : year
        ? `uploads/${year}/undated`
        : 'uploads/undated'
  return `${folder}/${randomUUID()}.${ext}`
}

function mapMediaRow(row: Record<string, unknown>) {
  return {
    ...row,
    sectors: normalizeMediaSectors(row.sectors ?? row.sector),
    platforms: normalizeMediaPlatforms(row.platforms ?? row.platform),
    month: typeof row.month === 'number' ? row.month : row.month ?? null,
    year: typeof row.year === 'number' ? row.year : row.year ?? null,
  }
}

function collectFiles(formData: FormData): File[] {
  const fromFiles = formData.getAll('files')
  const legacy = formData.get('file')
  const combined = legacy ? [...fromFiles, legacy] : fromFiles
  return combined.filter((entry): entry is File => entry instanceof File && entry.size > 0)
}

async function uploadSingleMedia(
  supabase: SupabaseClient,
  file: File,
  meta: UploadMeta,
  user: { id: string; name: string },
) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const storagePath = buildStoragePath(ext || 'bin', meta.year, meta.month)
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    throw new Error('Échec de l’upload du fichier')
  }

  const rowBase = {
    storage_path: storagePath,
    original_filename: file.name,
    mime_type: file.type || null,
    file_size: file.size,
    month: meta.month,
    year: meta.year,
    client_name: meta.clientName,
    campaign_name: meta.campaignName,
    report_link: meta.reportLink,
    uploaded_by_id: user.id,
    uploaded_by_name: user.name,
  }

  let { data, error: insertError } = await supabase
    .from('media_assets')
    .insert({
      ...rowBase,
      sectors: meta.sectors,
      platforms: meta.platforms,
    })
    .select('id')
    .single()

  // Ancien schéma : colonne platform (singulier) au lieu de platforms
  if (insertError && isMissingMediaColumnError(insertError, 'platforms')) {
    ;({ data, error: insertError } = await supabase
      .from('media_assets')
      .insert({
        ...rowBase,
        sectors: meta.sectors,
        platform: meta.platforms[0],
      })
      .select('id')
      .single())
  }

  // Ancien schéma : colonne sector (singulier)
  if (insertError && isMissingMediaColumnError(insertError, 'sectors')) {
    ;({ data, error: insertError } = await supabase
      .from('media_assets')
      .insert({
        ...rowBase,
        sector: meta.sectors[0],
        platform: meta.platforms[0],
      })
      .select('id')
      .single())
  }

  if (insertError) {
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath])
    console.error('Media insert error:', insertError)
    throw new Error(formatMediaDbError(insertError))
  }

  return data!.id as string
}

function isMissingMediaColumnError(error: { message?: string } | null, column: string) {
  if (!error?.message) return false
  const msg = error.message.toLowerCase()
  return msg.includes(column.toLowerCase()) && (msg.includes('column') || msg.includes('schema cache'))
}

export async function POST(req: Request) {
  const auth = await requireAdminSessionUser(req)
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.status === 401 ? 'Non authentifié' : 'Accès réservé aux administrateurs' },
      { status: auth.status ?? 403 },
    )
  }
  const user = auth.user

  const supabase = await getServerSupabase(req)

  try {
    const formData = await req.formData()
    const files = collectFiles(formData)
    const sectors = formData.getAll('sectors').map(String).filter(Boolean)
    const platforms = formData.getAll('platforms').map(String).filter(Boolean)
    const monthRaw = String(formData.get('month') || '').trim()
    const yearRaw = String(formData.get('year') || '').trim()
    const clientName = String(formData.get('client_name') || '').trim()
    const campaignName = String(formData.get('campaign_name') || '').trim()
    const reportLink = String(formData.get('report_link') || '').trim()

    const month = monthRaw ? Number(monthRaw) : null
    const year = yearRaw ? Number(yearRaw) : null

    if (files.length === 0) {
      return NextResponse.json({ error: 'Au moins un fichier est requis' }, { status: 400 })
    }
    if (sectors.length === 0 || platforms.length === 0 || !clientName || !campaignName || !monthRaw || !yearRaw) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être renseignés' }, { status: 400 })
    }
    if (month === null || !Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Mois invalide' }, { status: 400 })
    }
    if (year === null || !Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: 'Année invalide' }, { status: 400 })
    }

    const meta: UploadMeta = {
      sectors,
      platforms,
      month,
      year,
      clientName,
      campaignName,
      reportLink: reportLink || null,
    }

    const ids: string[] = []
    const failed: { filename: string; error: string }[] = []

    for (const file of files) {
      try {
        const id = await uploadSingleMedia(supabase, file, meta, user)
        ids.push(id)
      } catch (err) {
        failed.push({
          filename: file.name,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
        })
      }
    }

    if (ids.length === 0) {
      const firstError = failed[0]?.error ?? 'Échec de l’enregistrement'
      const status = firstError.includes('non configurée') ? 503 : 500
      return NextResponse.json({ error: firstError, failed }, { status })
    }

    const count = ids.length
    const message =
      count === 1
        ? '1 média enregistré avec succès.'
        : `${count} médias enregistrés avec succès.`

    return NextResponse.json({
      id: ids[0],
      ids,
      count,
      message,
      failed: failed.length > 0 ? failed : undefined,
    })
  } catch (error) {
    console.error('Media upload route error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const auth = await requireAdminSessionUser(req)
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.status === 401 ? 'Non authentifié' : 'Accès réservé aux administrateurs' },
      { status: auth.status ?? 403 },
    )
  }

  const { searchParams } = new URL(req.url)
  const sectors = searchParams.getAll('sector').map((s) => s.trim()).filter(Boolean)
  const platforms = searchParams.getAll('platform').map((p) => p.trim()).filter(Boolean)
  const month = searchParams.get('month')?.trim()
  const year = searchParams.get('year')?.trim()
  const clientName = searchParams.get('client_name')?.trim()
  const campaignName = searchParams.get('campaign_name')?.trim()

  try {
    const supabase = await getServerSupabase(req)
    let query = supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (sectors.length > 0) query = query.overlaps('sectors', sectors)
    if (platforms.length > 0) query = query.overlaps('platforms', platforms)
    if (month) query = query.eq('month', Number(month))
    if (year) query = query.eq('year', Number(year))
    if (clientName) query = query.ilike('client_name', `%${clientName}%`)
    if (campaignName) query = query.ilike('campaign_name', `%${campaignName}%`)

    const { data, error } = await query

    if (error) {
      if (isMediaTableMissingError(error)) {
        return NextResponse.json(
          { error: 'Médiathèque non configurée', configured: false, items: [] },
          { status: 503 },
        )
      }
      console.error('Media list error:', error)
      return NextResponse.json({ error: 'Impossible de charger les médias' }, { status: 500 })
    }

    return NextResponse.json({
      configured: true,
      items: (data ?? []).map((row: Record<string, unknown>) => mapMediaRow(row)),
    })
  } catch (error) {
    console.error('Media list route error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
