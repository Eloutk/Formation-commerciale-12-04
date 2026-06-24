import { NextResponse } from 'next/server'

/** Ancienne route Keynote — redirige vers PowerPoint. */
export async function GET(_req: Request, context: { params: { id: string } }) {
  return NextResponse.redirect(new URL(`/api/ia/pptx/${context.params.id}`, _req.url), 307)
}
