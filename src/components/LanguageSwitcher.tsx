'use client'

import { useRouter } from 'next/navigation'
import { LANGS, LANG_COOKIE, LANG_COOKIE_MAX_AGE, langNames, type Lang } from '@/i18n/config'
import { useLang, useT } from '@/i18n/client'

// Stores the choice in a cookie (kept for a year) so the server renders every page in that language
// on the next visit, then refreshes the current page in place.
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter()
  const lang = useLang()
  const t = useT()

  function choose(next: Lang) {
    if (next === lang) return
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`
    router.refresh()
  }

  return (
    <div role="group" aria-label={t.nav.language} className={`inline-flex overflow-hidden rounded-md border border-navy-300 text-xs font-bold ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => choose(l)}
          aria-pressed={l === lang}
          title={langNames[l].full}
          className={`px-2.5 py-1.5 ${l === lang ? 'bg-navy-800 text-white' : 'bg-white text-navy-700 hover:bg-cream-200'}`}
        >
          {langNames[l].short}
        </button>
      ))}
    </div>
  )
}
