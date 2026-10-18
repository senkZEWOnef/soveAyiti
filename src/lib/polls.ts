import { presidentialCandidates } from '@/data/candidates'
import { athletes } from '@/data/athletes'

// Every poll the site runs. Each has its own counts and its own one-vote-per-day limit.
export type PollId = 'president' | 'athlete'
export const pollIds: PollId[] = ['president', 'athlete']
export const isPollId = (v: unknown): v is PollId => typeof v === 'string' && (pollIds as string[]).includes(v)

export function pollSlugsFor(id: PollId): string[] {
  return id === 'athlete' ? athletes.map((a) => a.slug) : presidentialCandidates.map((c) => c.slug)
}
