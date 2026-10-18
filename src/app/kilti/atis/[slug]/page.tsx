import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Music } from 'lucide-react'
import { artistBySlug, artists, ARTISTS_SNAPSHOT } from '@/data/artists'
import ShareButtons from '@/components/ShareButtons'
import { describeArtist } from '@/lib/artistText'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getMusicT } from '@/i18n/music'

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = getMusicT()
  const a = artistBySlug(params.slug)
  if (!a) return { title: m.metaTitle }
  const description = describeArtist(a, m).summary
  return { title: m.metaTitleOne(a.name), description, openGraph: { title: m.metaTitleOne(a.name), description } }
}

const fullDate = (d: string | undefined, lang: Parameters<typeof formatDate>[1]) => (d ? (d.length >= 10 ? formatDate(d, lang) : d) : undefined)

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const { lang } = getT()
  const m = getMusicT()
  const a = artistBySlug(params.slug)
  if (!a) notFound()

  const { genres, jobs, instruments, summary } = describeArtist(a, m)
  const nd = <span className="italic text-navy-300">{m.notDocumented}</span>
  const wiki = a.wikipedia[lang] ?? a.wikipedia.en ?? a.wikipedia.fr ?? a.wikipedia.ht
  const note = m.crossNote[a.slug]
  const cross = m.crossLink[a.slug]
  const isGroup = a.kind === 'group'

  const fact = (label: string, value: React.ReactNode) => (
    <div className="border-t border-navy-700 py-3 sm:border-t-0 sm:py-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-300">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-cream-50">{value}</dd>
    </div>
  )

  return (
    <>
      <div className="bg-navy-800 text-cream-50">
        <div className="container-max py-8 sm:py-14">
          <Link href="/kilti/atis" className="inline-flex items-center gap-1 text-sm text-navy-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {m.back}
          </Link>
          <div className="mt-6 grid gap-8 md:grid-cols-3 md:items-center">
            <div className="order-2 md:order-none md:col-span-2">
              <p className="eyebrow !text-flag-500">{[isGroup ? m.group : m.person, genres[0]].filter(Boolean).join(' · ')}</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">{a.name}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">{summary}</p>
              {note && (
                <p className="mt-4 max-w-xl rounded-lg border border-navy-600 bg-navy-900/40 p-3 text-sm text-navy-100">
                  {note}{' '}
                  {cross && <Link href={cross.href} className="font-semibold text-white underline">{cross.label}</Link>}
                </p>
              )}
              <ShareButtons text={m.shareProfile(a.name)} className="mt-6 [&_span]:text-navy-200" />
            </div>
            <figure className="order-1 mx-auto w-full max-w-[11rem] md:order-none md:max-w-[15rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-navy-600 bg-navy-700">
                {a.photo ? (
                  <Image src={a.photo.src} alt={a.name} fill priority sizes="240px" className="object-cover object-top" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-navy-300">
                    <Music className="h-12 w-12" aria-hidden />
                    <span className="text-xs">{m.photoPlaceholder}</span>
                  </div>
                )}
              </div>
              {a.photo?.credit && (
                <figcaption className="mt-1 text-[11px] text-navy-300">
                  {m.photoCredit} {a.photo.credit}
                  {a.photo.page && <> · <a href={a.photo.page} target="_blank" rel="noopener noreferrer" className="underline">Commons</a></>}
                </figcaption>
              )}
            </figure>
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-1 rounded-xl border border-navy-700 bg-navy-900/40 p-5 sm:grid-cols-2 sm:gap-y-5 lg:grid-cols-4">
            {fact(isGroup ? m.facts.formed : m.facts.born, fullDate(a.start, lang) ?? nd)}
            {a.end && !isGroup && fact(m.facts.died, fullDate(a.end, lang))}
            {fact(isGroup ? m.facts.placeFormed : m.facts.place, a.place ?? nd)}
            {!isGroup && fact(m.facts.citizenship, a.citizenship.length ? a.citizenship.join(', ') : nd)}
            {fact(m.facts.genres, genres.length ? genres.join(', ') : nd)}
            {!isGroup && fact(m.facts.occupations, jobs.length ? jobs.join(', ') : nd)}
            {instruments.length > 0 && fact(m.facts.instruments, instruments.join(', '))}
            {a.pseudonyms.length > 0 && fact(m.facts.aka, a.pseudonyms.join(', '))}
          </dl>
        </div>
      </div>

      <div className="container-max max-w-3xl pb-16">
        <section className="py-8">
          <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{m.links}</h2>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {a.website && <a className="text-navy-600 underline hover:text-flag-600" href={a.website} target="_blank" rel="noopener noreferrer">{m.website}</a>}
            {wiki && <a className="text-navy-600 underline hover:text-flag-600" href={wiki} target="_blank" rel="noopener noreferrer">{m.wikipedia}</a>}
            <a className="text-navy-600 underline hover:text-flag-600" href={a.wikidata} target="_blank" rel="noopener noreferrer">{m.wikidata}</a>
          </p>
          <p className="mt-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-700">
            {m.dataNote(formatDate(ARTISTS_SNAPSHOT, lang))}{' '}
            <Link href="/kontak" className="font-semibold underline">{m.reportError}</Link>
          </p>
        </section>
      </div>
    </>
  )
}
