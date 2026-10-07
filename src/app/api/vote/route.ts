import { NextResponse } from 'next/server'
import { addVote, getCounts, pollSlugs } from '@/lib/votes'

export const dynamic = 'force-dynamic'

const noStore = { headers: { 'Cache-Control': 'no-store' } }

export async function GET() {
  return NextResponse.json({ counts: await getCounts() }, noStore)
}

export async function POST(req: Request) {
  // Only accept votes sent from this site's own pages.
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  let slug: unknown
  try {
    slug = (await req.json()).slug
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (typeof slug !== 'string' || !pollSlugs.includes(slug)) {
    return NextResponse.json({ error: 'unknown candidate' }, { status: 400 })
  }
  return NextResponse.json({ counts: await addVote(slug) }, noStore)
}
