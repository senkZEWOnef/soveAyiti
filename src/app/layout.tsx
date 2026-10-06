import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site } from '@/data/site'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap', weight: ['500', '600', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Medya endepandan ayisyen`, template: `%s · ${site.name}` },
  description:
    'Enfòmasyon verifye sou eleksyon ayisyen yo, eksplikasyon senp sou gouvènman an, epi kilti ak espò pa jèn ayisyen. Medya endepandan, okenn sipò pou kandida.',
  openGraph: {
    title: `${site.name} (${site.frName})`,
    description: site.tagline,
    type: 'website',
    locale: 'ht_HT',
  },
  // No author/creator metadata on purpose: the project is published anonymously.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ht" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-3">
          Ale nan kontni an
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
