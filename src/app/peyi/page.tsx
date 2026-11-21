import type { Metadata } from 'next'
import Link from 'next/link'
import { departments } from '@/data/candidates'
import { communes, departmentByKey, departmentList, sites, sitesOf } from '@/data/peyi'
import { PageHeader } from '@/components/Shared'
import AreaFilter, { type Area } from '@/components/AreaFilter'
import { getPeyi } from '@/i18n/peyi'

export function generateMetadata(): Metadata {
  return { title: getPeyi().metaTitle }
}

type Params = { dept?: string; loc?: string }

export default function PeyiPage({ searchParams }: { searchParams: Params }) {
  const p = getPeyi()
  const dept = departments.includes(searchParams.dept ?? '') ? searchParams.dept : undefined
  const areas: Area[] = communes.map((c) => ({ dept: c.dept, name: c.name }))
  const loc = areas.find((a) => a.name === searchParams.loc && (!dept || a.dept === dept))?.name
  const commune = loc ? communes.find((c) => c.name === loc && (!dept || c.dept === dept)) : undefined
  const shown = departmentList.filter((d) => !(commune?.dept ?? dept) || d.key === (commune?.dept ?? dept))
  const communeSites = commune ? sites.filter((s) => s.commune === commune.name && departmentByKey(commune.dept)?.slug === s.dept) : []
  const select = 'w-full rounded-lg border border-navy-300 bg-white px-3 py-2.5 text-base text-navy-900 sm:py-2 sm:text-sm'

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <div className="container-max section">
        <form method="get" action="/peyi" className="mb-8 rounded-xl border border-cream-300 bg-white p-4" role="search" aria-label={p.filterLabel}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <AreaFilter
              key={`${dept ?? ''}-${loc ?? ''}`}
              departments={departments}
              areas={areas}
              initialDept={dept ?? ''}
              initialArea={loc ?? ''}
              selectClass={select}
              labels={{ department: p.department, allDepartments: p.allDepartments, locality: p.commune, allLocalities: p.allCommunes }}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">{p.filter}</button>
              {(dept || loc) && <Link href="/peyi" className="btn-outline">{p.reset}</Link>}
            </div>
          </div>
        </form>

        {commune && (
          <section className="mb-10 rounded-xl border border-cream-300 bg-cream-50 p-5">
            <h2 className="text-2xl font-bold text-navy-900">{commune.name} <span className="text-base font-normal text-navy-600">· {commune.dept}</span></h2>
            <p className="mt-2 text-sm text-navy-700">
              {p.mayorsN(commune.mayors)} ·{' '}
              <Link className="font-semibold underline" href={`/kandida?office=mayor&dept=${encodeURIComponent(commune.dept)}&loc=${encodeURIComponent(commune.name)}`}>{p.seeCandidates}</Link>
            </p>
            <h3 className="mt-5 font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{p.challengesTitle}</h3>
            {communeSites.length === 0 ? (
              <p className="mt-2 text-sm italic text-navy-500">{p.noChallenges}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {communeSites.map((s) => (
                  <li key={s.slug}><Link className="font-semibold text-navy-900 underline hover:text-flag-600" href={`/peyi/${s.dept}/${s.slug}`}>{s.name}</Link> <span className="text-sm text-navy-600">· {s.kind}</span></li>
                ))}
              </ul>
            )}
          </section>
        )}

        <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{p.departments}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d) => {
            const n = communes.filter((c) => c.dept === d.key).length
            return (
              <Link key={d.slug} href={`/peyi/${d.slug}`} className="card group flex flex-col">
                <h3 className="text-xl font-bold text-navy-900 group-hover:text-flag-600">{d.name} <span className="text-sm font-normal text-navy-500">· {d.key}</span></h3>
                <p className="mt-1 text-sm text-navy-600">{p.capital}: {d.capital}</p>
                <p className="mt-2 flex-1 text-sm text-navy-700">{d.summary}</p>
                <p className="mt-3 text-xs font-semibold text-navy-600">{p.communesCount(n)} · {p.sitesCount(sitesOf(d.slug).length)}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
