import { head } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import {
  basePresentationDownloadFilename,
  BASE_PRESENTATION_BLOB_PATHNAMES,
  isBasePresentationDocumentFormat,
} from '@/lib/presentation-documents'

export const runtime = 'nodejs'

type RouteContext = { params: { format: string } }

async function localPublicExists(filename: string): Promise<boolean> {
  try {
    await fs.access(path.join(process.cwd(), 'public', filename))
    return true
  } catch {
    return false
  }
}

export async function GET(req: Request, context: RouteContext) {
  const format = context.params.format
  if (!isBasePresentationDocumentFormat(format)) {
    return NextResponse.json({ error: 'Format inconnu.' }, { status: 404 })
  }

  const pathname = BASE_PRESENTATION_BLOB_PATHNAMES[format]
  const filename = basePresentationDownloadFilename(format)
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    if (await localPublicExists(filename)) {
      return NextResponse.redirect(new URL(`/${encodeURI(filename)}`, req.url))
    }
    return NextResponse.json(
      {
        error:
          'BLOB_READ_WRITE_TOKEN manquant. Ajoutez-le depuis Vercel (Storage → Blob) ou placez le fichier dans public/.',
      },
      { status: 503 },
    )
  }

  try {
    const blob = await head(pathname, { token })
    return NextResponse.redirect(blob.downloadUrl)
  } catch {
    if (await localPublicExists(filename)) {
      return NextResponse.redirect(new URL(`/${encodeURI(filename)}`, req.url))
    }
    return NextResponse.json(
      { error: `« ${filename} » introuvable sur Vercel Blob.` },
      { status: 404 },
    )
  }
}
