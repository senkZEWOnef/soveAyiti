import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { articles, categoryHref } from '@/data/articles'
import { CommentsNotice } from '@/components/Shared'
import { formatDate } from '@/lib/utils'
import { getT } from '@/i18n/server'
import { localizeArticle } from '@/i18n/content'
import { dict } from '@/i18n/dictionary'
import ShareButtons from '@/components/ShareButtons'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { lang } = getT()
  const found = articles.find((x) => x.slug === decodeURIComponent(params.slug))
  if (!found) return {}
  const a = localizeArticle(found, lang)
  return { title: a.title, description: a.excerpt }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { lang, t } = getT()
  const found = articles.find((x) => x.slug === decodeURIComponent(params.slug))
  if (!found) notFound()
  const a = localizeArticle(found, lang)
  // Creole readers also see the French name of the category, as before.
  const catLabel = lang === 'ht' ? `${t.categories[a.category]} · ${dict.fr.categories[a.category]}` : t.categories[a.category]

  return (
    <article className="container-max section max-w-3xl">
      <Link href={categoryHref[a.category]} className="eyebrow hover:underline">{catLabel}</Link>
      <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{a.title}</h1>
      {a.titleFr && <p className="mt-3 font-serif text-xl italic text-navy-600">{a.titleFr}</p>}
      <p className="mt-5 border-b border-cream-300 pb-6 text-sm text-navy-600">
        {a.author} · {formatDate(a.date, lang)}
      </p>
      <ShareButtons text={a.title} className="mt-5" />
      <div className="prose-article mt-8">
        {a.body.map((p) => <p key={p}>{p}</p>)}
      </div>
      {a.sources && a.sources.length > 0 && (
        <div className="mt-8 border-t border-cream-300 pt-5">
          <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">{t.article.sources}</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {a.sources.map((s) => <li key={s.url}><a className="underline" href={s.url}>{s.label}</a></li>)}
          </ul>
        </div>
      )}
      <CommentsNotice />
    </article>
  )
}
