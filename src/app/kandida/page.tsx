import type { Metadata } from 'next'
import Link from 'next/link'
import { candidates, departments, officeKeys, statusTone } from '@/data/candidates'
import { CandidateCard, ElectionNotice, PageHeader, StatusBadge } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import { REGISTRATION_SNAPSHOT } from '@/data/candidates'
import { getT } from '@/i18n/server'
import type { OfficeKey } from '@/types'

export function generateMetadata(): Metadata {
  return { title: getT().t.list.metaTitle }
}

const PAGE_SIZE = 8

type Params = { office?: string; dept?: string; q?: string; page?: string }

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function href(params: Params, overrides: Params = {}) {
  const merged = { ...params, ...overrides }
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) if (v && !(k === 'page' && v === '1')) qs.set(k, v)
  const s = qs.toString()
  return s ? `/kandida?${s}` : '/kandida'
}

export default function CandidatesPage({ searchParams }: { searchParams: Params }) {
  const { lang, t } = getT()
  const l = t.list
  const office = officeKeys.find((k) => k === searchParams.office) as OfficeKey | undefined
  const dept = departments.includes(searchParams.dept ?? '') ? searchParams.dept : undefined
  const q = (searchParams.q ?? '').trim().slice(0, 60)
  const params: Params = { office, dept, q: q || undefined }

  const needle = normalize(q)
  const filtered = candidates.filter(
    (c) =>
      (!office || c.officeKey === office) &&
      (!dept || c.department === dept) &&
      (!needle || normalize(`${c.name} ${c.affiliation ?? ''} ${c.locality ?? ''}`).includes(needle)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(Math.max(parseInt(searchParams.page ?? '1', 10) || 1, 1), pages)
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const filtering = Boolean(office || dept || q)
  const count = (key: OfficeKey) => candidates.filter((c) => c.officeKey === key).length
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')

  const select = 'w-full rounded-lg border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900'
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-300 text-navy-800 hover:border-navy-600'}`

  return (
    <>
      <PageHeader eyebrow={l.eyebrow} title={l.title} subtitle={l.subtitle(nf(candidates.length))} />
      <div className="container-max section">
        <form method="get" action="/kandida" className="mb-8 rounded-xl border border-cream-300 bg-white p-4" role="search" aria-label={l.filterLabel}>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={l.office}>
            <Link href={href(params, { office: undefined, page: undefined })} className={chip(!office)}>
              {l.all} ({candidates.length})
            </Link>
            {officeKeys.map((k) => (
              <Link key={k} href={href(params, { office: k, page: undefined })} className={chip(office === k)}>
                {t.offices[k]} ({count(k)})
              </Link>
            ))}
          </div>
          {office && <input type="hidden" name="office" value={office} />}
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              {l.department}
              <select name="dept" defaultValue={dept ?? ''} className={`${select} mt-1 normal-case`}>
                <option value="">{l.allDepartments}</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              {l.search}
              <input type="search" name="q" defaultValue={q} maxLength={60} placeholder={l.placeholder} className={`${select} mt-1 normal-case`} />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">{l.filter}</button>
              {filtering && <Link href="/kandida" className="btn-outline">{l.reset}</Link>}
            </div>
          </div>
          <p className="mt-3 text-xs text-navy-500">{l.presidentNote}</p>
        </form>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <p className="mb-4 text-sm text-navy-600" aria-live="polite">
              {filtered.length === 0 ? l.none : l.count(nf(filtered.length), page, pages)}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {shown.map((c) => <CandidateCard key={c.slug} candidate={c} />)}
            </div>

            {pages > 1 && (
              <nav className="mt-8 flex items-center justify-between gap-4 text-sm font-semibold" aria-label={l.pagination}>
                {page > 1 ? <Link href={href(params, { page: String(page - 1) })} className="btn-outline">{l.prev}</Link> : <span />}
                <span className="text-navy-600">{l.pageOf(page, pages)}</span>
                {page < pages ? <Link href={href(params, { page: String(page + 1) })} className="btn-outline">{l.next}</Link> : <span />}
              </nav>
            )}
          </div>

          <div className="space-y-6 lg:col-span-1">
            <ElectionNotice />
            <div className="card">
              <h2 className="font-sans text-base font-bold">{l.statusMeaning}</h2>
              <ul className="mt-4 space-y-4 text-sm text-navy-700">
                {(Object.keys(statusTone) as (keyof typeof statusTone)[]).map((k) => (
                  <li key={k}>
                    <StatusBadge status={k} />
                    <p className="mt-1">{t.status[k].long}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-navy-500">{l.statusNote}</p>
            </div>
            <p className="text-xs text-navy-500">{l.snapshotNote(formatDate(REGISTRATION_SNAPSHOT, lang))}</p>
          </div>
        </div>
      </div>
    </>
  )
}
