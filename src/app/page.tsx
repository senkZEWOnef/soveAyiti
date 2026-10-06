import Link from 'next/link'
import { ArrowRight, BookOpen, Landmark, Music, Trophy } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { byCategory, sortedArticles } from '@/data/articles'
import { questionOfTheWeek } from '@/data/site'
import {
  ArticleCard,
  CandidateCard,
  ElectionNotice,
  IndependenceBar,
  SectionTitle,
} from '@/components/Shared'

const pillars = [
  { icon: Landmark, title: 'Kandida', text: 'Pwofil estanda: estati, fòmasyon, pòs anvan, vòt dokimante, pwopozisyon, ak sous.', href: '/kandida' },
  { icon: BookOpen, title: 'Eksplike', text: 'Kijan gouvènman an mache ak dokiman piblik yo eksplike, ak limit yo.', href: '/eksplike' },
  { icon: Music, title: 'Kilti', text: 'Mizik, atis, sinema, kwizin — ekri pou ayisyen.', href: '/kilti' },
  { icon: Trophy, title: 'Espò', text: 'Foutbòl ak istwa espò lokal, ak vrè analiz.', href: '/espo' },
]

export default function HomePage() {
  const latest = sortedArticles.slice(0, 3)
  const culture = byCategory('culture').concat(byCategory('sports')).slice(0, 2)

  return (
    <>
      <section className="bg-navy-800 text-cream-50">
        <div className="container-max grid gap-10 py-16 sm:py-24 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <div className="text-navy-200"><IndependenceBar /></div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] sm:text-6xl">
              Konnen kandida yo. <span className="text-flag-500">Verifye</span> enfòmasyon an.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              SoveAyiti se yon medya endepandan pou ayisyen. Nou fè enfòmasyon piblik sou eleksyon yo fasil pou konprann,
              pou tcheke, epi pou diskite.
            </p>
            <p className="mt-2 max-w-xl text-sm text-navy-300">
              Sauver Haïti — comprendre, vérifier, débattre.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kandida" className="btn-accent">
                Wè pwofil kandida yo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/abonnman" className="btn border border-navy-300 text-cream-50 hover:bg-navy-700">
                Resevwa rezime semenn nan
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ElectionNotice />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-max grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text, href }) => (
            <Link key={title} href={href} className="card group">
              <Icon className="h-7 w-7 text-flag-600" aria-hidden />
              <h2 className="mt-4 text-xl font-bold group-hover:text-flag-600">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-14 sm:pb-20">
        <div className="container-max">
          <SectionTitle eyebrow="Pwodwi prensipal nou" title="Pwofil kandida" href="/kandida" />
          <div className="grid gap-5 md:grid-cols-3">
            {candidates.map((c) => <CandidateCard key={c.slug} candidate={c} />)}
          </div>
          <p className="mt-5 text-sm text-navy-600">
            Chak kandida resevwa menm kesyonè a, menm delè, menm espas. Repons yo make kòm deklarasyon, pa kòm fè verifye.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 section">
        <div className="container-max">
          <SectionTitle eyebrow="Dènye piblikasyon" title="Pou konprann pi byen" />
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-max">
          <SectionTitle eyebrow="Kilti & Espò" title="Rezon pou tounen vini" href="/kilti" cta="Kilti" />
          <div className="grid gap-5 md:grid-cols-2">
            {culture.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      <section className="border-t border-cream-300 bg-cream-50 section">
        <div className="container-max max-w-3xl text-center">
          <p className="eyebrow">Kesyon semenn nan</p>
          <h2 className="mt-3 text-3xl font-bold">{questionOfTheWeek}</h2>
          <p className="mt-4 text-navy-700">
            Nou pa mande ki kandida ou renmen. Nou mande sa ou vle konprann, pou nou ka fè li pou ou.
          </p>
          <Link href="/abonnman" className="btn-primary mt-6">Reponn epi abòne</Link>
        </div>
      </section>
    </>
  )
}
