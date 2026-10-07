import type { Metadata } from 'next'
import { byCategory } from '@/data/articles'
import { ArticleCard, PageHeader } from '@/components/Shared'
import { getT } from '@/i18n/server'

export function generateMetadata(): Metadata {
  return { title: getT().t.sections.sports.meta }
}

export default function Page() {
  const { t } = getT()
  const s = t.sections.sports
  const items = ['sports'].flatMap((c) => byCategory(c as Parameters<typeof byCategory>[0])).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div className="container-max section">
        {items.length === 0 ? (
          <p className="text-navy-600">{t.common.noArticles}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </div>
    </>
  )
}
