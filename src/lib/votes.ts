import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { pollSlugsFor, type PollId } from './polls'

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

export const pollSlugs = pollSlugsFor('president')

// The presidential poll keeps its original storage keys ("<slug>/<id>", votes.json) so live data is untouched;
// other polls are namespaced ("<poll>/<slug>/<id>", votes-<poll>.json).
const blobPrefix = (poll: PollId, slug: string) => (poll === 'president' ? `${slug}/` : `${poll}/${slug}/`)
const filePath = (poll: PollId) => (poll === 'president' ? FILE : FILE.replace(/\.json$/, `-${poll}.json`))

const useBlobs = () => {
  if (process.env.VOTES_BACKEND) return process.env.VOTES_BACKEND === 'blobs'
  return !process.env.VOTES_FILE && Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT)
}

function normalize(stored: unknown, poll: PollId): Counts {
  const src = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>
  return Object.fromEntries(pollSlugsFor(poll).map((slug) => [slug, Math.max(0, Math.floor(Number(src[slug]) || 0))]))
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
const cache: Partial<Record<PollId, { at: number; counts: Counts }>> = {}

async function blobCountOne(store: Awaited<ReturnType<typeof blobStore>>, poll: PollId, slug: string) {
  let n = 0
  for await (const page of store.list({ prefix: blobPrefix(poll, slug), paginate: true })) n += page.blobs.length
  return n
}

async function blobLoad(poll: PollId): Promise<Counts> {
  const hit = cache[poll]
  if (hit && Date.now() - hit.at < CACHE_MS) return { ...hit.counts }
  const store = await blobStore()
  const counts = Object.fromEntries(await Promise.all(pollSlugsFor(poll).map(async (slug) => [slug, await blobCountOne(store, poll, slug)])))
  cache[poll] = { at: Date.now(), counts }
  return { ...counts }
}

async function blobAdd(slug: string, poll: PollId): Promise<Counts> {
  const store = await blobStore()
  await store.set(`${blobPrefix(poll, slug)}${crypto.randomUUID()}`, '1')
  const hit = cache[poll]
  if (hit && Date.now() - hit.at < CACHE_MS) {
    hit.counts[slug] += 1 // our own vote, on top of the recent listing
    return { ...hit.counts }
  }
  return blobLoad(poll) // fresh listing already includes the new entry
}

// ---------- Local file ----------
async function fileLoad(poll: PollId): Promise<Counts> {
  try {
    return normalize(JSON.parse(await fs.readFile(filePath(poll), 'utf8')), poll)
  } catch {
    return normalize({}, poll) // first run
  }
}

async function fileSave(poll: PollId, counts: Counts) {
  const file = filePath(poll)
  await fs.mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, JSON.stringify(counts))
  await fs.rename(tmp, file)
}

// Serialize writes inside this process so two simultaneous votes cannot overwrite each other.
let queue: Promise<unknown> = Promise.resolve()

export function getCounts(poll: PollId = 'president'): Promise<Counts> {
  if (useBlobs()) return blobLoad(poll)
  const load = () => fileLoad(poll)
  return queue.then(load, load)
}

export function addVote(slug: string, poll: PollId = 'president'): Promise<Counts> {
  if (useBlobs()) return blobAdd(slug, poll)
  const run = async () => {
    const counts = await fileLoad(poll)
    counts[slug] += 1
    await fileSave(poll, counts)
    return counts
  }
  const next = queue.then(run, run)
  queue = next.catch(() => undefined)
  return next
}
