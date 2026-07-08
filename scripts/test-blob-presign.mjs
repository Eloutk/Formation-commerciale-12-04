// Test rapide : vérifie que la génération d'URL présignée fonctionne sur le store Blob privé.
// Usage : node scripts/test-blob-presign.mjs  (lit BLOB_READ_WRITE_TOKEN depuis .env.local)
import { issueSignedToken, presignUrl, head } from '@vercel/blob'
import fs from 'node:fs'

// Charge BLOB_READ_WRITE_TOKEN depuis .env.local si pas déjà dans l'env.
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8')
    const match = envFile.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*"?([^"\n\r]+)"?/m)
    if (match) process.env.BLOB_READ_WRITE_TOKEN = match[1].trim()
  } catch {
    // pas de .env.local
  }
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('❌ BLOB_READ_WRITE_TOKEN manquant. Lance : BLOB_READ_WRITE_TOKEN=... node scripts/test-blob-presign.mjs')
  process.exit(1)
}

const pathnames = ['Base de presentation 2026.pptx', 'Base de presentation 2026.key']

for (const pathname of pathnames) {
  console.log(`\n=== ${pathname} ===`)
  try {
    const signedToken = await issueSignedToken({ token, pathname, operations: ['get'] })
    const { presignedUrl } = await presignUrl(signedToken, { operation: 'get', pathname, access: 'private' })
    const res = await fetch(presignedUrl, { method: 'HEAD' })
    console.log('  presign HEAD status:', res.status, res.statusText)
    console.log('  content-length:', res.headers.get('content-length'))
  } catch (err) {
    console.error('  ❌ presign a échoué:', err?.message ?? err)
    try {
      const blob = await head(pathname, { token })
      console.log('  head().downloadUrl:', blob.downloadUrl.slice(0, 80), '...')
    } catch (e2) {
      console.error('  ❌ head a aussi échoué:', e2?.message ?? e2)
    }
  }
}
