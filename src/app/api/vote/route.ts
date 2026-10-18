import { NextResponse } from 'next/server'
import { addVote, getCounts } from '@/lib/votes'
import { isPollId, pollSlugsFor, type PollId } from '@/lib/polls'
import { allowVote, secondsUntilReset, voteCookie, votedToday } from '@/lib/voteGuard'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }
const pollOf = (v: unknown): PollId => (isPollId(v) ? v : 'president')

export async function GET(req: Request) {
  const poll = pollOf(new URL(req.url).searchParams.get('poll'))
  return NextResponse.json({ counts: await getCounts(poll), voted: votedToday(poll), resetIn: secondsUntilReset() }, { headers: noStore })
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
  let poll: PollId
  try {
    const body = await req.json()
    slug = body.slug
    poll = pollOf(body.poll)
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (typeof slug !== 'string' || !pollSlugsFor(poll).includes(slug)) {
    return NextResponse.json({ error: 'unknown candidate' }, { status: 400 })
  }

  const already = votedToday(poll)
  if (already) {
    return NextResponse.json({ error: 'already', voted: already, counts: await getCounts(poll), resetIn: secondsUntilReset() }, { status: 429, headers: noStore })
  }
  const guard = await allowVote(req, poll)
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason, counts: await getCounts(poll), resetIn: secondsUntilReset() }, { status: 429, headers: noStore })
  }

  let counts
  try {
    counts = await addVote(slug, poll)
  } catch (e) {
    await guard.release() // the vote did not count, so do not burn the voter's turn
    throw e
  }
  const res = NextResponse.json({ counts, voted: slug, resetIn: secondsUntilReset() }, { headers: noStore })
  res.cookies.set(voteCookie(slug, poll))
  return res
}
