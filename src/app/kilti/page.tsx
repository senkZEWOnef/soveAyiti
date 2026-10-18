import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mic } from 'lucide-react'
import { byCategory } from '@/data/articles'
import { artists, artistGenres } from '@/data/artists'
import { publishedInterviews } from '@/data/interviews'
import { ArticleCard, PageHeader } from '@/components/Shared'
import { ArtistCard } from '@/components/ArtistCard'
import { getT } from '@/i18n/server'
import { getMusicT } from '@/i18n/music'
import { formatDate } from '@/lib/utils'

export function generateMetadata(): Metadata {
  return { title: getT().t.sections.culture.meta }
}

export default function Page() {
  const { lang, t } = getT()
  const s = t.sections.culture
  const m = getMusicT()
  const items = byCategory('culture').sort((a, b) => b.date.localeCompare(a.date))
  const published = publishedInterviews()
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const chip = 'rounded-full border border-navy-300 px-4 py-2 text-sm font-semibold text-navy-800 hover:border-navy-600'

  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

      <section className="container-max py-10 sm:py-14" aria-labelledby="atis">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{m.eyebrow}</p>
            <h2 id="atis" className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">{m.showcaseTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-navy-700 sm:text-base">{m.showcaseText}</p>
          </div>
          <Link href="/kilti/atis" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 hover:text-flag-600 sm:flex">
            {m.viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {artists.slice(0, 8).map((a) => <ArtistCard key={a.slug} artist={a} />)}
        </div>
        <p className="mt-6 text-center">
          <Link href="/kilti/atis" className="btn-outline">{m.viewAll} ({nf(artists.length)})</Link>
        </p>

        {artistGenres.length > 0 && (
          <div className="mt-10">
            <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{m.byGenre}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {artistGenres.map((g) => (
                <Link key={g} href={`/kilti/atis?genre=${encodeURIComponent(g)}`} className={chip}>
                  {m.genres[g] ?? g} ({artists.filter((a) => a.genres.includes(g)).length})
                </Link>
              ))}
            </div>
            <p className="mt-2 text-xs text-navy-500">{m.genreHint}</p>
          </div>
        )}
      </section>

      <section className="bg-navy-800 text-cream-50" aria-labelledby="entevyou">
        <div className="container-max py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
            <div className="lg:col-span-3">
              <p className="eyebrow !text-flag-500">{m.interviews.eyebrow}</p>
              <h2 id="entevyou" className="mt-2 text-3xl font-bold sm:text-4xl">{m.interviews.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">{m.interviews.text}</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link href="/kontak" className="btn-accent"><Mic className="h-4 w-4" aria-hidden /> {m.interviews.cta}</Link>
                <p className="text-sm text-navy-200">{m.interviews.ctaNote}</p>
              </div>
            </div>
            <div className="rounded-xl border border-navy-600 bg-navy-900/40 p-5 lg:col-span-2">
              <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-navy-200">{m.interviews.stepsTitle}</h3>
              <ol className="mt-4 space-y-3 text-sm text-navy-100">
                {m.interviews.steps.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-flag-600 text-xs font-bold text-white">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {published.length > 0 && (
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {published.map((i) => (
                <li key={i.slug}>
                  <Link href={`/kilti/entevyou/${i.slug}`} className="block rounded-xl border border-navy-600 bg-navy-900/40 p-5 hover:border-navy-300">
                    <p className="text-xs text-navy-300">{m.interviews.on(formatDate(i.date, lang))}</p>
                    <p className="mt-1 text-lg font-bold">{i.title[lang]}</p>
                    <p className="mt-2 text-sm font-semibold text-flag-500">{m.interviews.read}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="container-max section">
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{m.latest}</h2>
        {items.length === 0 ? (
          <p className="mt-4 text-navy-600">{m.noArticles}</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </section>
    </>
  )
}
