import { existsSync } from 'node:fs'
import path from 'node:path'
import snapshot from './artists-snapshot.json'

// Artist facts come from src/data/artists-snapshot.json (run `node scripts/fetch-artists.mjs`; add people in
// src/data/artist-ids.json). Source: Wikidata (CC0). Nothing here is written by hand: every sentence shown on the site is
// built from these fields. Photos: drop your own file at public/artists/own/<slug>.jpg and it wins over the Wikimedia
// Commons one (which the script downloads only when the file has a free licence, with its credit).
export const ARTISTS_SNAPSHOT = snapshot.fetchedAt
export const ARTISTS_SOURCE = { label: 'Wikidata', url: 'https://www.wikidata.org/' }

interface Raw {
  qid: string
  name: string
  kind: 'person' | 'group'
  birth?: string
  birthIsFormation?: boolean
  death?: string
  birthPlace?: string
  citizenship: string[]
  occupations: string[]
  genres: string[]
  instruments: string[]
  pseudonyms?: string[]
  website?: string
  wikipedia: { en?: string; fr?: string; ht?: string }
  commons?: { path: string; credit: string; page: string }
}

export interface Artist {
  slug: string
  qid: string
  name: string
  kind: 'person' | 'group'
  /** birth year/date, or formation year for groups */
  start?: string
  end?: string
  place?: string
  citizenship: string[]
  occupations: string[]
  genres: string[]
  instruments: string[]
  pseudonyms: string[]
  website?: string
  photo?: { src: string; credit?: string; page?: string }
  wikipedia: { en?: string; fr?: string; ht?: string }
  wikidata: string
}

// Politics-adjacent sites are not linked from a music profile (see music.ts crossNote for the neutral note).
const hideWebsite = new Set(['michel-martelly'])
// Non-music jobs go last so a musician's profile leads with the music.
const NON_MUSIC = /^(politician|actor|writer|association football player)$/
const hasOwn = (slug: string) => existsSync(path.join(process.cwd(), 'public', 'artists', 'own', `${slug}.jpg`))

export const artists: Artist[] = Object.entries(snapshot.artists as unknown as Record<string, Raw>)
  .map(([slug, a]) => {
    const own = hasOwn(slug)
    const jobs = Array.from(new Set(a.occupations.filter((o) => o !== 'Liedermacher'))).sort((x, y) => Number(NON_MUSIC.test(x)) - Number(NON_MUSIC.test(y)))
    return {
      slug,
      qid: a.qid,
      name: a.name,
      kind: a.kind,
      start: a.birth,
      end: a.death,
      place: a.birthPlace,
      citizenship: a.citizenship,
      occupations: jobs,
      genres: a.genres,
      instruments: a.instruments,
      pseudonyms: (a.pseudonyms ?? []).filter((p) => p !== a.name).slice(0, 3),
      website: hideWebsite.has(slug) ? undefined : a.website,
      photo: own ? { src: `/artists/own/${slug}.jpg` } : a.commons ? { src: a.commons.path, credit: a.commons.credit, page: a.commons.page } : undefined,
      wikipedia: a.wikipedia,
      wikidata: `https://www.wikidata.org/wiki/${a.qid}`,
    } satisfies Artist
  })
  // Profiles with a photo first (the showcase looks better), then alphabetical.
  .sort((x, y) => Number(Boolean(y.photo)) - Number(Boolean(x.photo)) || x.name.localeCompare(y.name))

export const artistBySlug = (slug: string) => artists.find((a) => a.slug === slug)

/** Genres present in the data, most common first. */
export const artistGenres: string[] = (() => {
  const n = new Map<string, number>()
  artists.forEach((a) => a.genres.forEach((g) => n.set(g, (n.get(g) ?? 0) + 1)))
  return Array.from(n.entries()).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([g]) => g)
})()
