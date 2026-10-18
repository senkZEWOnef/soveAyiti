import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { claimBySlug, claims } from '@/data/claims'
import { VerdictBadge } from '@/components/VerdictBadge'
import ShareButtons from '@/components/ShareButtons'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getTools } from '@/i18n/tools'

export function generateStaticParams() {
  return claims.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { lang } = getT()
  const c = claimBySlug(params.slug)
  if (!c) return { title: getTools().verify.metaTitle }
  return { title: getTools().verify.metaItem(c.claim[lang]), description: c.finding[lang].slice(0, 200) }
}

export default function ClaimPage({ params }: { params: { slug: string } }) {
  const { lang } = getT()
  const v = getTools().verify
  const c = claimBySlug(params.slug)
  if (!c) notFound()
  return (
    <div className="container-max max-w-3xl py-8 sm:py-14">
      <Link href="/verifye" className="inline-flex items-center gap-1 text-sm text-navy-600 hover:text-flag-600">
        <ArrowLeft className="h-4 w-4" /> {v.back}
      </Link>
      <p className="eyebrow mt-6">{v.title}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <VerdictBadge verdict={c.verdict} />
        <span className="text-sm text-navy-500">{v.checked} {formatDate(c.date, lang)}</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">{c.claim[lang]}</h1>

      <section className="mt-8 border-t border-cream-300 pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{v.finding}</h2>
        <p className="mt-3 text-lg leading-relaxed text-navy-800">{c.finding[lang]}</p>
      </section>

      <section className="mt-8 border-t border-cream-300 pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{v.sourcesTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {c.sources.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy-600 underline hover:text-flag-600">{s.label}</a></li>
          ))}
        </ul>
      </section>

      <ShareButtons text={`${v.title} ${c.claim[lang]}`} className="mt-8" />
      <div className="mt-8 rounded-xl border border-flag-500/40 bg-white p-5">
        <p className="text-sm text-navy-700">{v.sendText}</p>
        <Link href="/kontak" className="btn-accent mt-3">{v.sendCta}</Link>
      </div>
    </div>
  )
}
