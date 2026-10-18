import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/Shared'
import { VerdictBadge } from '@/components/VerdictBadge'
import { claims } from '@/data/claims'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { getTools } from '@/i18n/tools'

export function generateMetadata(): Metadata {
  return { title: getTools().verify.metaTitle, description: getTools().verify.subtitle }
}

export default function VerifyPage() {
  const { lang } = getT()
  const v = getTools().verify
  return (
    <>
      <PageHeader eyebrow={v.eyebrow} title={v.title} subtitle={v.subtitle} />
      <div className="container-max py-8 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {claims.length === 0 ? (
              <p className="rounded-lg border border-dashed border-navy-300 bg-cream-50 p-6 text-navy-700">{v.empty}</p>
            ) : (
              <ul className="space-y-5">
                {claims.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/verifye/${c.slug}`} className="card group block">
                      <div className="flex flex-wrap items-center gap-3">
                        <VerdictBadge verdict={c.verdict} />
                        <span className="text-xs text-navy-500">{v.checked} {formatDate(c.date, lang)}</span>
                      </div>
                      <p className="mt-3 font-serif text-xl font-bold leading-snug text-navy-900 group-hover:text-flag-600">{c.claim[lang]}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-700">{c.finding[lang]}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 rounded-xl border border-flag-500/40 bg-white p-5">
              <h2 className="font-sans text-base font-bold text-navy-900">{v.send}</h2>
              <p className="mt-2 text-sm text-navy-700">{v.sendText}</p>
              <Link href="/kontak" className="btn-accent mt-4">{v.sendCta}</Link>
            </div>
          </div>

          <aside className="space-y-8">
            <div>
              <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{v.tipsTitle}</h2>
              <ol className="mt-4 space-y-4">
                {v.tips.map(([q, a], i) => (
                  <li key={q} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-navy-900">{q}</p>
                      <p className="mt-0.5 text-sm text-navy-700">{a}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{v.method}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {v.methods.map(([k, d]) => (
                  <div key={k}>
                    <dt className="font-semibold text-navy-900">{k}</dt>
                    <dd className="text-navy-700">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
