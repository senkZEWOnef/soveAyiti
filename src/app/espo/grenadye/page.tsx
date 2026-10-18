import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'
import athleteIds from '@/data/athlete-ids.json'
import { formatDate } from '@/lib/utils'
import { getLang } from '@/i18n/server'
import { WC_AS_OF, WC_SOURCES, getWorldCupT, wcMatches, wcSquad, wcStandings, type Pos, type TeamCode } from '@/i18n/worldcup'

export function generateMetadata(): Metadata {
  const w = getWorldCupT()
  return { title: w.metaTitle, description: w.metaDescription, openGraph: { title: w.metaTitle, description: w.metaDescription } }
}

const known = new Set((athleteIds as { slug: string }[]).map((a) => a.slug))
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const
const positions: Pos[] = ['GK', 'DF', 'MF', 'FW']

export default function GrenadyePage() {
  const lang = getLang()
  const w = getWorldCupT()
  const asOf = formatDate(WC_AS_OF, lang)
  const hai = wcStandings.find((s) => s.team === 'HAI')!
  const name = (t: TeamCode) => w.teams[t]
  const tile = 'rounded-xl border border-navy-600 bg-navy-900/40 px-4 py-3'

  return (
    <>
      <section className="bg-navy-800 text-cream-50">
        <div className="container-max py-9 sm:py-16">
          <p className="eyebrow !text-flag-500">{w.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{w.title}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-snug text-cream-50 sm:text-xl">{w.heroLine}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-200 sm:text-base">{w.heroSub}</p>
          <p className="mt-2 text-sm text-navy-300">{w.coach}</p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [String(hai.pts), w.stats.pts],
              [String(hai.gf), w.stats.gf],
              [String(hai.ga), w.stats.ga],
              [w.position4, w.stats.pos],
            ].map(([v, l]) => (
              <div key={l} className={tile}>
                <dd className="font-serif text-3xl font-bold sm:text-4xl">{v}</dd>
                <dt className="mt-0.5 text-xs text-navy-200">{l}</dt>
              </div>
            ))}
          </dl>
          <ShareButtons text={w.heroLine} className="mt-6 [&_span]:text-navy-200" />
        </div>
      </section>

      <div className="container-max max-w-4xl py-10 sm:py-14">
        <section aria-labelledby="match">
          <h2 id="match" className="text-2xl font-bold text-navy-900 sm:text-3xl">{w.resultsTitle}</h2>
          <p className="mt-2 text-sm text-navy-600">{w.resultsIntro}</p>
          <ol className="mt-6 space-y-4">
            {wcMatches.map((m) => (
              <li key={m.n} className="card !p-4 sm:!p-5">
                <div className="flex items-center justify-between gap-3 text-xs text-navy-500">
                  <span className="font-semibold uppercase tracking-wide">{w.matchLabel(m.n)} · {formatDate(m.date, lang)}</span>
                  <span className="text-right">{w.atVenue(m.venue, m.city)}</span>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className={`text-right text-base font-bold sm:text-xl ${m.home === 'HAI' ? 'text-flag-700' : 'text-navy-900'}`}>{name(m.home)}</p>
                  <p className="rounded-lg bg-navy-800 px-3 py-1.5 font-serif text-2xl font-bold tabular-nums text-white sm:text-3xl">{m.homeGoals}–{m.awayGoals}</p>
                  <p className={`text-base font-bold sm:text-xl ${m.away === 'HAI' ? 'text-flag-700' : 'text-navy-900'}`}>{name(m.away)}</p>
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-navy-500">{w.scorersLabel}</p>
                <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-800">
                  {m.scorers.map((s, i) => (
                    <li key={i} className={s.team === 'HAI' ? 'font-semibold text-flag-700' : ''}>
                      {s.player} <span className="tabular-nums text-navy-500">{s.minute}</span>
                      {s.note === 'og' && <span className="text-xs text-navy-500"> ({w.ownGoal})</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12" aria-labelledby="klasman">
          <h2 id="klasman" className="text-xl font-bold text-navy-900 sm:text-2xl">{w.standingsTitle}</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-cream-300 bg-white">
            <table className="w-full min-w-[22rem] text-left text-sm">
              <thead className="bg-cream-200 text-navy-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">{w.cols.team}</th>
                  {(['p', 'w', 'd', 'l', 'gf', 'ga', 'pts'] as const).map((c) => <th key={c} className="px-2 py-2 text-right font-semibold">{w.cols[c]}</th>)}
                </tr>
              </thead>
              <tbody>
                {wcStandings.map((s) => (
                  <tr key={s.team} className={`border-t border-cream-300 tabular-nums ${s.team === 'HAI' ? 'bg-flag-500/10 font-semibold' : ''}`}>
                    <td className="px-3 py-2">{name(s.team)}</td>
                    {[s.p, s.w, s.d, s.l, s.gf, s.ga, s.pts].map((v, i) => <td key={i} className="px-2 py-2 text-right">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-navy-500">{w.standingsNote}</p>
        </section>

        <section className="mt-12 rounded-xl border border-cream-300 bg-white p-5 sm:p-6" aria-labelledby="gol">
          <h2 id="gol" className="text-xl font-bold text-navy-900">{w.haitiScorersTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy-800">
            {w.haitiScorers.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flag-600" aria-hidden />{t}</li>)}
          </ul>
          <p className="mt-3 text-xs text-navy-500">{w.haitiScorersNote}</p>
        </section>

        <section className="mt-14" aria-labelledby="kalifikasyon">
          <h2 id="kalifikasyon" className="text-2xl font-bold text-navy-900 sm:text-3xl">{w.qualTitle}</h2>
          <ol className="mt-6 space-y-5 border-l-2 border-cream-300 pl-5">
            {w.timeline.map((t) => (
              <li key={t.date + t.text.slice(0, 10)} className="relative">
                <span className="absolute -left-[1.62rem] top-1.5 h-3 w-3 rounded-full border-2 border-cream-100 bg-flag-600" aria-hidden />
                <p className="font-serif text-lg font-bold text-navy-900">{t.date}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-800">{t.text}</p>
                <p className="mt-1 text-xs text-navy-500"><a href={WC_SOURCES[t.source].url} {...ext} className="underline hover:text-flag-600">{WC_SOURCES[t.source].label}</a></p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-navy-700">{w.history}</p>
        </section>

        <section className="mt-14" aria-labelledby="jwe">
          <h2 id="jwe" className="text-2xl font-bold text-navy-900 sm:text-3xl">{w.squadTitle}</h2>
          <p className="mt-2 text-sm text-navy-600">{w.squadIntro}</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-navy-500"><span className="h-2 w-2 rounded-full bg-flag-600" aria-hidden /> {w.starter}. {w.starterNote}</p>
          <div className="mt-6 space-y-8">
            {positions.map((pos) => (
              <div key={pos}>
                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{w.pos[pos]}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {wcSquad.filter((p) => p.pos === pos).map((p) => {
                    const link = p.slug && known.has(p.slug)
                    const body = (
                      <>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-navy-900">
                            {p.startedVsMorocco && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-flag-600 align-middle" title={w.starter} aria-label={w.starter} />}
                            {p.name}
                          </span>
                          <span className="block truncate text-xs text-navy-500">{p.club}</span>
                        </span>
                        {link && <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-navy-700">{w.seeProfile} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>}
                      </>
                    )
                    return (
                      <li key={p.name}>
                        {link ? (
                          <Link href={`/espo/atlet/${p.slug}`} className="card flex min-h-12 items-center justify-between gap-3 !p-3 hover:border-navy-400">{body}</Link>
                        ) : (
                          <div className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-3">{body}</div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center"><Link href="/espo/atlet" className="btn-outline">{w.moreAthletes}</Link></p>
        </section>

        <section className="mt-14 rounded-xl border border-cream-300 bg-white p-5 sm:p-6" aria-labelledby="sous">
          <h2 id="sous" className="text-lg font-bold text-navy-900">{w.sourcesTitle}</h2>
          <p className="mt-1 text-xs font-semibold text-navy-600">{w.asOf(asOf)}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {Object.values(WC_SOURCES).map((s) => (
              <li key={s.url}><a href={s.url} {...ext} className="inline-flex items-start gap-1 underline hover:text-flag-600">{s.label} <ExternalLink className="mt-1 h-3 w-3 shrink-0" aria-hidden /></a></li>
            ))}
          </ul>
          <h3 className="mt-5 font-sans text-sm font-bold text-navy-900">{w.notesTitle}</h3>
          <ul className="mt-2 space-y-1.5 text-xs leading-snug text-navy-600">
            {w.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <p className="mt-4 text-xs text-navy-500">{w.disclaimer}</p>
        </section>
      </div>
    </>
  )
}
