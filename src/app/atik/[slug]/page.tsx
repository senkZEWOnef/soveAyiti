import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { articles, categoryLabels } from '@/data/articles'
import { CommentsNotice } from '@/components/Shared'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = articles.find((x) => x.slug === params.slug)
  return a ? { title: a.title, description: a.excerpt } : {}
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = articles.find((x) => x.slug === params.slug)
  if (!a) notFound()
  const cat = categoryLabels[a.category]

  return (
    <article className="container-max section max-w-3xl">
      <Link href={cat.href} className="eyebrow hover:underline">{cat.ht} · {cat.fr}</Link>
      <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{a.title}</h1>
      {a.titleFr && <p className="mt-3 font-serif text-xl italic text-navy-600">{a.titleFr}</p>}
      <p className="mt-5 border-b border-cream-300 pb-6 text-sm text-navy-600">
        {a.author} · {formatDate(a.date)}
      </p>
      <div className="prose-article mt-8">
        {a.body.map((p) => <p key={p}>{p}</p>)}
      </div>
      {a.sources && a.sources.length > 0 && (
        <div className="mt-8 border-t border-cream-300 pt-5">
          <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-flag-600">Sous</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {a.sources.map((s) => <li key={s.url}><a className="underline" href={s.url}>{s.label}</a></li>)}
          </ul>
        </div>
      )}
      <CommentsNotice />
    </article>
  )
}
