import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { presidentialCandidates } from '@/data/candidates'
import { PageHeader, StatusBadge } from '@/components/Shared'
import { initialsOf } from '@/components/AthleteCard'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getTools } from '@/i18n/tools'
import { localizeCandidate } from '@/i18n/content'
import type { Candidate } from '@/types'

export function generateMetadata(): Metadata {
  return { title: getTools().compare.metaTitle, description: getTools().compare.subtitle }
}

export default function ComparePage({ searchParams }: { searchParams: { a?: string; b?: string } }) {
  const { lang, t } = getT()
  const c = getTools().compare
  const list = presidentialCandidates.map((x) => localizeCandidate(x, lang)).sort((x, y) => x.name.localeCompare(y.name))
  const a = list.find((x) => x.slug === searchParams.a)
  const b = list.find((x) => x.slug === searchParams.b)
  const ready = a && b && a.slug !== b.slug
  const select = 'w-full rounded-lg border border-navy-300 bg-white px-3 py-2.5 text-base text-navy-900 sm:text-sm'
  const nd = <span className="italic text-navy-500">{c.notDocumented}</span>

  const rows: { label: string; cell: (x: Candidate) => React.ReactNode }[] = ready
    ? [
        { label: c.party, cell: (x) => x.affiliation ?? nd },
        { label: c.status, cell: (x) => <StatusBadge status={x.status} short /> },
        { label: c.career, cell: (x) => (x.career.length ? <ul className="space-y-1">{x.career.map((i) => <li key={i}>{i}</li>)}</ul> : nd) },
        { label: c.education, cell: (x) => (x.education.length ? <ul className="space-y-1">{x.education.map((i) => <li key={i}>{i}</li>)}</ul> : nd) },
        {
          label: c.positions,
          cell: (x) =>
            x.positions.length ? (
              <ul className="space-y-2">
                {x.positions.map((p) => (
                  <li key={p.office + p.dates}>
                    <span className="font-semibold">{p.office}</span>
                    <span className="block text-xs text-navy-600">{p.dates}</span>
                  </li>
                ))}
              </ul>
            ) : nd,
        },
        {
          label: c.links,
          cell: (x) =>
            x.officialLinks?.length ? (
              <ul className="space-y-1">
                {x.officialLinks.slice(0, 4).map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="break-words underline hover:text-flag-600">{l.label}</a></li>
                ))}
              </ul>
            ) : nd,
        },
        { label: c.sources, cell: (x) => c.sourcesCount(x.sources.length) },
        { label: c.reviewed, cell: (x) => formatDate(x.lastReviewed, lang) },
      ]
    : []

  const head = (x: Candidate) => (
    <div className="flex flex-col items-center text-center">
      <div className="relative aspect-[4/5] w-full max-w-[9rem] overflow-hidden rounded-xl border border-cream-300 bg-navy-100">
        {x.photo ? (
          <Image src={x.photo} alt={t.hero.photoAlt(x.name)} fill sizes="(min-width:640px) 144px, 40vw" className="object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl font-bold text-navy-400" aria-hidden>{initialsOf(x.name)}</div>
        )}
      </div>
      <h2 className="mt-3 text-lg font-bold leading-snug text-navy-900 sm:text-xl">{x.name}</h2>
      <Link href={`/kandida/${x.slug}`} className="mt-1 text-xs font-semibold text-navy-600 underline hover:text-flag-600">{c.fullProfile}</Link>
    </div>
  )

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <div className="container-max py-8 sm:py-12">
        <form method="get" action="/konpare" className="grid gap-3 rounded-xl border border-cream-300 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          {(['a', 'b'] as const).map((k, i) => (
            <label key={k} className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              {i === 0 ? c.first : c.second}
              <select name={k} defaultValue={(k === 'a' ? a : b)?.slug ?? ''} className={`${select} mt-1 normal-case`} required>
                <option value="">{c.choose}</option>
                {list.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </label>
          ))}
          <button type="submit" className="btn-primary min-h-11">{c.submit}</button>
        </form>

        {!ready && (
          <p className="mt-8 rounded-lg border border-dashed border-navy-300 bg-cream-50 p-6 text-center text-navy-700">
            {a && b ? c.same : c.pickTwo}
          </p>
        )}

        {ready && a && b && (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-8">{head(a)}{head(b)}</div>
            {rows.map((r) => (
              <section key={r.label} className="mt-6 border-t border-cream-300 pt-4">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-flag-600">{r.label}</h3>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm leading-relaxed text-navy-800 sm:gap-8">
                  <div>{r.cell(a)}</div>
                  <div>{r.cell(b)}</div>
                </div>
              </section>
            ))}
            <p className="mt-8 flex flex-wrap items-center gap-4 text-sm">
              <Link href={`/konpare?a=${b.slug}&b=${a.slug}`} className="btn-outline">{c.swap}</Link>
              <span className="text-xs text-navy-500">{c.note}</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
