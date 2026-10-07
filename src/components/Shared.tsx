import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { Article, Candidate } from '@/types'
import { categoryHref } from '@/data/articles'
import { statusTone } from '@/data/candidates'
import { electionStatus, site } from '@/data/site'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { localizeArticle, localizeCandidate } from '@/i18n/content'

export function IndependenceBar() {
  const { t } = getT()
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wider">
      <ShieldCheck className="h-4 w-4 text-flag-500" aria-hidden />
      {t.independence.map((label, i) => (
        <span key={label} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-flag-500">•</span>}
          {label}
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
  const { t } = getT()
  const s = t.status[status]
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusTone[status]}`} title={s.long}>
      {short && status === 'registered' ? s.short : s.label}
    </span>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  const { lang, t } = getT()
  const a = localizeArticle(article, lang)
  return (
    <Link href={`/atik/${a.slug}`} className="card group flex h-full flex-col">
      <p className="eyebrow">{t.categories[a.category]}</p>
      <h3 className="mt-2 text-xl font-bold leading-snug text-navy-900 group-hover:text-flag-600">{a.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">{a.excerpt}</p>
      <p className="mt-4 text-xs text-navy-500">
        {a.author} · {formatDate(a.date, lang)}
      </p>
    </Link>
  )
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { lang, t } = getT()
  const c = localizeCandidate(candidate, lang)
  const initials = c.name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const where = [c.locality, c.department].filter(Boolean).join(' · ')
  return (
    <Link href={`/kandida/${c.slug}`} className="card group flex h-full flex-col !p-0 overflow-hidden">
      <div className="relative aspect-[4/5] bg-navy-100">
        {c.photo ? (
          <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="(min-width:1024px) 15rem, (min-width:640px) 30vw, 90vw" className="object-cover object-top" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-navy-400">
            <span className="text-5xl font-bold" aria-hidden>{initials}</span>
            <span className="text-[11px]">{t.common.soon}</span>
          </div>
        )}
        {c.affiliation && (
          <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase text-navy-800">
            {c.affiliation}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold leading-snug text-navy-900 group-hover:text-flag-600">{c.name}</h3>
        <p className="mt-1 text-sm text-navy-700">
          {c.office}{c.position ? ` · ${c.position}` : ''}
        </p>
        {where && <p className="text-xs text-navy-500">{where}</p>}
      </div>
    </Link>
  )
}

export function ElectionNotice() {
  const { lang, t } = getT()
  return (
    <aside className="rounded-xl border border-flag-500/40 bg-white p-5" aria-label={t.electionNotice.eyebrow}>
      <p className="eyebrow">{t.electionNotice.eyebrow}</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-800">{t.electionNotice.summary}</p>
      <p className="mt-3 text-xs font-semibold text-navy-700">
        {t.electionNotice.lastVerified} {formatDate(electionStatus.lastVerified, lang)}
      </p>
      <a href={electionStatus.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs underline">
        {t.electionNotice.source} {t.electionNotice.sourceLabel}
      </a>
      {electionStatus.items.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {electionStatus.items.map((i) => (
            <li key={i.label}>
              {i.label} — {formatDate(i.date, lang)}{' '}
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
  cta,
}: {
  eyebrow: string
  title: string
  href?: string
  cta?: string
}) {
  const { t } = getT()
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-bold text-navy-900">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden items-center gap-1 text-sm font-semibold text-navy-700 hover:text-flag-600 sm:flex">
          {cta ?? t.common.seeAll} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function CommentsNotice() {
  const { t } = getT()
  return (
    <section className="mt-12 rounded-xl border border-dashed border-navy-300 bg-cream-50 p-6" aria-labelledby="komante">
      <h2 id="komante" className="font-sans text-base font-bold text-navy-900">
        {t.comments.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-700">{t.comments.body}</p>
      {site.social.facebook ? (
        <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">
          {t.comments.discuss}
        </a>
      ) : (
        <p className="mt-3 text-xs text-navy-500">{t.comments.soon}</p>
      )}
    </section>
  )
}

export { categoryHref }
