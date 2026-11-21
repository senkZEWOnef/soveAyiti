import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { candidatesFor, departmentBySlug, replyFor, siteBySlug, sites } from '@/data/peyi'
import { PageHeader } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getPeyi } from '@/i18n/peyi'
import type { OfficeKey } from '@/types'

export function generateStaticParams() {
  return sites.map((s) => ({ dept: s.dept, site: s.slug }))
}

export function generateMetadata({ params }: { params: { dept: string; site: string } }): Metadata {
  const s = siteBySlug(params.dept, params.site)
  return { title: s ? `${s.name} · ${getPeyi().eyebrow}` : getPeyi().eyebrow, description: s?.summary }
}

const levels: OfficeKey[] = ['mayor', 'deputy', 'senator', 'president']
const tone: Record<string, string> = {
  notSent: 'bg-cream-200 text-navy-700',
  sent: 'bg-navy-100 text-navy-800',
  answered: 'bg-green-100 text-green-900',
  declined: 'bg-flag-100 text-flag-800',
}

export default function SitePage({ params }: { params: { dept: string; site: string } }) {
  const { lang } = getT()
  const p = getPeyi()
  const s = siteBySlug(params.dept, params.site)
  const d = departmentBySlug(params.dept)
  if (!s || !d) notFound()
  const h = 'font-sans text-sm font-bold uppercase tracking-widest text-flag-600'

  return (
    <>
      <PageHeader eyebrow={`${s.kind} · ${s.commune}, ${d.key}`} title={s.name} subtitle={s.summary} />
      <div className="container-max section">
        <p className="mb-6 text-sm">
          <Link href={`/peyi/${d.slug}`} className="text-navy-600 underline hover:text-flag-600">← {p.backDept(d.name)}</Link>
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className={h}>{p.whatWeKnow}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy-800">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="mt-4 text-xs text-navy-600">
              {p.sources}: {s.sources.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-flag-600">{x.label}</a>)} · {p.reviewed}: {formatDate(s.lastReviewed, lang)}
            </p>
          </section>
          <section>
            <h2 className={h}>{p.notYet}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm italic text-navy-600">{s.todo.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
        </div>

        <section className="mt-10 border-t border-cream-300 pt-8">
          <h2 className={h}>{p.howTitle}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy-700">{p.how.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        {levels.map((level) => {
          const ch = s.challenges.find((c) => c.level === level)
          if (!ch) return null
          const list = candidatesFor(s, level)
          return (
            <section key={level} className="mt-10 border-t border-cream-300 pt-8">
              <h2 className={h}>{p.levelHeading[level]} ({list.length})</h2>
              <blockquote className="mt-3 rounded-xl border-l-4 border-flag-600 bg-cream-50 p-4 text-base font-semibold text-navy-900">
                <span className="block text-xs font-bold uppercase tracking-wide text-navy-500">{p.asked}</span>
                {ch.question}
              </blockquote>
              <p className="mt-3 text-xs text-navy-600">{p.levelScope[level]}</p>
              {list.length === 0 ? (
                <p className="mt-3 text-sm italic text-navy-500">{p.noneFound}</p>
              ) : (
                <ul className="mt-3 divide-y divide-cream-200 rounded-xl border border-cream-300 bg-white">
                  {list.map((c) => {
                    const r = replyFor(s, c.slug)
                    return (
                      <li key={c.slug} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link href={`/kandida/${c.slug}`} className="font-semibold text-navy-900 hover:text-flag-600">
                            {c.name} {c.affiliation && <span className="text-xs font-bold uppercase text-navy-500">· {c.affiliation}</span>}
                          </Link>
                          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${tone[r.status]}`}>{p.status[r.status]}</span>
                        </div>
                        {r.status === 'answered' && r.text && (
                          <blockquote className="mt-2 border-l-2 border-navy-300 pl-3 text-sm text-navy-800">
                            {r.text}
                            <footer className="mt-1 text-xs text-navy-500">
                              {r.date && p.answerOn(formatDate(r.date, lang))}
                              {r.source && <> · <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="underline">{r.source.label}</a></>}
                            </footer>
                          </blockquote>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
        <p className="mt-10 text-xs text-navy-500">{p.prelimNote}</p>
      </div>
    </>
  )
}
