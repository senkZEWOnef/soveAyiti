import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { communesOf, departmentBySlug, departmentList, sitesOf } from '@/data/peyi'
import { PageHeader } from '@/components/Shared'
import { getPeyi } from '@/i18n/peyi'

export function generateStaticParams() {
  return departmentList.map((d) => ({ dept: d.slug }))
}

export function generateMetadata({ params }: { params: { dept: string } }): Metadata {
  const d = departmentBySlug(params.dept)
  return { title: d ? `${d.name} · ${getPeyi().eyebrow}` : getPeyi().eyebrow, description: d?.summary }
}

export default function DepartmentPage({ params }: { params: { dept: string } }) {
  const p = getPeyi()
  const d = departmentBySlug(params.dept)
  if (!d) notFound()
  const list = communesOf(d.key)
  const sites = sitesOf(d.slug)
  const h = 'font-sans text-sm font-bold uppercase tracking-widest text-flag-600'

  return (
    <>
      <PageHeader eyebrow={`${p.eyebrow} · ${d.key}`} title={d.name} subtitle={`${p.capital}: ${d.capital}. ${d.summary}`} />
      <div className="container-max section">
        <p className="mb-6 text-sm"><Link href="/peyi" className="text-navy-600 underline hover:text-flag-600">← {p.back}</Link></p>

        <section>
          <h2 className={h}>{p.challengesTitle}</h2>
          {sites.length === 0 ? (
            <p className="mt-3 text-sm italic text-navy-500">{p.noChallenges}</p>
          ) : (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {sites.map((s) => (
                <Link key={s.slug} href={`/peyi/${d.slug}/${s.slug}`} className="card group">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{s.kind} · {s.commune}</p>
                  <h3 className="mt-1 text-xl font-bold text-navy-900 group-hover:text-flag-600">{s.name}</h3>
                  <p className="mt-2 text-sm text-navy-700">{s.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 border-t border-cream-300 pt-8">
          <h2 className={h}>{p.highlights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {d.highlights.map((x) => (
              <div key={x.title} className="rounded-xl border border-cream-300 bg-white p-4">
                <h3 className="font-bold text-navy-900">{x.title}</h3>
                <p className="mt-1 text-sm text-navy-700">{x.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs italic text-navy-500">{p.draftNote}</p>
        </section>

        <section className="mt-10 border-t border-cream-300 pt-8">
          <h2 className={h}>{p.communesTitle} ({list.length})</h2>
          <p className="mt-2 text-sm text-navy-600">{p.communesNote}</p>
          <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.name} className="flex justify-between gap-3 border-b border-cream-200 py-1.5">
                <Link href={`/peyi?dept=${encodeURIComponent(d.key)}&loc=${encodeURIComponent(c.name)}`} className="font-semibold text-navy-900 hover:text-flag-600">{c.name}</Link>
                <span className="text-navy-500">{p.mayorsN(c.mayors)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <Link className="font-semibold underline" href={`/kandida?dept=${encodeURIComponent(d.key)}`}>{p.candidatesInDept} →</Link>
          </p>
        </section>
      </div>
    </>
  )
}
