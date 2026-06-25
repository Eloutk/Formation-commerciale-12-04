import { NextResponse } from 'next/server'
import { requireAdminSessionUser } from '@/lib/media-session'

/** Ancienne route Keynote — redirige vers PowerPoint (accès admin requis). */
export async function GET(req: Request, context: { params: { id: string } }) {
  const auth = await requireAdminSessionUser(req)
  if (auth.status === 401) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }
  if (auth.status === 403) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
  }

  return NextResponse.redirect(new URL(`/api/ia/pptx/${context.params.id}`, req.url), 307)
}
