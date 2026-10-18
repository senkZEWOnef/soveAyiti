import type { Metadata } from 'next'
import Link from 'next/link'
import { artists, artistGenres, ARTISTS_SNAPSHOT } from '@/data/artists'
import { PageHeader } from '@/components/Shared'
import { ArtistCard } from '@/components/ArtistCard'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getMusicT } from '@/i18n/music'

export function generateMetadata(): Metadata {
  const m = getMusicT()
  return { title: m.metaTitle, description: m.subtitle }
}

export default function ArtistsPage({ searchParams }: { searchParams: { genre?: string } }) {
  const { lang } = getT()
  const m = getMusicT()
  const genre = artistGenres.find((g) => g === searchParams.genre)
  const shown = artists.filter((a) => !genre || a.genres.includes(genre))
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold ${on ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-300 text-navy-800 hover:border-navy-600'}`

  return (
    <>
      <PageHeader eyebrow={m.eyebrow} title={m.title} subtitle={m.subtitle} />
      <div className="container-max py-8 sm:py-14">
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={m.byGenre}>
          <Link href="/kilti/atis" className={chip(!genre)}>{m.all} ({artists.length})</Link>
          {artistGenres.map((g) => (
            <Link key={g} href={`/kilti/atis?genre=${encodeURIComponent(g)}`} className={chip(genre === g)}>
              {m.genres[g] ?? g} ({artists.filter((a) => a.genres.includes(g)).length})
            </Link>
          ))}
        </div>
        <p className="mb-4 text-sm text-navy-600" aria-live="polite">{shown.length ? m.count(nf(shown.length)) : m.none}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {shown.map((a) => <ArtistCard key={a.slug} artist={a} />)}
        </div>
        <p className="mt-8 max-w-3xl text-xs text-navy-500">{m.dataNote(formatDate(ARTISTS_SNAPSHOT, lang))}</p>
      </div>
    </>
  )
}
