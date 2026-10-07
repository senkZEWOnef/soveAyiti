import Link from 'next/link'
import { ArrowRight, BookOpen, Landmark, Music, Trophy } from 'lucide-react'
import { presidentialCandidates as candidates } from '@/data/candidates'
import { formatDate } from '@/lib/utils'
import HeroCarousel from '@/components/HeroCarousel'
import PollStrip from '@/components/PollStrip'
import { byCategory, sortedArticles } from '@/data/articles'
import { getT } from '@/i18n/server'
import { localizeCandidate } from '@/i18n/content'
import {
  ArticleCard,
  CandidateCard,
  ElectionNotice,
  IndependenceBar,
  SectionTitle,
} from '@/components/Shared'

const pillarMeta = [
  { icon: Landmark, href: '/kandida' },
  { icon: BookOpen, href: '/eksplike' },
  { icon: Music, href: '/kilti' },
  { icon: Trophy, href: '/espo' },
]

export default async function HomePage() {
  const { lang, t } = getT()
  const latest = sortedArticles.slice(0, 3)
  const culture = byCategory('culture').concat(byCategory('sports')).slice(0, 2)

  return (
    <>
      <HeroCarousel
        candidates={candidates.map((raw) => {
          const c = localizeCandidate(raw, lang)
          return {
            slug: c.slug,
            name: c.name,
            office: c.office,
            statusLabel: t.status[c.status].label,
            statusDate: formatDate(c.statusDate, lang),
            blurb: c.blurb,
            photo: c.photo,
          }
        })}
        aside={<ElectionNotice />}
        brand={
          <>
            <div className="text-navy-200"><IndependenceBar /></div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-6xl">
              {t.home.h1a}<span className="text-flag-500">{t.home.h1b}</span>{t.home.h1c}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              {t.home.lead}
            </p>
            <p className="mt-2 max-w-xl text-sm text-navy-300">
              {t.home.alt}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kandida" className="btn-accent">
                {t.home.seeProfiles} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/abonnman" className="btn border border-navy-300 text-cream-50 hover:bg-navy-700">
                {t.home.getDigest}
              </Link>
            </div>
          </>
        }
      />

      <PollStrip />

      <section className="section">
        <div className="container-max grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillarMeta.map(({ icon: Icon, href }, i) => {
            const [title, text] = t.home.pillars[i]
            return (
            <Link key={title} href={href} className="card group">
              <Icon className="h-7 w-7 text-flag-600" aria-hidden />
              <h2 className="mt-4 text-xl font-bold group-hover:text-flag-600">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">{text}</p>
            </Link>
            )
          })}
        </div>
      </section>

      <section className="pb-14 sm:pb-20">
        <div className="container-max">
          <SectionTitle eyebrow={t.home.flagship} title={t.home.profilesTitle} href="/kandida" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {candidates.slice(0, 6).map((c) => <CandidateCard key={c.slug} candidate={c} />)}
          </div>
          <p className="mt-6 text-center">
            <Link href="/kandida" className="btn-outline">{t.home.seeAllN(candidates.length)}</Link>
          </p>
          <p className="mt-5 text-sm text-navy-600">
            {t.home.sameForAll}
          </p>
        </div>
      </section>

      <section className="bg-cream-50 section">
        <div className="container-max">
          <SectionTitle eyebrow={t.home.latest} title={t.home.latestTitle} />
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-max">
          <SectionTitle eyebrow={t.home.cultureEyebrow} title={t.home.cultureTitle} href="/kilti" cta={t.home.cultureCta} />
          <div className="grid gap-5 md:grid-cols-2">
            {culture.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      <section className="border-t border-cream-300 bg-cream-50 section">
        <div className="container-max max-w-3xl text-center">
          <p className="eyebrow">{t.home.questionEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold">{t.questionOfTheWeek}</h2>
          <p className="mt-4 text-navy-700">
            {t.home.questionNote}
          </p>
          <Link href="/abonnman" className="btn-primary mt-6">{t.home.answerSubscribe}</Link>
        </div>
      </section>
    </>
  )
}
