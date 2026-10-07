import 'server-only'
import { cookies } from 'next/headers'
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from './config'
import { dict } from './dictionary'

// Creole is the default. A visitor's choice is stored in a cookie (see LanguageSwitcher) and read here.
export function getLang(): Lang {
  const v = cookies().get(LANG_COOKIE)?.value
  return isLang(v) ? v : DEFAULT_LANG
}

export function getT() {
  const lang = getLang()
  return { lang, t: dict[lang] }
}
