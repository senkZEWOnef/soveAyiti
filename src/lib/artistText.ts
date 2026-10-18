import type { Artist } from '@/data/artists'
import { music } from '@/i18n/music'
import type { Lang } from '@/i18n/config'

type MT = (typeof music)[Lang]

const year = (d?: string) => d?.slice(0, 4)

/** Labels and the one-sentence summary, built only from the artist's data fields. */
export function describeArtist(a: Artist, m: MT) {
  const genres = a.genres.map((g) => m.genres[g] ?? g)
  const jobs = a.occupations.map((o) => m.occupations[o] ?? o)
  const instruments = a.instruments.map((i) => m.instruments[i] ?? i)
  const years = a.start ? `${year(a.start)}${a.end ? `–${year(a.end)}` : ''}` : ''
  const summary =
    a.kind === 'group'
      ? m.summaryGroup(a.name, year(a.start), a.place, genres.slice(0, 4).join(', ') || undefined)
      : m.summaryPerson(a.name, years, jobs.slice(0, 3).join(', '), a.place, genres.slice(0, 4).join(', ') || undefined)
  return { genres, jobs, instruments, summary }
}
