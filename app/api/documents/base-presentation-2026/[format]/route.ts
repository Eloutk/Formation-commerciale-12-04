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
export const maxDuration = 300

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

function attachmentHeaders(filename: string, format: string, size?: number): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': CONTENT_TYPES[format] ?? 'application/octet-stream',
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'Cache-Control': 'no-store',
  }
  if (typeof size === 'number') headers['Content-Length'] = String(size)
  return headers
}

/**
 * Store Blob privé : `head().downloadUrl` n'est pas accessible sans signature.
 * On émet un jeton délégué court puis on présigne l'URL GET du blob.
 */
async function resolveBlobUrl(pathname: string, token: string): Promise<string> {
  try {
    const signedToken = await issueSignedToken({ token, pathname, operations: ['get'] })
    const { presignedUrl } = await presignUrl(signedToken, {
      operation: 'get',
      pathname,
      access: 'private',
    })
    return presignedUrl
  } catch {
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

  // 1) Fichier local (dev) : on le renvoie directement en pièce jointe.
  if (await localPublicExists(filename)) {
    const stat = await fsp.stat(localPublicPath(filename))
    const nodeStream = fs.createReadStream(localPublicPath(filename))
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream
    return new NextResponse(webStream, {
      headers: attachmentHeaders(filename, format, stat.size),
    })
  }

  // 2) Production : on récupère le blob (store privé → URL présignée) et on le renvoie en streaming.
  if (token) {
    try {
      const blobUrl = await resolveBlobUrl(pathname, token)
      const upstream = await fetch(blobUrl)
      if (!upstream.ok || !upstream.body) {
        throw new Error(`upstream ${upstream.status}`)
      }
      const size = upstream.headers.get('content-length')
      return new NextResponse(upstream.body, {
        headers: attachmentHeaders(filename, format, size ? Number(size) : undefined),
      })
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
