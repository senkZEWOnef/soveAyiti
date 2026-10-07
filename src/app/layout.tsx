import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site } from '@/data/site'
import { getT } from '@/i18n/server'
import { I18nProvider } from '@/i18n/client'
import { htmlLang, ogLocale } from '@/i18n/config'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap', weight: ['500', '600', '700'] })

export function generateMetadata(): Metadata {
  const { lang, t } = getT()
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.siteTitle, template: `%s · ${site.name}` },
    description: t.meta.description,
    openGraph: {
      title: `${site.name} (${site.frName})`,
      description: t.meta.tagline,
      type: 'website',
      locale: ogLocale[lang],
    },
    twitter: { card: 'summary_large_image' },
    // No author/creator metadata on purpose: the project is published anonymously.
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = getT()
  return (
    <html lang={htmlLang[lang]} className={`${sans.variable} ${serif.variable}`}>
      <body>
        <I18nProvider lang={lang}>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-3">
            {t.skip}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
