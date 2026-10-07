export const LANGS = ['ht', 'fr', 'en'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'ht'
export const LANG_COOKIE = 'soveayiti-lang'
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // one year

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as readonly string[]).includes(v)

export const langNames: Record<Lang, { short: string; full: string }> = {
  ht: { short: 'HT', full: 'Kreyòl ayisyen' },
  fr: { short: 'FR', full: 'Français' },
  en: { short: 'EN', full: 'English' },
}

export const htmlLang: Record<Lang, string> = { ht: 'ht', fr: 'fr', en: 'en' }
export const ogLocale: Record<Lang, string> = { ht: 'ht_HT', fr: 'fr_FR', en: 'en_US' }
