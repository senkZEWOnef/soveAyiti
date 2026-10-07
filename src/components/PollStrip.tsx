import Link from 'next/link'
import Image from 'next/image'
import { presidentialCandidates } from '@/data/candidates'
import { getCounts } from '@/lib/votes'
import { getT } from '@/i18n/server'

// Homepage teaser of the informal poll: the current top 3 plus the total. Counts only, same as /vote.
export default async function PollStrip() {
  const { lang, t } = getT()
  const counts = await getCounts()
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const top = [...presidentialCandidates]
    .sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0) || a.name.localeCompare(b.name))
    .slice(0, 3)
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const p = t.pollStrip

  return (
    <section className="border-b border-cream-300 bg-white" aria-labelledby="poll-strip">
      <div className="container-max grid gap-6 py-8 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-2">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 id="poll-strip" className="mt-1 text-2xl font-bold text-navy-900">{p.title}</h2>
          <p className="mt-1 text-sm text-navy-600">{total > 0 ? p.votes(nf(total)) : p.none}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/vote" className="btn-accent">{p.cta}</Link>
            {total > 0 && <Link href="/vote" className="btn-outline">{p.fullResults}</Link>}
          </div>
          <p className="mt-3 text-xs text-navy-500">{p.disclaimer}</p>
        </div>
        {total > 0 && (
          <ol className="grid gap-3 sm:grid-cols-3 lg:col-span-3">
            {top.map((c, i) => {
              const n = counts[c.slug] ?? 0
              const pct = (n / total) * 100
              return (
                <li key={c.slug} className="rounded-xl border border-cream-300 bg-cream-50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-navy-100">
                      {c.photo ? (
                        <Image src={c.photo} alt="" fill sizes="48px" className="object-cover object-top" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-sm font-bold text-navy-500" aria-hidden>
                          {c.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('')}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-navy-900"><span className="mr-1 text-flag-600">#{i + 1}</span>{c.name}</p>
                      <p className="text-xs tabular-nums text-navy-600">{nf(n)} · {pct.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-cream-200" role="presentation">
                    <div className="h-1.5 rounded-full bg-navy-700" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
