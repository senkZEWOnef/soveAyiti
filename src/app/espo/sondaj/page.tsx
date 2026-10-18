import type { Metadata } from 'next'
import { athletes } from '@/data/athletes'
import { getCounts } from '@/lib/votes'
import { votedToday } from '@/lib/voteGuard'
import VoteBoard from '@/components/VoteBoard'
import ShareButtons from '@/components/ShareButtons'
import { PageHeader } from '@/components/Shared'
import { getT } from '@/i18n/server'
import { getTools } from '@/i18n/tools'

export function generateMetadata(): Metadata {
  return { title: getTools().poll.metaTitle, description: getTools().poll.subtitle }
}
export const dynamic = 'force-dynamic'

export default async function AthletePollPage() {
  const { t } = getT()
  const p = getTools().poll
  const options = athletes.map((a) => ({
    slug: a.slug,
    name: a.name,
    affiliation: a.sport ? t.athletes.sports[a.sport] ?? a.sport : undefined,
    photo: a.photo?.src,
  }))
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <div className="container-max py-8 sm:py-14">
        <p className="mb-6 rounded-lg border border-navy-200 bg-white p-4 text-sm text-navy-800">{p.disclaimer(options.length)}</p>
        <ShareButtons text={p.title} className="mb-8" />
        <VoteBoard candidates={options} initialCounts={await getCounts('athlete')} initialVoted={votedToday('athlete')} poll="athlete" profileBase="/espo/atlet" />
      </div>
    </>
  )
}
