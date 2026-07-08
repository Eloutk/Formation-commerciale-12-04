import { head, issueSignedToken, presignUrl } from '@vercel/blob'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import {
  basePresentationDownloadFilename,
  BASE_PRESENTATION_BLOB_PATHNAMES,
  isBasePresentationDocumentFormat,
} from '@/lib/presentation-documents'

export const runtime = 'nodejs'
// Plan Hobby : plafonné à 60s. On ne streame pas les gros fichiers en prod
// (redirection CDN), donc la fonction reste rapide.
export const maxDuration = 60

type RouteContext = { params: { format: string } }

const CONTENT_TYPES: Record<string, string> = {
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  key: 'application/x-iwork-keynote-sffkey',
}

function localPublicPath(filename: string): string {
  return path.join(process.cwd(), 'public', filename)
}

async function localPublicExists(filename: string): Promise<boolean> {
  try {
    await fsp.access(localPublicPath(filename))
    return true
  } catch {
    return false
  }
}

/**
 * Store Blob privé : `head().downloadUrl` n'est pas accessible sans signature.
 * On émet un jeton délégué court, on présigne l'URL GET, puis on ajoute
 * `download=1` (paramètre non signé) pour forcer le téléchargement côté CDN.
 */
async function resolveBlobDownloadUrl(pathname: string, token: string): Promise<string> {
  try {
    const signedToken = await issueSignedToken({ token, pathname, operations: ['get'] })
    const { presignedUrl } = await presignUrl(signedToken, {
      operation: 'get',
      pathname,
      access: 'private',
    })
    const url = new URL(presignedUrl)
    url.searchParams.set('download', '1')
    return url.toString()
  } catch {
    // Store public : downloadUrl force déjà l'attachment.
    const blob = await head(pathname, { token })
    return blob.downloadUrl
  }
}

export async function GET(_req: Request, context: RouteContext) {
  const format = context.params.format
  if (!isBasePresentationDocumentFormat(format)) {
    return NextResponse.json({ error: 'Format inconnu.' }, { status: 404 })
  }

  const pathname = BASE_PRESENTATION_BLOB_PATHNAMES[format]
  const filename = basePresentationDownloadFilename(format)
  const token = process.env.BLOB_READ_WRITE_TOKEN

  // 1) Fichier local (dev) : streaming direct en pièce jointe.
  if (await localPublicExists(filename)) {
    const stat = await fsp.stat(localPublicPath(filename))
    const nodeStream = fs.createReadStream(localPublicPath(filename))
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': CONTENT_TYPES[format] ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': String(stat.size),
        'Cache-Control': 'no-store',
      },
    })
  }

  // 2) Production : on redirige vers l'URL Blob présignée (transfert via CDN).
  if (token) {
    try {
      const downloadUrl = await resolveBlobDownloadUrl(pathname, token)
      return NextResponse.redirect(downloadUrl)
    } catch {
      return NextResponse.json(
        { error: `« ${filename} » introuvable sur Vercel Blob.` },
        { status: 404 },
      )
    }
  }

  return NextResponse.json(
    {
      error:
        'BLOB_READ_WRITE_TOKEN manquant. Ajoutez-le depuis Vercel (Storage → Blob) ou placez le fichier dans public/.',
    },
    { status: 503 },
  )
}
