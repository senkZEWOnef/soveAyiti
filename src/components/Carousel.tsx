'use client'

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '@/i18n/client'

// One card per swipe with the next card peeking in, so people see there is more. Native scroll-snap: touch swipe,
// trackpad, arrow buttons and the keyboard (left/right arrows when the strip is focused) all work.
export default function Carousel({ children, label, itemClass = 'w-[78%] sm:w-[46%] lg:w-[31%]' }: { children: ReactNode; label: string; itemClass?: string }) {
  const t = useT()
  const list = useRef<HTMLUListElement>(null)
  const items = Children.toArray(children)
  const [state, setState] = useState({ index: 0, atStart: true, atEnd: items.length < 2 })

  const stride = () => {
    const el = list.current
    const first = el?.children[0] as HTMLElement | undefined
    const second = el?.children[1] as HTMLElement | undefined
    return first && second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? 1)
  }

  const update = useCallback(() => {
    const el = list.current
    if (!el) return
    const s = stride()
    setState({
      index: Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / s))),
      atStart: el.scrollLeft < 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [items.length])

  useEffect(() => {
    update()
    const el = list.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const go = (dir: 1 | -1) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.current?.scrollBy({ left: dir * stride(), behavior: reduce ? 'auto' : 'smooth' })
  }

  const btn = 'rounded-full border border-navy-300 bg-white p-2.5 text-navy-800 hover:border-navy-600 hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={list}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
        }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:scroll-pl-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${items.length}`}
            className={`shrink-0 snap-start ${itemClass}`}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={state.atStart} aria-label={t.hero.prev} className={btn}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => go(1)} disabled={state.atEnd} aria-label={t.hero.next} className={btn}>
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300" aria-hidden>
          <div className="h-full rounded-full bg-flag-600 transition-[width] duration-300" style={{ width: `${((state.index + 1) / items.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold tabular-nums text-navy-600" aria-live="polite">{state.index + 1} / {items.length}</span>
      </div>
    </div>
  )
}
