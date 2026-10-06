import type { Metadata } from 'next'
import { byCategory } from '@/data/articles'
import { ArticleCard, PageHeader } from '@/components/Shared'

export const metadata: Metadata = { title: 'Kilti' }

export default function Page() {
  const items = ['culture'].flatMap((c) => byCategory(c as Parameters<typeof byCategory>[0])).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader eyebrow="Mizik, atis, sinema, literati, kwizin" title="Kilti" subtitle="Ekri pa jèn ayisyen ki renmen pale de kilti nou." />
      <div className="container-max section">
        {items.length === 0 ? (
          <p className="text-navy-600">Pa gen atik ankò.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </div>
    </>
  )
}
