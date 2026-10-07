'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/i18n/client'

// Shares the CURRENT page address (read in the browser, so it is right in any environment).
export default function ShareButtons({ text, className = '' }: { text: string; className?: string }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [canNative, setCanNative] = useState(false)

  useEffect(() => setCanNative(typeof navigator !== 'undefined' && typeof navigator.share === 'function'), [])

  const url = () => window.location.href
  const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')

  async function copy() {
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(t.share.copy, url())
    }
  }

  const btn = 'rounded-full border border-navy-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-800 hover:border-navy-600 hover:bg-cream-200'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label={t.share.label}>
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">{t.share.label}</span>
      <button type="button" className={btn} onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`)}>{t.share.whatsapp}</button>
      <button type="button" className={btn} onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)}>{t.share.facebook}</button>
      <button type="button" className={btn} onClick={() => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url())}`)}>{t.share.x}</button>
      <button type="button" className={btn} onClick={copy} aria-live="polite">{copied ? t.share.copied : t.share.copy}</button>
      {canNative && (
        <button type="button" className={btn} onClick={() => navigator.share({ title: text, text, url: url() }).catch(() => undefined)}>{t.share.more}</button>
      )}
    </div>
  )
}
