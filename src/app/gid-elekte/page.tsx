import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ExternalLink, Phone, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/Shared'
import ShareButtons from '@/components/ShareButtons'
import { formatDate } from '@/lib/utils'
import { getLang } from '@/i18n/server'
import { CEP_ADDRESS, CEP_PHONES, GUIDE_LAST_VERIFIED, GUIDE_URLS, getGuideT, guideSources, type DateStatus } from '@/i18n/guide'

export function generateMetadata(): Metadata {
  const g = getGuideT()
  return { title: g.metaTitle, description: g.metaDescription, openGraph: { title: g.metaTitle, description: g.metaDescription } }
}

const statusStyle: Record<DateStatus, string> = {
  official: 'bg-navy-800 text-white',
  press: 'bg-navy-100 text-navy-800',
  unconfirmed: 'bg-flag-500/10 text-flag-700 ring-1 ring-flag-500/40',
}

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

export default function VoterGuidePage() {
  const lang = getLang()
  const g = getGuideT()
  const verified = formatDate(GUIDE_LAST_VERIFIED, lang)
  const dates = [...g.dates].sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return (
    <>
      <PageHeader eyebrow={g.eyebrow} title={g.title} subtitle={g.subtitle} />

      <div className="container-max max-w-4xl py-8 sm:py-12">
        <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-navy-700">
          <ShieldCheck className="h-4 w-4 text-flag-600" aria-hidden /> {g.verified}: {verified}
        </p>

        <div className="flex gap-3 rounded-xl border border-flag-500/50 bg-white p-4 sm:p-5" role="note">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-flag-600" aria-hidden />
          <div>
            <p className="font-bold text-navy-900">{g.warningTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-navy-700">{g.warningBody}</p>
          </div>
        </div>

        <section className="mt-12" aria-labelledby="etap">
          <h2 id="etap" className="text-2xl font-bold text-navy-900 sm:text-3xl">{g.stepsTitle}</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {g.steps.map((s, i) => (
              <li key={s.title} className="card !p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 font-serif text-lg font-bold text-white" aria-hidden>{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={GUIDE_URLS.civ} {...ext} className="btn-outline">{g.civLink} <ExternalLink className="h-4 w-4" aria-hidden /></a>
            <a href={GUIDE_URLS.guide} {...ext} className="btn-outline">{g.guideLink} <ExternalLink className="h-4 w-4" aria-hidden /></a>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="dat">
          <h2 id="dat" className="text-2xl font-bold text-navy-900 sm:text-3xl">{g.datesTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-navy-600">{g.datesIntro}</p>
          <ol className="mt-6 space-y-4 border-l-2 border-cream-300 pl-5">
            {dates.map((d) => (
              <li key={d.sortKey + d.what.slice(0, 12)} className="relative">
                <span className="absolute -left-[1.62rem] top-1.5 h-3 w-3 rounded-full border-2 border-cream-100 bg-flag-600" aria-hidden />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-lg font-bold text-navy-900">{d.when}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[d.status]}`}>{g.status[d.status]}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-navy-800">{d.what}</p>
                <p className="mt-1 text-xs text-navy-500">
                  {g.sourceWord}: <a href={d.url} {...ext} className="underline hover:text-flag-600">{d.sourceLabel}</a>
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-navy-500">{g.conditionsNote}</p>
        </section>

        <section className="mt-14 rounded-xl border border-cream-300 bg-white p-5 sm:p-6" aria-labelledby="stat">
          <h2 id="stat" className="text-xl font-bold text-navy-900">{g.statsTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-700">{g.statsBody}</p>
          <p className="mt-3 text-sm">
            <a href={GUIDE_URLS.stats} {...ext} className="font-semibold text-navy-700 underline hover:text-flag-600">{g.statsLinks}</a>
          </p>
        </section>

        <section className="mt-14" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-bold text-navy-900 sm:text-3xl">{g.faqTitle}</h2>
          <div className="mt-5 divide-y divide-cream-300 rounded-xl border border-cream-300 bg-white">
            {g.faq.map((f) => (
              <details key={f.q} className="group p-4 sm:px-6">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl leading-none text-flag-600 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 pb-1 text-sm leading-relaxed text-navy-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-xl bg-navy-800 p-6 text-cream-50 sm:p-8" aria-labelledby="fo">
          <h2 id="fo" className="text-2xl font-bold">{g.misinfoTitle}</h2>
          <p className="mt-2 text-navy-100">{g.misinfoBody}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy-100">
            {g.misinfoTips.map((tip) => (
              <li key={tip} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-flag-500" aria-hidden />{tip}</li>
            ))}
          </ul>
          <Link href="/verifye" className="btn-accent mt-6">{g.misinfoCta}</Link>
        </section>

        <section className="mt-14 grid gap-6 sm:grid-cols-2" aria-labelledby="kontak">
          <div className="card !p-5">
            <h2 id="kontak" className="flex items-center gap-2 text-lg font-bold text-navy-900"><Phone className="h-5 w-5 text-flag-600" aria-hidden /> {g.contactTitle}</h2>
            <p className="mt-2 text-sm text-navy-700">{g.contactBody}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-navy-900">
              {CEP_PHONES.map((p, i) => (
                <span key={p}>{i > 0 && ' · '}<a href={`tel:${p.replace(/\s/g, '')}`} className="underline">{p}</a></span>
              ))}
            </p>
            <p className="mt-1 text-xs text-navy-500">{CEP_ADDRESS}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={GUIDE_URLS.cep} {...ext} className="font-semibold underline hover:text-flag-600">{g.officialSite}</a>
              <a href={GUIDE_URLS.facebook} {...ext} className="underline hover:text-flag-600">Facebook</a>
            </p>
          </div>
          <div className="card !p-5">
            <h2 className="text-lg font-bold text-navy-900">{g.sourcesTitle}</h2>
            <ul className="mt-2 space-y-1.5 text-xs leading-snug text-navy-700">
              {guideSources.map((s) => (
                <li key={s.url}><a href={s.url} {...ext} className="underline hover:text-flag-600">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </section>

        <ShareButtons text={g.metaTitle} className="mt-10" />
        <p className="mt-6 text-xs text-navy-500">{g.disclaimer}</p>
      </div>
    </>
  )
}
