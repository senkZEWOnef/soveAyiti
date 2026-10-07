'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang, useT } from '@/i18n/client'
import ShareButtons from './ShareButtons'

export interface PollCandidate {
  slug: string
  name: string
  affiliation?: string
  photo?: string
}

export default function VoteBoard({ candidates, initialCounts }: { candidates: PollCandidate[]; initialCounts: Record<string, number> }) {
  const t = useT()
  const lang = useLang()
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const [counts, setCounts] = useState(initialCounts)
  const [pending, setPending] = useState<string | null>(null)
  const [thanks, setThanks] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const ranked = [...candidates].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0) || a.name.localeCompare(b.name))

  async function vote(c: PollCandidate) {
    setPending(c.slug)
    setError(false)
    try {
      const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: c.slug }) })
      if (!res.ok) throw new Error()
      setCounts((await res.json()).counts)
      setThanks(c.name)
    } catch {
      setError(true)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="text-2xl font-bold">{t.vote.choose}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {candidates.map((c) => (
            <div key={c.slug} className="card flex flex-col overflow-hidden !p-0">
              <div className="relative aspect-[4/5] bg-navy-100">
                {c.photo ? (
                  <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="(min-width:1024px) 12rem, 45vw" className="object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl font-bold text-navy-400" aria-hidden>
                    {c.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="font-bold leading-snug text-navy-900">{c.name}</p>
                {c.affiliation && <p className="text-xs text-navy-500">{c.affiliation}</p>}
                <button onClick={() => vote(c)} disabled={pending !== null} className="btn-primary mt-3 !py-2 text-sm disabled:opacity-60" aria-label={t.vote.voteFor(c.name)}>
                  {pending === c.slug ? '…' : t.vote.vote}
                </button>
                <Link href={`/kandida/${c.slug}`} className="mt-2 text-center text-xs text-navy-600 underline hover:text-flag-600">{t.vote.seeProfile}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:col-span-2" aria-live="polite">
        <div className="card sticky top-24">
          <h2 className="font-sans text-base font-bold">{t.vote.results}</h2>
          {thanks && <p className="mt-2 rounded-md bg-cream-200 p-2 text-sm text-navy-800">{t.vote.thanks(thanks)}</p>}
          {thanks && <ShareButtons text={t.share.iVoted(thanks)} className="mt-2" />}
          {error && <p className="mt-2 rounded-md bg-flag-500/10 p-2 text-sm text-flag-700">{t.vote.failed}</p>}
          <ol className="mt-4 space-y-3">
            {ranked.map((c) => {
              const n = counts[c.slug] ?? 0
              const pct = total ? (n / total) * 100 : 0
              return (
                <li key={c.slug}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-navy-900">{c.name}</span>
                    <span className="tabular-nums text-navy-600">{nf(n)} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-cream-200" role="presentation">
                    <div className="h-2 rounded-full bg-navy-700" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-4 text-sm font-semibold text-navy-800">{t.vote.total} {nf(total)}</p>
        </div>
      </aside>
    </div>
  )
}
