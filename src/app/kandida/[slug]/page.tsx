import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { candidates } from '@/data/candidates'
import { CommentsNotice, PageHeader, StatusBadge } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import type { SourceLink } from '@/types'

export function generateStaticParams() {
  return candidates.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = candidates.find((x) => x.slug === params.slug)
  return { title: c ? `${c.name} — pwofil` : 'Pwofil' }
}

const Src = ({ s }: { s: SourceLink }) => (
  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy-600 underline hover:text-flag-600">
    {s.label}
  </a>
)

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cream-300 py-7">
      <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{title}</h2>
      {children}
    </section>
  )
}

const empty = (t: string) => <p className="text-sm italic text-navy-500">{t}</p>

export default function CandidatePage({ params }: { params: { slug: string } }) {
  const c = candidates.find((x) => x.slug === params.slug)
  if (!c) notFound()

  return (
    <>
      <PageHeader eyebrow={`Kandida · ${c.office}`} title={c.name} />
      <div className="container-max section max-w-3xl">
        {c.isSample && (
          <p className="mb-6 rounded-lg border border-flag-500 bg-white p-4 text-sm text-flag-700">
            Sa a se yon pwofil modèl ak non fiktif, pou montre fòma a. Pa gen okenn enfòmasyon reyèl ladan l.
          </p>
        )}

        <Block title="Estati kandidati">
          <StatusBadge status={c.status} />
          <p className="mt-3 text-sm text-navy-700">
            Dat: {formatDate(c.statusDate)} · Sous: <Src s={c.statusSource} />
          </p>
        </Block>

        <Block title="Fòmasyon ak karyè">
          {c.education.length + c.career.length === 0 ? empty('Enfòmasyon verifye poko disponib.') : (
            <ul className="list-disc space-y-1.5 pl-5 text-navy-800">
              {[...c.education, ...c.career].map((t) => <li key={t}>{t}</li>)}
            </ul>
          )}
        </Block>

        <Block title="Pòs anvan yo">
          {c.positions.length === 0 ? empty('Okenn pòs dokimante.') : (
            <ul className="space-y-3">
              {c.positions.map((p) => (
                <li key={p.office + p.dates} className="text-navy-800">
                  <strong>{p.office}</strong> · {p.dates}
                  <p className="text-sm text-navy-600">{p.role}</p>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Rekò lejislatif">
          {c.votes === null ? (
            empty('Rekò vòt endividyèl pa jwenn.')
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-navy-600">
                  <tr><th className="pb-2 pr-4">Dat</th><th className="pb-2 pr-4">Mezi</th><th className="pb-2 pr-4">Vòt</th><th className="pb-2">Sous</th></tr>
                </thead>
                <tbody>
                  {c.votes.map((v) => (
                    <tr key={v.measure + v.date} className="border-t border-cream-300">
                      <td className="py-2 pr-4">{v.date}</td>
                      <td className="py-2 pr-4">{v.measure}</td>
                      <td className="py-2 pr-4">{v.vote}</td>
                      <td className="py-2"><Src s={v.source} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        <Block title="Pwopozisyon (deklarasyon atribiye)">
          {c.proposals.length === 0 ? empty('Pa gen pwopozisyon dokimante.') : (
            <ul className="space-y-3">
              {c.proposals.map((p) => (
                <li key={p.statement} className="border-l-4 border-navy-200 pl-4 text-navy-800">
                  {p.statement} <span className="text-sm">(<Src s={p.source} />)</span>
                </li>
              ))}
            </ul>
          )}
          {c.questionnaire?.map((q) => (
            <div key={q.question} className="mt-4">
              <p className="font-semibold">{q.question}</p>
              <p className="text-navy-700">{q.answer}</p>
              <p className="text-xs text-navy-500">Repons kandida a — pa verifye pa SoveAyiti.</p>
            </div>
          ))}
        </Block>

        <Block title="Sous">
          {c.sources.length === 0 ? empty('Poko gen sous.') : (
            <ul className="list-disc space-y-1 pl-5">{c.sources.map((s) => <li key={s.label}><Src s={s} /></li>)}</ul>
          )}
        </Block>

        <Block title="Mizajou ak koreksyon">
          <p className="text-sm text-navy-700">Dènye revizyon: {formatDate(c.lastReviewed)}</p>
          {c.corrections.length === 0 ? (
            <p className="mt-1 text-sm text-navy-500">Pa gen koreksyon pou kounye a.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {c.corrections.map((x) => <li key={x.date}><strong>{formatDate(x.date)}:</strong> {x.note}</li>)}
            </ul>
          )}
          <Link href="/kontak" className="mt-3 inline-block text-sm font-semibold text-flag-600 underline">
            Siyale yon erè
          </Link>
        </Block>

        <CommentsNotice />
      </div>
    </>
  )
}
