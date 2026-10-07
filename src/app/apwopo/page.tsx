import type { Metadata } from 'next'
import { PageHeader, IndependenceBar } from '@/components/Shared'
import { getT } from '@/i18n/server'

export function generateMetadata(): Metadata {
  return { title: getT().t.about.metaTitle }
}

export default function AboutPage() {
  const { t } = getT()
  const a = t.about
  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle} />
      <div className="container-max section max-w-3xl">
        <div className="rounded-xl bg-navy-800 p-6 text-cream-50"><IndependenceBar /></div>

        <p className="mt-8 text-lg leading-relaxed text-navy-800">{a.founder}</p>
        <p className="mt-6 leading-relaxed text-navy-700">{a.notMovement}</p>

        <h2 className="mt-12 text-2xl font-bold">{a.rules}</h2>
        <ul className="mt-5 space-y-5">
          {a.practices.map(([title, desc]) => (
            <li key={title} className="border-l-4 border-flag-500 pl-4">
              <h3 className="font-sans font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy-700">{desc}</p>
            </li>
          ))}
        </ul>

        <h2 id="koreksyon" className="mt-12 scroll-mt-24 text-2xl font-bold">{a.reportTitle}</h2>
        <p className="mt-3 leading-relaxed text-navy-700">{a.reportBody}</p>
        <a href="/kontak" className="btn-outline mt-4">{a.sendCorrection}</a>

        <h2 id="kòmantè" className="mt-12 scroll-mt-24 text-2xl font-bold">{a.commentsTitle}</h2>
        <p className="mt-3 leading-relaxed text-navy-700">{a.commentsBody}</p>

        <p className="mt-12 text-xs text-navy-500">{a.legal}</p>
      </div>
    </>
  )
}
