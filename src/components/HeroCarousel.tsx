'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useT } from '@/i18n/client'

export interface CandidateSlide {
  slug: string
  name: string
  office: string
  statusLabel: string
  statusDate: string
  blurb?: string
  photo?: string
}

const INTERVAL_MS = 7000

export default function HeroCarousel({
  brand,
  aside,
  candidates,
}: {
  brand: ReactNode
  aside: ReactNode
  candidates: CandidateSlide[]
}) {
  const t = useT()
  const total = candidates.length + 1
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const running = !paused && !hovered && !reduced && total > 1
  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL_MS)
    return () => clearTimeout(id)
  }, [running, index, total])

  const go = (i: number) => setIndex((i + total) % total)

  return (
    <section
      className="bg-navy-800 text-cream-50"
      aria-roledescription="carousel"
      aria-label={t.hero.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="container-max py-14 sm:py-20">
        <div className="grid" aria-live={running ? 'off' : 'polite'}>
          {/* Slide 0: brand */}
          <div
            className={`col-start-1 row-start-1 grid gap-10 transition-opacity duration-500 lg:grid-cols-5 lg:items-center ${
              index === 0 ? 'opacity-100' : 'invisible opacity-0'
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={t.hero.slide(1, total)}
            aria-hidden={index !== 0}
          >
            <div className="lg:col-span-3">{brand}</div>
            <div className="lg:col-span-2">{aside}</div>
          </div>

          {/* Candidate slides */}
          {candidates.map((c, n) => {
            const active = index === n + 1
            return (
              <div
                key={c.slug}
                aria-hidden={!active}
                aria-label={t.hero.slide(n + 2, total)}
                role="group"
                aria-roledescription="slide"
                className={`group col-start-1 row-start-1 grid gap-10 transition-opacity duration-500 lg:grid-cols-5 lg:items-center ${
                  active ? 'opacity-100' : 'invisible opacity-0'
                }`}
              >
                <div className="lg:col-span-3">
                  <p className="eyebrow !text-flag-500">{t.hero.eyebrow(c.office)}</p>
                  <h2 className="mt-4 text-4xl font-bold leading-[1.1] sm:text-6xl">{c.name}</h2>
                  <p className="mt-5 inline-block rounded-full bg-navy-700 px-4 py-1.5 text-sm font-semibold">
                    {c.statusLabel}
                  </p>
                  {c.blurb && <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">{c.blurb}</p>}
                  <p className="mt-3 text-sm text-navy-300">
                    {t.hero.statusAsOf(c.statusDate)}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/kandida/${c.slug}`} tabIndex={active ? 0 : -1} className="btn-accent" aria-label={t.hero.seeProfileOf(c.name)}>
                      {t.hero.seeProfile} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/vote"
                      tabIndex={active ? 0 : -1}
                      className="btn border border-cream-50/70 text-cream-50 hover:bg-cream-50 hover:text-navy-900"
                      aria-label={t.hero.voteAria(c.name)}
                    >
                      {t.hero.voteFor(c.name)}
                    </Link>
                  </div>
                </div>
                <Link href={`/kandida/${c.slug}`} tabIndex={-1} aria-hidden className="lg:col-span-2">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-navy-600 bg-navy-700">
                    {c.photo ? (
                      <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="(min-width:1024px) 24rem, 90vw" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-7xl font-bold text-navy-300" aria-hidden>
                        {c.name
                          .split(' ')
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-3">
          <button onClick={() => go(index - 1)} aria-label={t.hero.prev} className="rounded-full border border-navy-500 p-2 hover:bg-navy-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(index + 1)} aria-label={t.hero.next} className="rounded-full border border-navy-500 p-2 hover:bg-navy-700">
            <ChevronRight className="h-5 w-5" />
          </button>
          {!reduced && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t.hero.play : t.hero.pause}
              className="rounded-full border border-navy-500 p-2 hover:bg-navy-700"
            >
              {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
          )}
          <div className="ml-2 flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={t.hero.goTo(i + 1)}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-flag-500' : 'w-2.5 bg-navy-400 hover:bg-navy-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
