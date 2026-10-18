import 'server-only'
import { createHmac } from 'node:crypto'
import { cookies } from 'next/headers'
import { pollSlugs } from './votes'

// One vote per person per day (Haiti time). Layers, strongest first:
//  1. Cookie (`sa_vote` = "<day>:<slug>"): stops the normal visitor from voting twice, survives page reloads.
//  2. Device claim: HMAC(day, IP, user-agent). Stops "clear cookies and vote again" on the same phone/browser.
//  3. IP cap: at most IP_DAILY_CAP votes per IP per day. Many Haitians share one mobile-carrier address (CGNAT),
//     so this is a cap and not a hard 1, otherwise a whole neighbourhood would be blocked.
// Claims are atomic ("only if new"), so two simultaneous requests cannot both pass. Only salted hashes are kept,
// they contain the day, and entries from earlier days are deleted. No raw IP is ever stored.
// Nothing can stop a determined person with many SIM cards / VPNs: this is an informal poll, not an election.

export const VOTE_COOKIE = 'sa_vote'
export const IP_DAILY_CAP = 8
const TZ = 'America/Port-au-Prince'

const SALT = process.env.VOTE_SALT ?? 'soveayiti-change-me-set-VOTE_SALT'

export function dayKey(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

/** Seconds until the next midnight in Haiti (cookie lifetime, and the "come back at" countdown). */
export function secondsUntilReset(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(now)
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0) % 24
  const elapsed = n('hour') * 3600 + n('minute') * 60 + n('second')
  return Math.max(60, 86400 - elapsed)
}

const hmac = (...parts: string[]) => createHmac('sha256', SALT).update(parts.join('|')).digest('hex').slice(0, 40)

export function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get('x-nf-client-connection-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  )
}

/** The slug this browser already voted for today, from the cookie, or null. */
export function votedToday(): string | null {
  const v = cookies().get(VOTE_COOKIE)?.value
  if (!v) return null
  const [day, slug] = v.split(':')
  return day === dayKey() && pollSlugs.includes(slug) ? slug : null
}

export function voteCookie(slug: string) {
  return {
    name: VOTE_COOKIE,
    value: `${dayKey()}:${slug}`,
    maxAge: secondsUntilReset(),
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }
}

// ---------- claim storage: Netlify Blobs (production) or memory (dev) ----------
const useBlobs = () => {
  if (process.env.VOTES_BACKEND) return process.env.VOTES_BACKEND === 'blobs'
  return !process.env.VOTES_FILE && Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)
}

const memory = new Set<string>()

async function store() {
  const { getStore } = await import('@netlify/blobs')
  return getStore({ name: 'poll-voters', consistency: 'strong' })
}

/** Atomically creates `key`. Returns false if it already existed. */
async function claim(key: string): Promise<boolean> {
  if (!useBlobs()) {
    if (memory.has(key)) return false
    memory.add(key)
    return true
  }
  const res = await (await store()).set(key, '1', { onlyIfNew: true })
  return res.modified
}

async function release(key: string) {
  if (!useBlobs()) return void memory.delete(key)
  await (await store()).delete(key).catch(() => undefined)
}

/** Deletes claims from earlier days (run occasionally; keeps the store small and the hashes short-lived). */
async function purgeOldDays(day: string) {
  if (!useBlobs()) {
    Array.from(memory).forEach((k) => { if (!k.startsWith(`${day}/`)) memory.delete(k) })
    return
  }
  const s = await store()
  for await (const page of s.list({ paginate: true })) {
    await Promise.all(page.blobs.filter((b) => !b.key.startsWith(`${day}/`)).map((b) => s.delete(b.key)))
  }
}

export type GuardResult = { ok: true; release: () => Promise<void> } | { ok: false; reason: 'device' | 'ip' }

export async function allowVote(req: Request): Promise<GuardResult> {
  const day = dayKey()
  const ip = clientIp(req)
  const ua = req.headers.get('user-agent') ?? ''
  const deviceKey = `${day}/d/${hmac(day, ip, ua)}`
  if (!(await claim(deviceKey))) return { ok: false, reason: 'device' }

  const ipHash = hmac(day, 'ip', ip)
  let ipKey: string | null = null
  for (let n = 1; n <= IP_DAILY_CAP && !ipKey; n++) {
    const k = `${day}/i/${ipHash}/${n}`
    if (await claim(k)) ipKey = k
  }
  if (!ipKey) {
    await release(deviceKey)
    return { ok: false, reason: 'ip' }
  }

  if (Math.random() < 0.02) purgeOldDays(day).catch(() => undefined)
  return { ok: true, release: async () => void (await Promise.all([release(deviceKey), release(ipKey!)])) }
}
