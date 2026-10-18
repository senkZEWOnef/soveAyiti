import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ageOf, athleteBySlug, athletes, ATHLETES_SNAPSHOT, ATHLETES_SOURCE } from '@/data/athletes'
import { initialsOf } from '@/components/AthleteCard'
import ShareButtons from '@/components/ShareButtons'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'

export function generateStaticParams() {
  return athletes.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { lang, t } = getT()
  const a = athleteBySlug(params.slug)
  if (!a) return { title: t.athletes.metaTitle }
  const l = t.athletes
  const description = l.summary(a.name, l.sports[a.sport ?? ''] ?? a.sport ?? '', a.current?.team, a.haitiSenior?.caps, a.haitiSenior?.goals)
  return { title: l.metaTitleOne(a.name), description, openGraph: { title: l.metaTitleOne(a.name), description } }
}

const period = (from?: string, to?: string) => {
  const y = (d?: string) => d?.slice(0, 4)
  if (!from && !to) return '—'
  if (from && to) return y(from) === y(to) ? y(from)! : `${y(from)} – ${y(to)}`
  return from ? `${y(from)} –` : `– ${y(to)}`
}

export default function AthletePage({ params }: { params: { slug: string } }) {
  const { lang, t } = getT()
  const l = t.athletes
  const a = athleteBySlug(params.slug)
  if (!a) notFound()

  const sport = a.sport ? l.sports[a.sport] ?? a.sport : undefined
  const positions = a.positions.map((p) => l.positions[p] ?? p).join(', ')
  const age = ageOf(a.birth)
  const nd = <span className="italic text-navy-500">{l.notDocumented}</span>
  const career = [...a.clubs].reverse()
  const youth = a.otherNational.filter((x) => x.caps !== undefined || x.goals !== undefined)

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
          <Link href="/espo/atlet" className="inline-flex items-center gap-1 text-sm text-navy-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {l.back}
          </Link>
          <div className="mt-6 grid gap-8 md:grid-cols-3 md:items-center">
            <div className="order-2 md:order-none md:col-span-2">
              <p className="eyebrow !text-flag-500">{[sport, positions].filter(Boolean).join(' · ')}</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">{a.name}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
                {l.summary(a.name, sport ?? '', a.current?.team, a.haitiSenior?.caps, a.haitiSenior?.goals)}
              </p>

              {a.haitiSenior && (
                <div className="mt-6 flex flex-wrap items-stretch gap-3">
                  <div className="rounded-xl bg-flag-600 px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{l.national}</p>
                    {a.haitiSenior.caps !== undefined || a.haitiSenior.goals !== undefined ? (
                      <>
                        <p className="mt-1 font-serif text-3xl font-bold">
                          {a.haitiSenior.caps ?? '—'} <span className="font-sans text-sm font-semibold">{l.caps}</span>
                          <span className="mx-2 text-white/50">·</span>
                          {a.haitiSenior.goals ?? '—'} <span className="font-sans text-sm font-semibold">{l.goals}</span>
                        </p>
                        <p className="mt-1 text-[11px] text-white/80">{l.statsAsOf(formatDate(ATHLETES_SNAPSHOT, lang))}</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm font-semibold">{l.notDocumented}</p>
                    )}
                  </div>
                </div>
              )}
              <ShareButtons text={l.shareProfile(a.name)} className="mt-6 [&_span]:text-navy-200" />
            </div>
            <figure className="order-1 mx-auto w-full max-w-[11rem] md:order-none md:max-w-[15rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-navy-600 bg-navy-700">
                {a.photo ? (
                  <Image src={a.photo.src} alt={t.hero.photoAlt(a.name)} fill priority sizes="240px" className="object-cover object-top" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-navy-300">
                    <span className="font-serif text-6xl font-bold" aria-hidden>{initialsOf(a.name)}</span>
                    <span className="text-xs">{l.photoPlaceholder}</span>
                  </div>
                )}
              </div>
              {a.photo?.credit && (
                <figcaption className="mt-1 text-[11px] text-navy-300">
                  {l.photoCredit} {a.photo.credit}
                  {a.photo.page && <> · <a href={a.photo.page} target="_blank" rel="noopener noreferrer" className="underline">Commons</a></>}
                </figcaption>
              )}
            </figure>
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-1 rounded-xl border border-navy-700 bg-navy-900/40 p-5 sm:grid-cols-2 sm:gap-y-5 lg:grid-cols-4">
            {fact(l.facts.born, a.birth ? `${a.birth.length >= 10 ? formatDate(a.birth, lang) : a.birth}${age !== undefined ? ` (${l.facts.age(age)})` : ''}` : nd)}
            {fact(l.facts.birthplace, a.birthPlace ?? nd)}
            {fact(l.facts.height, a.heightCm ? `${a.heightCm} cm` : nd)}
            {fact(l.facts.citizenship, a.citizenship.length ? a.citizenship.join(', ') : nd)}
            {fact(l.facts.currentClub, a.current ? (<>{a.current.team} <a href={a.current.source.url} target="_blank" rel="noopener noreferrer" className="text-xs font-normal text-navy-300 underline" title={a.current.source.label}>{l.source} · {formatDate(a.current.asOf, lang)}</a></>) : <span className="italic text-navy-300">{l.unverified}</span>)}
          </dl>
        </div>
      </div>

      <div className="container-max max-w-3xl pb-16">
        {career.length > 0 && (
          <section className="border-b border-cream-300 py-8" aria-labelledby="karyè">
            <h2 id="karyè" className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{l.career}</h2>
            <p className="mt-2 text-sm text-navy-600">{l.careerIntro}</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-navy-600">
                  <tr><th className="pb-2 pr-4 font-semibold">{l.colPeriod}</th><th className="pb-2 pr-4 font-semibold">{l.colClub}</th><th className="pb-2 pr-4 text-right font-semibold">{l.colApps}</th><th className="pb-2 text-right font-semibold">{l.colGoals}</th></tr>
                </thead>
                <tbody>
                  {career.map((c) => (
                    <tr key={c.id + (c.from ?? '')} className="border-t border-cream-300">
                      <td className="whitespace-nowrap py-2.5 pr-4 align-top tabular-nums text-navy-700">{period(c.from, c.to)}</td>
                      <td className="py-2.5 pr-4 align-top font-medium text-navy-900">{c.name}{c.league && <span className="block text-xs font-normal text-navy-500">{c.league}</span>}</td>
                      <td className="py-2.5 pr-4 text-right align-top tabular-nums">{c.caps ?? '—'}</td>
                      <td className="py-2.5 text-right align-top tabular-nums">{c.goals ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {youth.length > 0 && (
          <section className="border-b border-cream-300 py-8">
            <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{l.national_title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {youth.map((y) => (
                <li key={y.id} className="flex justify-between gap-4 border-t border-cream-300 pt-2">
                  <span className="text-navy-900">{y.name}</span>
                  <span className="shrink-0 tabular-nums text-navy-700">{y.caps ?? '—'} {l.caps} · {y.goals ?? '—'} {l.goals}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="py-8">
          <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{l.links}</h2>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {a.wikipedia[lang === 'ht' ? 'en' : lang] && (
              <a className="text-navy-600 underline hover:text-flag-600" href={a.wikipedia[lang === 'ht' ? 'en' : lang]} target="_blank" rel="noopener noreferrer">{l.wikipedia}</a>
            )}
            <a className="text-navy-600 underline hover:text-flag-600" href={a.wikidata} target="_blank" rel="noopener noreferrer">{ATHLETES_SOURCE.label}</a>
          </p>
          <p className="mt-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-700">
            {l.dataNote(formatDate(ATHLETES_SNAPSHOT, lang))}{' '}
            <Link href="/kontak" className="font-semibold underline">{l.reportError}</Link>
          </p>
        </section>
      </div>
    </>
  )
}
