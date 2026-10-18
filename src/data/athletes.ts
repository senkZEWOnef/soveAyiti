import { existsSync } from 'node:fs'
import path from 'node:path'
import snapshot from './athletes-snapshot.json'
import { currentTeamOverrides } from './athlete-overrides'
import type { SourceLink } from '@/types'

// Athlete facts come from src/data/athletes-snapshot.json (run `node scripts/fetch-athletes.mjs`; add people in
// src/data/athlete-ids.json). Source: Wikidata (CC0). It can lag behind real life, so every page shows the snapshot date.
// Photos: drop your own file at public/athletes/own/<slug>.jpg and it wins over the Wikimedia Commons one
// (which the script downloads only when the file has a free licence, with its credit).
export const ATHLETES_SNAPSHOT = snapshot.fetchedAt
export const ATHLETES_SOURCE = { label: 'Wikidata', url: 'https://www.wikidata.org/' }

interface Spell {
  id: string
  name: string
  national: boolean
  from?: string
  to?: string
  caps?: number
  goals?: number
  league?: string
}
interface Raw {
  qid: string
  name: string
  birth?: string
  death?: string
  gender?: 'male' | 'female'
  birthPlace?: string
  citizenship: string[]
  sports: string[]
  positions: string[]
  heightCm?: number
  clubs: Spell[]
  nationalTeams: Spell[]
  wikipedia: { en?: string; fr?: string }
  commons?: { path: string; credit: string; page: string }
}

export interface Athlete {
  slug: string
  qid: string
  name: string
  birth?: string
  gender?: 'male' | 'female'
  birthPlace?: string
  citizenship: string[]
  sport?: string
  positions: string[]
  heightCm?: number
  clubs: Spell[]
  /** verified current team (see athlete-overrides.ts); never taken from Wikidata */
  current?: { team: string; asOf: string; source: SourceLink }
  /** senior Haiti team record, when the athlete has played for it */
  haitiSenior?: { caps?: number; goals?: number }
  /** youth/other national-team spells */
  otherNational: Spell[]
  photo?: { src: string; credit?: string; page?: string }
  wikipedia: { en?: string; fr?: string }
  wikidata: string
}

const isHaitiSenior = (t: Spell) => t.national && /^haiti\b/i.test(t.name) && !/under-\d+/i.test(t.name)
const hasOwn = (slug: string) => existsSync(path.join(process.cwd(), 'public', 'athletes', 'own', `${slug}.jpg`))

export const athletes: Athlete[] = Object.entries(snapshot.athletes as unknown as Record<string, Raw>)
  .map(([slug, a]) => {
    const senior = a.nationalTeams.find(isHaitiSenior)
    const own = hasOwn(slug)
    return {
      slug,
      qid: a.qid,
      name: a.name,
      birth: a.birth,
      gender: a.gender,
      birthPlace: a.birthPlace,
      citizenship: a.citizenship,
      sport: a.sports[0],
      positions: a.positions,
      heightCm: a.heightCm,
      clubs: a.clubs,
      current: currentTeamOverrides[slug],
      haitiSenior: senior ? { caps: senior.caps, goals: senior.goals } : undefined,
      otherNational: a.nationalTeams.filter((t) => !isHaitiSenior(t)),
      photo: own
        ? { src: `/athletes/own/${slug}.jpg` }
        : a.commons
          ? { src: a.commons.path, credit: a.commons.credit, page: a.commons.page }
          : undefined,
      wikipedia: a.wikipedia,
      wikidata: `https://www.wikidata.org/wiki/${a.qid}`,
    } satisfies Athlete
  })
  // Haiti internationals first (most caps first), then the rest alphabetically.
  .sort((x, y) => (y.haitiSenior?.caps ?? -1) - (x.haitiSenior?.caps ?? -1) || x.name.localeCompare(y.name))

export const athleteBySlug = (slug: string) => athletes.find((a) => a.slug === slug)
export const athleteSports = Array.from(new Set(athletes.map((a) => a.sport).filter(Boolean) as string[]))

export function ageOf(birth?: string, now = new Date()): number | undefined {
  if (!birth || birth.length < 10) return undefined
  const b = new Date(birth)
  let age = now.getUTCFullYear() - b.getUTCFullYear()
  if (now.getUTCMonth() < b.getUTCMonth() || (now.getUTCMonth() === b.getUTCMonth() && now.getUTCDate() < b.getUTCDate())) age--
  return age
}
