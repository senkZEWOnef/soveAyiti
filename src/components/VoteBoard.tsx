'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useLang, useT } from '@/i18n/client'
import ShareButtons from './ShareButtons'

export interface PollCandidate {
  slug: string
  name: string
  affiliation?: string
  photo?: string
}

const REFRESH_MS = 20000
const LS_KEY = 'sa_voted'

// Haiti's calendar day, same rule as the server (src/lib/voteGuard.ts).
const haitiDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Port-au-Prince' }).format(new Date())

function rememberVote(slug: string) {
  try { localStorage.setItem(LS_KEY, `${haitiDay()}:${slug}`) } catch { /* private mode: the cookie still works */ }
}
function recallVote(valid: string[]): string | null {
  try {
    const [day, slug] = (localStorage.getItem(LS_KEY) ?? '').split(':')
    return day === haitiDay() && valid.includes(slug) ? slug : null
  } catch {
    return null
  }
}

type Problem = 'failed' | 'already' | 'ip' | null

export default function VoteBoard({
  candidates,
  initialCounts,
  initialVoted,
}: {
  candidates: PollCandidate[]
  initialCounts: Record<string, number>
  initialVoted: string | null
}) {
  const t = useT()
  const lang = useLang()
  const nf = (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')
  const [counts, setCounts] = useState(initialCounts)
  const [voted, setVoted] = useState<string | null>(initialVoted)
  const [resetIn, setResetIn] = useState<number | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [problem, setProblem] = useState<Problem>(null)
  const results = useRef<HTMLElement>(null)

  const slugs = candidates.map((c) => c.slug)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const ranked = [...candidates].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0) || a.name.localeCompare(b.name))
  const nameOf = (slug: string | null) => candidates.find((c) => c.slug === slug)?.name ?? ''
  const hours = resetIn ? Math.max(1, Math.ceil(resetIn / 3600)) : null

  function apply(data: { counts?: Record<string, number>; voted?: string | null; resetIn?: number }) {
    if (data.counts) setCounts(data.counts)
    if (data.voted) {
      setVoted(data.voted)
      rememberVote(data.voted)
    }
    if (typeof data.resetIn === 'number') setResetIn(data.resetIn)
  }

  // On load: ask the server (the page may be cached) and fall back to this browser's memory of today's vote.
  // Then keep the results fresh while the tab is visible.
  useEffect(() => {
    if (!initialVoted) {
      const mine = recallVote(slugs)
      if (mine) setVoted(mine)
    }
    let alive = true
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch('/api/vote', { cache: 'no-store' })
        if (alive && res.ok) apply(await res.json())
      } catch { /* offline: keep what we have */ }
    }
    refresh()
    const id = setInterval(refresh, REFRESH_MS)
    return () => { alive = false; clearInterval(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function showResults() {
    results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function vote(c: PollCandidate) {
    if (voted || pending) return
    setPending(c.slug)
    setProblem(null)
    try {
      const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: c.slug }) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        apply(data)
        setTimeout(showResults, 150)
      } else if (res.status === 429) {
        apply({ counts: data.counts, resetIn: data.resetIn, voted: data.error === 'ip' ? undefined : data.voted ?? c.slug })
        if (data.error === 'ip') setProblem('ip')
        else {
          setProblem('already')
          if (!data.voted) setVoted(recallVote(slugs) ?? c.slug) // device already used today: lock the buttons
        }
      } else {
        setProblem('failed')
      }
    } catch {
      setProblem('failed')
    } finally {
      setPending(null)
    }
  }

  const locked = voted !== null || problem === 'ip'

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-10">
      <div className="lg:col-span-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold">{t.vote.choose}</h2>
          {!locked && (
            <button type="button" onClick={showResults} className="shrink-0 text-sm font-semibold text-navy-700 underline lg:hidden">
              {t.vote.seeResults}
            </button>
          )}
        </div>

        {voted && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-navy-800 p-3 text-sm font-semibold text-cream-50" role="status">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-flag-500" aria-hidden />
            <span>
              {t.vote.youVoted(nameOf(voted))}
              {hours && <span className="block font-normal text-navy-200">{t.vote.comeBack(hours)}</span>}
            </span>
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {candidates.map((c) => {
            const mine = voted === c.slug
            return (
              <div key={c.slug} className={`card flex flex-col overflow-hidden !p-0 ${mine ? 'ring-2 ring-flag-500' : ''}`}>
                <div className="relative aspect-[4/5] bg-navy-100">
                  {c.photo ? (
                    <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="(min-width:1024px) 12rem, 45vw" className="object-cover object-top" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-bold text-navy-400 sm:text-5xl" aria-hidden>
                      {c.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('')}
                    </div>
                  )}
                  {mine && (
                    <span className="absolute left-2 top-2 rounded bg-flag-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">{t.vote.votedBadge}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                  <p className="text-sm font-bold leading-snug text-navy-900 sm:text-base">{c.name}</p>
                  {c.affiliation && <p className="truncate text-xs text-navy-500">{c.affiliation}</p>}
                  <button
                    onClick={() => vote(c)}
                    disabled={locked || pending !== null}
                    className="btn-primary mt-3 min-h-11 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={t.vote.voteFor(c.name)}
                  >
                    {pending === c.slug ? '…' : mine ? t.vote.votedBadge : locked ? t.vote.votedLabel : t.vote.vote}
                  </button>
                  <Link href={`/kandida/${c.slug}`} className="mt-1 py-2 text-center text-xs text-navy-600 underline hover:text-flag-600">
                    {t.vote.seeProfile}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside ref={results} className={`scroll-mt-20 lg:order-none lg:col-span-2 ${voted ? 'order-first' : ''}`} aria-live="polite">
        <div className="card lg:sticky lg:top-24">
          <h2 className="font-sans text-base font-bold">{t.vote.results}</h2>
          <p className="mt-1 text-xs text-navy-500">{t.vote.live}</p>
          {voted && !problem && (
            <>
              <p className="mt-3 rounded-md bg-cream-200 p-2 text-sm text-navy-800">{t.vote.thanks(nameOf(voted))}</p>
              <ShareButtons text={t.share.iVoted(nameOf(voted))} className="mt-3" />
            </>
          )}
          {problem === 'already' && <p className="mt-3 rounded-md bg-cream-200 p-2 text-sm text-navy-800">{t.vote.already}</p>}
          {problem === 'ip' && <p className="mt-3 rounded-md bg-flag-500/10 p-2 text-sm text-flag-700">{t.vote.limitedIp}</p>}
          {problem === 'failed' && <p className="mt-3 rounded-md bg-flag-500/10 p-2 text-sm text-flag-700">{t.vote.failed}</p>}
          <ol className="mt-4 space-y-3">
            {ranked.map((c) => {
              const n = counts[c.slug] ?? 0
              const pct = total ? (n / total) * 100 : 0
              return (
                <li key={c.slug}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className={`font-semibold ${voted === c.slug ? 'text-flag-700' : 'text-navy-900'}`}>{c.name}</span>
                    <span className="shrink-0 tabular-nums text-navy-600">{nf(n)} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-cream-200" role="presentation">
                    <div className={`h-2 rounded-full transition-[width] duration-500 ${voted === c.slug ? 'bg-flag-600' : 'bg-navy-700'}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-4 text-sm font-semibold text-navy-800">{t.vote.total} {nf(total)}</p>
          <p className="mt-3 text-xs text-navy-500">{t.vote.privacy}</p>
        </div>
      </aside>
    </div>
  )
}
