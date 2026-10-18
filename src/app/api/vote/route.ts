import { NextResponse } from 'next/server'
import { addVote, getCounts, pollSlugs } from '@/lib/votes'
import { allowVote, secondsUntilReset, voteCookie, votedToday } from '@/lib/voteGuard'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function GET() {
  return NextResponse.json({ counts: await getCounts(), voted: votedToday(), resetIn: secondsUntilReset() }, { headers: noStore })
}

export async function POST(req: Request) {
  // Only accept votes sent from this site's own pages (browsers always send Origin on a same-site POST).
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  const sameSite = origin ? Boolean(host) && new URL(origin).host === host : req.headers.get('sec-fetch-site') === 'same-origin'
  if (!sameSite || !req.headers.get('user-agent')) {
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

  const already = votedToday()
  if (already) {
    return NextResponse.json({ error: 'already', voted: already, counts: await getCounts(), resetIn: secondsUntilReset() }, { status: 429, headers: noStore })
  }
  const guard = await allowVote(req)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason, counts: await getCounts(), resetIn: secondsUntilReset() }, { status: 429, headers: noStore })
  }

  let counts
  try {
    counts = await addVote(slug)
  } catch (e) {
    await guard.release() // the vote did not count, so do not burn the voter's turn
    throw e
  }
  const res = NextResponse.json({ counts, voted: slug, resetIn: secondsUntilReset() }, { headers: noStore })
  res.cookies.set(voteCookie(slug))
  return res
}
