import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { Article, Candidate } from '@/types'
import { categoryLabels } from '@/data/articles'
import { statusLabels } from '@/data/candidates'
import { electionStatus, site } from '@/data/site'
import { formatDate } from '@/lib/utils'

export function IndependenceBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wider">
      <ShieldCheck className="h-4 w-4 text-flag-500" aria-hidden />
      {site.independence.map((t, i) => (
        <span key={t} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-flag-500">•</span>}
          {t}
        </span>
      ))}
    </div>
  )
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="border-b border-cream-300 bg-cream-50">
      <div className="container-max py-12 sm:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold text-navy-900 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-navy-700">{subtitle}</p>}
      </div>
    </div>
  )
}

export function StatusBadge({ status, short = false }: { status: Candidate['status']; short?: boolean }) {
  const s = statusLabels[status]
  const label = short && status === 'registered' ? 'Prelimine' : s.ht
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.tone}`} title={s.fr}>
      {label}
    </span>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  const cat = categoryLabels[article.category]
  return (
    <Link href={`/atik/${article.slug}`} className="card group flex h-full flex-col">
      <p className="eyebrow">{cat.ht}</p>
      <h3 className="mt-2 text-xl font-bold leading-snug text-navy-900 group-hover:text-flag-600">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">{article.excerpt}</p>
      <p className="mt-4 text-xs text-navy-500">
        {article.author} · {formatDate(article.date)}
      </p>
    </Link>
  )
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link href={`/kandida/${candidate.slug}`} className="card group flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={candidate.status} short />
        {candidate.affiliation && (
          <span className="rounded border border-navy-300 px-2 py-0.5 text-[11px] font-bold uppercase text-navy-700">
            {candidate.affiliation}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold text-navy-900 group-hover:text-flag-600">{candidate.name}</h3>
      <p className="mt-1 text-sm text-navy-700">Pòs: {candidate.office}</p>
      <p className="mt-auto pt-5 text-xs text-navy-500">
        Dènye revizyon: {formatDate(candidate.lastReviewed)}
      </p>
    </Link>
  )
}

export function ElectionNotice() {
  return (
    <aside className="rounded-xl border border-flag-500/40 bg-white p-5" aria-label="Eta kalandriye elektoral la">
      <p className="eyebrow">Kalandriye elektoral</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-800">{electionStatus.summary}</p>
      <p className="mt-1 text-xs text-navy-500">{electionStatus.summaryFr}</p>
      <p className="mt-3 text-xs font-semibold text-navy-700">
        Dènye verifikasyon: {formatDate(electionStatus.lastVerified)}
      </p>
      <a href={electionStatus.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs underline">
        Sous: {electionStatus.source.label}
      </a>
      {electionStatus.items.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {electionStatus.items.map((i) => (
            <li key={i.label}>
              {i.label} — {formatDate(i.date)}{' '}
              <a href={i.source.url} className="underline" target="_blank" rel="noopener noreferrer">
                {i.source.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  href,
  cta = 'Wè tout',
}: {
  eyebrow: string
  title: string
  href?: string
  cta?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-bold text-navy-900">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden items-center gap-1 text-sm font-semibold text-navy-700 hover:text-flag-600 sm:flex">
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function CommentsNotice() {
  return (
    <section className="mt-12 rounded-xl border border-dashed border-navy-300 bg-cream-50 p-6" aria-labelledby="komante">
      <h2 id="komante" className="font-sans text-base font-bold text-navy-900">
        Kòmantè lektè yo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-700">
        Kòmantè yo se opinyon lektè yo, yo pa fè pati rapò editoryal nou an e nou pa verifye yo. Dezakò
        pèmèt; menas, piblikasyon adrès prive, vòlè idantite, spam ak akizasyon san prèv prezante kòm fè yo
        retire.
      </p>
      {site.social.facebook ? (
        <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">
          Diskite sou Facebook
        </a>
      ) : (
        <p className="mt-3 text-xs text-navy-500">Lyen diskisyon an ap ajoute lè paj la louvri.</p>
      )}
    </section>
  )
}
