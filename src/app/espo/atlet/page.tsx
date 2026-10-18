import type { Metadata } from 'next'
import Link from 'next/link'
import { athletes, athleteSports, ATHLETES_SNAPSHOT } from '@/data/athletes'
import { PageHeader } from '@/components/Shared'
import { AthleteCard } from '@/components/AthleteCard'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'

export function generateMetadata(): Metadata {
  return { title: getT().t.athletes.metaTitle, description: getT().t.athletes.subtitle }
}

export default function AthletesPage({ searchParams }: { searchParams: { sport?: string } }) {
  const { lang, t } = getT()
  const l = t.athletes
  const sport = athleteSports.find((s) => s === searchParams.sport)
  const shown = athletes.filter((a) => !sport || a.sport === sport)
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold ${on ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-300 text-navy-800 hover:border-navy-600'}`

  return (
    <>
      <PageHeader eyebrow={l.eyebrow} title={l.title} subtitle={l.subtitle} />
      <div className="container-max py-8 sm:py-14">
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={l.facts.sport}>
          <Link href="/espo/atlet" className={chip(!sport)}>{l.all} ({athletes.length})</Link>
          {athleteSports.map((s) => (
            <Link key={s} href={`/espo/atlet?sport=${encodeURIComponent(s)}`} className={chip(sport === s)}>
              {l.sports[s] ?? s} ({athletes.filter((a) => a.sport === s).length})
            </Link>
          ))}
        </div>
        <p className="mb-4 text-sm text-navy-600" aria-live="polite">{shown.length ? l.count(nf(shown.length)) : l.none}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {shown.map((a) => <AthleteCard key={a.slug} athlete={a} />)}
        </div>
        <p className="mt-8 max-w-3xl text-xs text-navy-500">{l.dataNote(formatDate(ATHLETES_SNAPSHOT, lang))}</p>
      </div>
    </>
  )
}
