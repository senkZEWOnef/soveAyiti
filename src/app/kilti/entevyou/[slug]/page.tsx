import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { interviewBySlug, publishedInterviews } from '@/data/interviews'
import { artistBySlug } from '@/data/artists'
import ShareButtons from '@/components/ShareButtons'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getMusicT } from '@/i18n/music'

// Interviews are data (src/data/interviews.ts). With none published, every slug is a 404 and nothing is pre-rendered.
export const dynamicParams = true
export function generateStaticParams() {
  return publishedInterviews().map((i) => ({ slug: i.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { lang } = getT()
  const m = getMusicT()
  const i = interviewBySlug(params.slug)
  if (!i) return { title: m.metaTitle }
  return { title: m.interviews.metaTitle(i.title[lang]), description: i.intro[lang] }
}

export default function InterviewPage({ params }: { params: { slug: string } }) {
  const { lang } = getT()
  const m = getMusicT()
  const i = interviewBySlug(params.slug)
  if (!i) notFound()
  const artist = i.artistSlug ? artistBySlug(i.artistSlug) : undefined

  return (
    <>
      <div className="border-b border-cream-300 bg-cream-50">
        <div className="container-max max-w-3xl py-9 sm:py-14">
          <Link href="/kilti" className="inline-flex items-center gap-1 text-sm text-navy-600 hover:text-flag-600">
            <ArrowLeft className="h-4 w-4" /> {m.interviews.backAll}
          </Link>
          <p className="eyebrow mt-5">{m.interviews.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-5xl">{i.title[lang]}</h1>
          <p className="mt-4 text-base text-navy-700 sm:text-lg">{i.intro[lang]}</p>
          <p className="mt-4 text-xs text-navy-500">
            {m.interviews.on(formatDate(i.date, lang))} · {m.interviews.by} {i.recordedBy} · {m.interviews.lang[i.language]}
            {artist && <> · <Link href={`/kilti/atis/${artist.slug}`} className="underline">{artist.name}</Link></>}
          </p>
          <ShareButtons text={i.title[lang]} className="mt-5" />
        </div>
      </div>

      <div className="container-max max-w-3xl pb-16">
        <p className="my-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-700">{m.interviews.consent}</p>
        <dl className="space-y-6">
          {i.qa.map((item, n) => (
            <div key={n} className="border-t border-cream-300 pt-5">
              <dt className="font-serif text-lg font-bold text-navy-900">{item.q}</dt>
              <dd className="mt-2 whitespace-pre-line text-base leading-relaxed text-navy-800">{item.a}</dd>
            </div>
          ))}
        </dl>
        {i.sourceLinks.length > 0 && (
          <section className="mt-10 border-t border-cream-300 pt-6">
            <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{m.interviews.sources}</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {i.sourceLinks.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy-600 underline hover:text-flag-600">{s.label}</a></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
