import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import Carousel from '@/components/Carousel'
import { candidates } from '@/data/candidates'
import type { CandidateQuote } from '@/data/quotes'
import { getT } from '@/i18n/server'
import { localizeCandidate } from '@/i18n/content'
import { formatDate } from '@/lib/utils'

function QuoteCard({ q }: { q: CandidateQuote }) {
  const { lang, t } = getT()
  const raw = candidates.find((c) => c.slug === q.candidateSlug)
  if (!raw) return null
  const c = localizeCandidate(raw, lang)
  const initials = c.name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const { author, outlet, title, url } = q.source
  return (
    <figure className="card flex h-full flex-col !p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-100">
          {c.photo ? (
            <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="56px" className="object-cover object-top" />
          ) : (
            <span className="flex h-full items-center justify-center text-lg font-bold text-navy-400" aria-hidden>{initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <Link href={`/kandida/${c.slug}`} className="block font-bold leading-snug text-navy-900 hover:text-flag-600">{c.name}</Link>
          <p className="text-xs text-navy-600">{c.office}</p>
        </div>
      </div>

      <blockquote lang={q.language} className="mt-4 flex-1 font-serif text-lg leading-snug text-navy-900">
        <span aria-hidden className="text-flag-600">«&nbsp;</span>{q.quote}<span aria-hidden className="text-flag-600">&nbsp;»</span>
      </blockquote>
      {q.coverage && (
        <p lang={q.language} className="mt-3 border-l-2 border-cream-300 pl-3 text-sm italic leading-relaxed text-navy-700">{q.coverage}</p>
      )}

      <figcaption className="mt-4 border-t border-cream-300 pt-3 text-xs leading-relaxed text-navy-600">
        <span className="font-semibold">{t.quotes.credit}:</span>{' '}
        <cite lang={q.language}>{title}</cite>
        {' · '}{t.quotes.by} {author}, {outlet} · {formatDate(q.date, lang)}
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t.quotes.readAria(outlet)} className="mt-1.5 flex items-center gap-1 font-semibold text-navy-800 underline hover:text-flag-600">
          {t.quotes.read} <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </figcaption>
    </figure>
  )
}

export default function QuoteCarousel({ quotes }: { quotes: CandidateQuote[] }) {
  const { t } = getT()
  if (quotes.length === 0) return null
  return (
    <>
      <Carousel label={t.quotes.label} itemClass="w-[88%] sm:w-[60%] lg:w-[40%]">
        {quotes.map((q) => <QuoteCard key={q.id} q={q} />)}
      </Carousel>
      <p className="mt-3 text-xs text-navy-600">{t.quotes.note}</p>
    </>
  )
}
