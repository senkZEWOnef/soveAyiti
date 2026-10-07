import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { presidentialCandidates } from '@/data/candidates'

// Informal poll storage: ONE number per candidate, nothing else. No IP, no cookie, no user id, no timestamp.
//
// Two backends, same behaviour:
//  - Netlify Blobs (automatic when running on Netlify): one JSON entry, updated with an ETag check so two
//    simultaneous votes can never overwrite each other (the loser retries).
//  - A local JSON file (everywhere else, e.g. `npm run dev`). Set VOTES_FILE to put it on a persistent disk.
// Force a backend with VOTES_BACKEND=blobs|file.
const FILE = process.env.VOTES_FILE ?? path.join(process.cwd(), 'data', 'votes.json')
const BLOB_KEY = 'counts'

export type Counts = Record<string, number>

export const pollSlugs = presidentialCandidates.map((c) => c.slug)

const useBlobs = () => {
  if (process.env.VOTES_BACKEND) return process.env.VOTES_BACKEND === 'blobs'
  return !process.env.VOTES_FILE && Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)
}

function normalize(stored: unknown): Counts {
  const src = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>
  return Object.fromEntries(pollSlugs.map((slug) => [slug, Math.max(0, Math.floor(Number(src[slug]) || 0))]))
}

// ---------- Netlify Blobs ----------
// Each vote is its own tiny entry named "<candidate>/<random id>": creating different entries can never overwrite
// each other, so no vote is lost (a single shared counter WAS losing votes under simultaneous voting, because
// Blobs conditional writes are not fully atomic). The entry holds nothing about the voter; the random id is only
// a unique name. The count is the number of entries. Counts are cached for a few seconds per server instance.
// Fine for tens of thousands of votes; beyond that, move this to a real database counter.
async function blobStore() {
  const { getStore } = await import('@netlify/blobs')
  return getStore({ name: 'poll-votes', consistency: 'strong' })
}

const CACHE_MS = 5000
let cache: { at: number; counts: Counts } | undefined

async function blobCountOne(store: Awaited<ReturnType<typeof blobStore>>, slug: string) {
  let n = 0
  for await (const page of store.list({ prefix: `${slug}/`, paginate: true })) n += page.blobs.length
  return n
}

async function blobLoad(): Promise<Counts> {
  if (cache && Date.now() - cache.at < CACHE_MS) return { ...cache.counts }
  const store = await blobStore()
  const counts = Object.fromEntries(await Promise.all(pollSlugs.map(async (slug) => [slug, await blobCountOne(store, slug)])))
  cache = { at: Date.now(), counts }
  return { ...counts }
}

async function blobAdd(slug: string): Promise<Counts> {
  const store = await blobStore()
  await store.set(`${slug}/${crypto.randomUUID()}`, '1')
  if (cache && Date.now() - cache.at < CACHE_MS) {
    cache.counts[slug] += 1 // our own vote, on top of the recent listing
    return { ...cache.counts }
  }
  return blobLoad() // fresh listing already includes the new entry
}

// ---------- Local file ----------
async function fileLoad(): Promise<Counts> {
  try {
    return normalize(JSON.parse(await fs.readFile(FILE, 'utf8')))
  } catch {
    return normalize({}) // first run
  }
}

async function fileSave(counts: Counts) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = `${FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(counts))
  await fs.rename(tmp, FILE)
}

// Serialize writes inside this process so two simultaneous votes cannot overwrite each other.
let queue: Promise<unknown> = Promise.resolve()

export function getCounts(): Promise<Counts> {
  if (useBlobs()) return blobLoad()
  return queue.then(fileLoad, fileLoad)
}

export function addVote(slug: string): Promise<Counts> {
  if (useBlobs()) return blobAdd(slug)
  const run = async () => {
    const counts = await fileLoad()
    counts[slug] += 1
    await fileSave(counts)
    return counts
  }
  const next = queue.then(run, run)
  queue = next.catch(() => undefined)
  return next
}
