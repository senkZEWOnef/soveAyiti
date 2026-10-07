'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_LANG, type Lang } from './config'
import { dict } from './dictionary'

const LangContext = createContext<Lang>(DEFAULT_LANG)

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
export const useT = () => dict[useContext(LangContext)]
