import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { candidates, pledgeTopics } from '@/data/candidates'
import { CommentsNotice, StatusBadge } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import { showPublicRecord } from '@/data/site'
import { getT } from '@/i18n/server'
import { localizeCandidate } from '@/i18n/content'
import ShareButtons from '@/components/ShareButtons'
import type { SourceLink } from '@/types'

export function generateStaticParams() {
  return candidates.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { t } = getT()
  const { lang } = getT()
  const c = candidates.find((x) => x.slug === params.slug)
  if (!c) return { title: t.nav.candidates }
  const description = localizeCandidate(c, lang).blurb
  return { title: t.profile.metaTitle(c.name), description, openGraph: { title: t.profile.metaTitle(c.name), description } }
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

const pending = (text: string) => <span className="italic text-navy-500">{text}</span>

const th = 'pb-2 pr-4 font-semibold'
const td = 'py-2 pr-4 align-top'

export default function CandidatePage({ params }: { params: { slug: string } }) {
  const { lang, t } = getT()
  const p = t.profile
  const raw = candidates.find((x) => x.slug === params.slug)
  if (!raw) notFound()
  const c = localizeCandidate(raw, lang)
  const nd = () => pending(p.notDocumented)

  const index = candidates.findIndex((x) => x.slug === c.slug)
  const other = [candidates[(index + 1) % candidates.length], candidates[(index - 1 + candidates.length) % candidates.length]]
  const publicRecord = showPublicRecord ? (c.publicRecord ?? []).filter((e) => e.reviewStatus === 'published') : []
  const pledgeByTopic = (t: string) => c.pledges?.filter((p) => p.topic === t) ?? []
  const questionnaire = p.questionnaireStates[c.questionnaireStatus ?? 'notSent']

  return (
    <>
      <div className="border-b border-cream-300 bg-cream-50">
        <div className="container-max grid gap-8 py-10 sm:py-14 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <p className="eyebrow">{p.eyebrow} · {c.office}{c.position ? ` (${c.position})` : ''}{c.locality ? ` · ${c.locality}` : ''}{c.department ? ` · ${c.department}` : ''}{c.affiliation ? ` · ${c.affiliation}` : ''}</p>
            <h1 className="mt-2 text-4xl font-bold text-navy-900 sm:text-5xl">{c.name}</h1>
            <div className="mt-5"><StatusBadge status={c.status} /></div>
            <p className="mt-3 max-w-xl text-sm text-navy-700">
              {c.status === 'registered' && p.pendingApproval}
              {p.source} <Src s={c.statusSource} /> · {p.lastUpdated} {formatDate(c.lastReviewed, lang)}
            </p>
            <ShareButtons text={t.share.profile(c.name)} className="mt-5" />
          </div>
          <figure className="mx-auto w-full max-w-[14rem] md:mx-0 md:ml-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-cream-300 bg-navy-100">
              {c.photo ? (
                <Image src={c.photo} alt={t.hero.photoAlt(c.name)} fill sizes="224px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs text-navy-500">
                  {p.photoPlaceholder}
                </div>
              )}
            </div>
            {c.photoCredit && <figcaption className="mt-1 text-xs text-navy-500">{c.photoCredit}</figcaption>}
          </figure>
        </div>
      </div>

      <div className="container-max max-w-3xl pb-16">
        <p className="my-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-700">
          {p.workInProgress}
        </p>

        <Block title={p.about}>
          {c.education.length + c.career.length === 0 ? pending(p.bioPending) : null}
          <table className="mt-3 w-full text-left text-sm">
            <tbody>
              <tr className="border-t border-cream-300"><th className={`${td} w-48 font-semibold`}>{p.career}</th><td className="py-2">{c.career.length ? c.career.join(' · ') : nd()}</td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>{p.education}</th><td className="py-2">{c.education.length ? c.education.join(' · ') : nd()}</td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>{p.party}</th><td className="py-2">{c.affiliation ?? nd()} <span className="text-xs text-navy-500">{p.abbrevNote}</span></td></tr>
              <tr className="border-t border-cream-300"><th className={`${td} font-semibold`}>{p.links}</th><td className="py-2">{c.officialLinks?.length ? c.officialLinks.map((l) => <span key={l.url} className="mr-3"><Src s={l} /></span>) : pending(p.linksPending)}</td></tr>
            </tbody>
          </table>
        </Block>

        <Block title={p.positionsTitle} intro={p.positionsIntro}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-navy-600"><tr><th className={th}>{p.colOffice}</th><th className={th}>{p.colInstDate}</th><th className={th}>{p.colRole}</th></tr></thead>
              <tbody>
                {c.positions.length === 0 ? (
                  <tr className="border-t border-cream-300"><td colSpan={3} className="py-2">{pending(p.toDocument)}</td></tr>
                ) : c.positions.map((p) => (
                  <tr key={p.office + p.dates} className="border-t border-cream-300"><td className={td}>{p.office}</td><td className={td}>{p.dates}</td><td className="py-2">{p.role}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title={p.legislativeTitle} intro={p.legislativeIntro}>
          {c.votes === null ? (
            <p className="text-sm">{pending(p.votesNotFound)} <span className="text-navy-500">{p.votesEmptyNote}</span></p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-navy-600"><tr><th className={th}>{p.colDate}</th><th className={th}>{p.colMeasure}</th><th className={th}>{p.colVote}</th><th className={th}>{p.colSource}</th></tr></thead>
                <tbody>
                  {c.votes.map((v) => (
                    <tr key={v.measure + v.date} className="border-t border-cream-300"><td className={td}>{v.date}</td><td className={td}>{v.measure}</td><td className={td}>{v.vote}</td><td className="py-2"><Src s={v.source} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        {publicRecord.length > 0 && (
          <Block
            title={p.recordTitle}
            intro={p.recordIntro}
          >
            <ul className="space-y-5">
              {publicRecord.map((e) => (
                <li key={e.source.url + e.date} className="rounded-lg border border-cream-300 bg-white p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                    {p.recordKinds[e.kind]} · {e.issuer} · {formatDate(e.date, lang)}
                  </p>
                  <p className="mt-2 text-navy-800">{e.summary}</p>
                  {e.limits && <p className="mt-2 text-navy-600"><strong>{p.limit}</strong> {e.limits}</p>}
                  <p className="mt-2"><Src s={e.source} /></p>
                  <p className="mt-2 text-navy-700">
                    <strong>{p.candidateResponse}</strong>{' '}
                    {e.response ? <>« {e.response.text} » · {formatDate(e.response.date, lang)}</> : p.responseStatus[e.responseStatus]}
                  </p>
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block title={p.pledgesTitle} intro={p.pledgesIntro}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-navy-600"><tr><th className={th}>{p.colTopic}</th><th className={th}>{p.colPledge}</th><th className={th}>{p.colTimeline}</th><th className={th}>{p.colSourceDate}</th></tr></thead>
              <tbody>
                {pledgeTopics.map((topic) => {
                  const rows = pledgeByTopic(topic)
                  return rows.length === 0 ? (
                    <tr key={topic} className="border-t border-cream-300"><td className={`${td} font-medium`}>{p.topics[topic] ?? topic}</td><td colSpan={3} className="py-2">{pending(p.awaiting)}</td></tr>
                  ) : rows.map((r) => (
                    <tr key={topic + r.pledge} className="border-t border-cream-300"><td className={`${td} font-medium`}>{p.topics[topic] ?? topic}</td><td className={td}>{r.pledge}</td><td className={td}>{r.timeline ?? '—'}</td><td className="py-2"><Src s={r.source} /> · {formatDate(r.date, lang)}</td></tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title={p.programTitle}>
          {c.program ? (
            <div>
              <p className="font-semibold">{c.program.title}</p>
              <p className="text-sm text-navy-600">{p.published} {formatDate(c.program.publishedOn, lang)}</p>
              {c.program.summary && <p className="mt-3 text-navy-800">{c.program.summary}</p>}
              <a href={c.program.url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">{p.originalDoc}</a>
            </div>
          ) : (
            <>
              <p className="text-sm">{pending(p.noProgram)}</p>
              <p className="mt-2 text-sm text-navy-600">
                {p.programNote}
              </p>
            </>
          )}
        </Block>

        <Block title={p.questionnaireTitle} intro={p.questionnaireIntro}>
          <p className="text-sm"><strong>{p.statusLabel}</strong> {questionnaire}</p>
          {c.questionnaire?.map((q) => (
            <div key={q.question} className="mt-4">
              <p className="font-semibold">{q.question}</p>
              <p className="text-navy-700">{q.answer}</p>
            </div>
          ))}
          <p className="mt-3 text-xs text-navy-500">{p.questionnaireNote}</p>
        </Block>

        <Block title={p.interviewsTitle}>
          {c.interviews?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {c.interviews.map((i) => <li key={i.url}><Src s={{ label: i.title, url: i.url }} /> · {formatDate(i.date, lang)}</li>)}
            </ul>
          ) : pending(p.interviewsPending)}
        </Block>

        <Block title={p.sourcesTitle} intro={p.sourcesIntro}>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {c.sources.map((s) => <li key={s.url}><Src s={s} /></li>)}
          </ul>
          {c.corrections.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {c.corrections.map((x) => <li key={x.date}><strong>{formatDate(x.date, lang)}:</strong> {x.note}</li>)}
            </ul>
          )}
          <p className="mt-4 text-sm font-semibold">{p.haveDoc}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/kontak" className="btn-outline">{p.submitSource}</Link>
            <Link href="/kontak" className="btn-outline">{p.requestCorrection}</Link>
          </div>
        </Block>

        <CommentsNotice />

        <nav className="mt-10 flex justify-between gap-4 text-sm font-semibold" aria-label={p.otherCandidates}>
          <Link href={`/kandida/${other[1].slug}`} className="text-navy-700 hover:text-flag-600">← {other[1].name}</Link>
          <Link href={`/kandida/${other[0].slug}`} className="text-navy-700 hover:text-flag-600">{other[0].name} →</Link>
        </nav>

        <p className="mt-10 text-xs text-navy-500">
          {p.footerNote}
        </p>
      </div>
    </>
  )
}
