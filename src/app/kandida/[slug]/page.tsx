import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { candidates, pledgeTopics } from '@/data/candidates'
import { CommentsNotice, StatusBadge } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import type { SourceLink } from '@/types'

export function generateStaticParams() {
  return candidates.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = candidates.find((x) => x.slug === params.slug)
  return { title: c ? `${c.name} — pwofil kandida` : 'Pwofil' }
}

const Src = ({ s }: { s: SourceLink }) => (
  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy-600 underline hover:text-flag-600">
    {s.label}
  </a>
)

function Block({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cream-300 py-8">
      <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{title}</h2>
      {intro && <p className="mt-2 text-sm text-navy-600">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

const pending = (t = 'Poko dokimante sou SoveAyiti.') => <span className="italic text-navy-500">{t}</span>

const th = 'pb-2 pr-4 font-semibold'
const td = 'py-2 pr-4 align-top'

export default function CandidatePage({ params }: { params: { slug: string } }) {
  const c = candidates.find((x) => x.slug === params.slug)
  if (!c) notFound()

  const index = candidates.findIndex((x) => x.slug === c.slug)
  const other = [candidates[(index + 1) % candidates.length], candidates[(index - 1 + candidates.length) % candidates.length]]
  const pledgeByTopic = (t: string) => c.pledges?.filter((p) => p.topic === t) ?? []
  const questionnaire = {
    notSent: 'Envitasyon poko voye.',
    sent: 'Envitasyon voye. N ap tann repons.',
    received: 'Repons resevwa.',
  }[c.questionnaireStatus ?? 'notSent']

  return (
    <>
      <div className="border-b border-cream-300 bg-cream-50">
        <div className="container-max grid gap-8 py-10 sm:py-14 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <p className="eyebrow">Enskripsyon kandida · {c.office}{c.affiliation ? ` · ${c.affiliation}` : ''}</p>
            <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">{c.name}</h1>
            <div className="mt-5"><StatusBadge status={c.status} /></div>
            <p className="mt-3 max-w-xl text-sm text-navy-700">
              {c.status === 'registered' && 'Apwobasyon final la ap tann verifikasyon ak validasyon CEP. '}
              Sous: <Src s={c.statusSource} /> · Dènye mizajou pwofil: {formatDate(c.lastReviewed)}
            </p>
          </div>
          <figure className="mx-auto w-full max-w-[14rem] md:mx-0 md:ml-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-cream-300 bg-navy-100">
              {c.photo ? (
                <Image src={c.photo} alt={`Foto ${c.name}`} fill sizes="224px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs text-navy-500">
                  Foto kandida — ap ajoute ak kredi
                </div>
              )}
            </div>
            {c.photoCredit && <figcaption className="mt-1 text-xs text-navy-500">{c.photoCredit}</figcaption>}
          </figure>
        </div>
      </div>

      <div className="container-max max-w-3xl pb-16">
        <p className="my-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-700">
          Pwofil sa a ap travay toujou. Yon seksyon vid pa vle di kandida a pa gen eksperyans, aktivite lejislatif oswa
          pwopozisyon: sa vle di nou poko dokimante yo.
        </p>

        <Block title="Sou kandida a">
          {c.education.length + c.career.length === 0 ? pending('Biyografi nan rechèch. N ap ajoute enfòmasyon verifye ak sous yo.') : null}
          <table className="mt-3 w-full text-left text-sm">
            <tbody>
              <tr className="border-t border-cream-300"><th className={`${td} w-48 font-semibold`}>Pwofesyon ak karyè</th><td className="py-2">{c.career.length ? c.career.join(' · ') : pending()}</td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>Fòmasyon ak kalifikasyon</th><td className="py-2">{c.education.length ? c.education.join(' · ') : pending()}</td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>Afilyasyon politik</th><td className="py-2">{c.affiliation ?? pending()} <span className="text-xs text-navy-500">(abrevyasyon jan l parèt nan done enskripsyon yo)</span></td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>Sit ofisyèl ak rezo sosyal</th><td className="py-2">{c.officialLinks?.length ? c.officialLinks.map((l) => <span key={l.url} className="mr-3"><Src s={l} /></span>) : pending('Lyen ap tann verifikasyon.')}</td></tr>
            </tbody>
          </table>
        </Block>

        <Block title="Pòs piblik anvan yo" intro="Pòs verifye, dat sèvis, ak responsablite.">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-navy-600"><tr><th className={th}>Pòs</th><th className={th}>Enstitisyon / dat</th><th className={th}>Responsablite</th></tr></thead>
              <tbody>
                {c.positions.length === 0 ? (
                  <tr className="border-t border-cream-300"><td colSpan={3} className="py-2">{pending('Pou dokimante.')}</td></tr>
                ) : c.positions.map((p) => (
                  <tr key={p.office + p.dates} className="border-t border-cream-300"><td className={td}>{p.office}</td><td className={td}>{p.dates}</td><td className="py-2">{p.role}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="Rekò lejislatif" intro="Pwojè lwa, travay nan komisyon, ak vòt endividyèl kote gen dokiman serye.">
          {c.votes === null ? (
            <p className="text-sm">{pending('Rekò vòt endividyèl pa jwenn.')} <span className="text-navy-500">Yon seksyon vid pa vle di kandida a pa t aktif.</span></p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-navy-600"><tr><th className={th}>Dat</th><th className={th}>Pwojè lwa oswa desizyon</th><th className={th}>Vòt</th><th className={th}>Sous</th></tr></thead>
                <tbody>
                  {c.votes.map((v) => (
                    <tr key={v.measure + v.date} className="border-t border-cream-300"><td className={td}>{v.date}</td><td className={td}>{v.measure}</td><td className={td}>{v.vote}</td><td className="py-2"><Src s={v.source} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        <Block title="Pwomès kanpay" intro="Chak antre make pwomès la, kilè ak ki kote li te fèt, ak sous orijinal la. Pa gen pwomès dokimante ankò sou pwofil sa a.">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-navy-600"><tr><th className={th}>Sijè</th><th className={th}>Pwomès</th><th className={th}>Delè</th><th className={th}>Sous ak dat</th></tr></thead>
              <tbody>
                {pledgeTopics.map((topic) => {
                  const rows = pledgeByTopic(topic)
                  return rows.length === 0 ? (
                    <tr key={topic} className="border-t border-cream-300"><td className={`${td} font-medium`}>{topic}</td><td colSpan={3} className="py-2">{pending('An atant dokimantasyon')}</td></tr>
                  ) : rows.map((r) => (
                    <tr key={topic + r.pledge} className="border-t border-cream-300"><td className={`${td} font-medium`}>{topic}</td><td className={td}>{r.pledge}</td><td className={td}>{r.timeline ?? '—'}</td><td className="py-2"><Src s={r.source} /> · {formatDate(r.date)}</td></tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="Pwogram kanpay">
          {c.program ? (
            <div>
              <p className="font-semibold">{c.program.title}</p>
              <p className="text-sm text-navy-600">Pibliye: {formatDate(c.program.publishedOn)}</p>
              {c.program.summary && <p className="mt-3 text-navy-800">{c.program.summary}</p>}
              <a href={c.program.url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">Dokiman orijinal la</a>
            </div>
          ) : (
            <>
              <p className="text-sm">{pending('Okenn pwogram kanpay verifye pa ajoute sou SoveAyiti.')}</p>
              <p className="mt-2 text-sm text-navy-600">
                Lè l disponib, seksyon sa a ap gen yon rezime an lang senp, mezi pwopoze yo, kijan yo ta finanse yo, ak delè
                aplikasyon si pwogram nan site yo, ansanm ak dat piblikasyon an, lyen orijinal la, ak telechajman PDF.
              </p>
            </>
          )}
        </Block>

        <Block title="Kesyonè kandida yo" intro="SoveAyiti ap ofri chak kandida menm kesyon, menm delè, menm kondisyon piblikasyon.">
          <p className="text-sm"><strong>Estati:</strong> {questionnaire}</p>
          {c.questionnaire?.map((q) => (
            <div key={q.question} className="mt-4">
              <p className="font-semibold">{q.question}</p>
              <p className="text-navy-700">{q.answer}</p>
            </div>
          ))}
          <p className="mt-3 text-xs text-navy-500">Repons yo make klèman kòm sa kandida a di. Piblikasyon yo pa vle di nou verifye yo ni nou apiye kandida a.</p>
        </Block>

        <Block title="Entèvyou ak deklarasyon piblik">
          {c.interviews?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {c.interviews.map((i) => <li key={i.url}><Src s={{ label: i.title, url: i.url }} /> · {formatDate(i.date)}</li>)}
            </ul>
          ) : pending('Entèvyou, diskou, transkripsyon ak videyo orijinal ak dat ap parèt isit la.')}
        </Block>

        <Block title="Sous ak koreksyon" intro="Sous yo parèt toupre enfòmasyon yo sipòte.">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {c.sources.map((s) => <li key={s.url}><Src s={s} /></li>)}
          </ul>
          {c.corrections.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {c.corrections.map((x) => <li key={x.date}><strong>{formatDate(x.date)}:</strong> {x.note}</li>)}
            </ul>
          )}
          <p className="mt-4 text-sm font-semibold">Ou gen yon dokiman oswa yon koreksyon?</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/kontak" className="btn-outline">Voye yon sous</Link>
            <Link href="/kontak" className="btn-outline">Mande yon koreksyon</Link>
          </div>
        </Block>

        <CommentsNotice />

        <nav className="mt-10 flex justify-between gap-4 text-sm font-semibold" aria-label="Lòt kandida">
          <Link href={`/kandida/${other[1].slug}`} className="text-navy-700 hover:text-flag-600">← {other[1].name}</Link>
          <Link href={`/kandida/${other[0].slug}`} className="text-navy-700 hover:text-flag-600">{other[0].name} →</Link>
        </nav>

        <p className="mt-10 text-xs text-navy-500">
          SoveAyiti se yon platfòm enfòmasyon endepandan. Pwofil sa a ap travay toujou e li pa reprezante yon sipò pou kandida a.
        </p>
      </div>
    </>
  )
}
