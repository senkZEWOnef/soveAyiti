import type { Metadata } from 'next'
import { presidentialCandidates } from '@/data/candidates'
import { getCounts } from '@/lib/votes'
import VoteBoard from '@/components/VoteBoard'
import { PageHeader } from '@/components/Shared'
import { getT } from '@/i18n/server'
import ShareButtons from '@/components/ShareButtons'

export function generateMetadata(): Metadata {
  return { title: getT().t.vote.metaTitle }
}
export const dynamic = 'force-dynamic'

export default async function VotePage() {
  const { t } = getT()
  const candidates = presidentialCandidates.map((c) => ({ slug: c.slug, name: c.name, affiliation: c.affiliation, photo: c.photo }))
  return (
    <>
      <PageHeader eyebrow={t.vote.eyebrow} title={t.vote.title} subtitle={t.vote.subtitle} />
      <div className="container-max section">
        <p className="mb-8 rounded-lg border border-flag-500/40 bg-white p-4 text-sm text-navy-800">
          <strong>{t.vote.important}</strong> {t.vote.disclaimer}
        </p>
        <ShareButtons text={t.share.poll} className="mb-8" />
        <VoteBoard candidates={candidates} initialCounts={await getCounts()} />
      </div>
    </>
  )
}
