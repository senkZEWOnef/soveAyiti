import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { presidentialCandidates } from '@/data/candidates'

// Informal poll storage: ONE number per candidate, nothing else. No IP, no cookie, no user id, no timestamp.
// File-based, so it needs a host with a persistent disk (VPS, Render disk, Railway volume…). On serverless
// hosts (e.g. Vercel) swap load()/save() for a KV/database counter; the rest of the app does not change.
// Set VOTES_FILE to put the file on a persistent volume.
const FILE = process.env.VOTES_FILE ?? path.join(process.cwd(), 'data', 'votes.json')

export type Counts = Record<string, number>

export const pollSlugs = presidentialCandidates.map((c) => c.slug)

async function load(): Promise<Counts> {
  let stored: Counts = {}
  try {
    stored = JSON.parse(await fs.readFile(FILE, 'utf8'))
  } catch {
    /* first run */
  }
  return Object.fromEntries(pollSlugs.map((slug) => [slug, Math.max(0, Math.floor(Number(stored[slug]) || 0))]))
}

async function save(counts: Counts) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = `${FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(counts))
  await fs.rename(tmp, FILE)
}

// Serialize writes inside this process so two simultaneous votes cannot overwrite each other.
let queue: Promise<unknown> = Promise.resolve()

export function getCounts(): Promise<Counts> {
  return queue.then(load, load)
}

export function addVote(slug: string): Promise<Counts> {
  const run = async () => {
    const counts = await load()
    counts[slug] += 1
    await save(counts)
    return counts
  }
  const next = queue.then(run, run)
  queue = next.catch(() => undefined)
  return next
}
