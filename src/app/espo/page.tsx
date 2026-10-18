import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { byCategory } from '@/data/articles'
import { athletes } from '@/data/athletes'
import { ArticleCard, PageHeader } from '@/components/Shared'
import { AthleteCard } from '@/components/AthleteCard'
import { getT } from '@/i18n/server'
import { getTools } from '@/i18n/tools'
import { getWorldCupT } from '@/i18n/worldcup'

export function generateMetadata(): Metadata {
  return { title: getT().t.sections.sports.meta }
}

export default function Page() {
  const { lang, t } = getT()
  const s = t.sections.sports
  const l = t.athletes
  const items = byCategory('sports').sort((a, b) => b.date.localeCompare(a.date))
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

      <section className="container-max py-10 sm:py-14" aria-labelledby="atlet">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{l.eyebrow}</p>
            <h2 id="atlet" className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">{l.hubTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-navy-700 sm:text-base">{l.hubText}</p>
          </div>
          <Link href="/espo/atlet" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 hover:text-flag-600 sm:flex">
            {l.viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {athletes.slice(0, 8).map((a) => <AthleteCard key={a.slug} athlete={a} />)}
        </div>
        <p className="mt-6 text-center">
          <Link href="/espo/atlet" className="btn-outline">{l.viewAll} ({nf(athletes.length)})</Link>
        </p>
      </section>

      <section className="border-b border-cream-300 bg-white">
        <div className="container-max flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">{getWorldCupT().eyebrow}</p>
            <h2 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">{getWorldCupT().title}</h2>
          </div>
          <Link href="/espo/grenadye" className="btn-primary shrink-0">{getWorldCupT().resultsTitle} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-navy-800 text-cream-50">
        <div className="container-max flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow !text-flag-500">{getTools().poll.eyebrow}</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">{getTools().poll.title}</h2>
          </div>
          <Link href="/espo/sondaj" className="btn-accent shrink-0">{getTools().poll.cta} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-t border-cream-300 bg-cream-50">
        <div className="container-max section">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{l.latestNews}</h2>
          {items.length === 0 ? (
            <p className="mt-4 text-navy-600">{t.common.noArticles}</p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
