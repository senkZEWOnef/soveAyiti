import type { Metadata } from 'next'
import { candidates } from '@/data/candidates'
import { CandidateCard, ElectionNotice, PageHeader, StatusBadge } from '@/components/Shared'
import { statusLabels } from '@/data/candidates'

export const metadata: Metadata = { title: 'Kandida' }

export default function CandidatesPage() {
  const offices = Array.from(new Set(candidates.map((c) => c.office)))

  return (
    <>
      <PageHeader
        eyebrow="Eleksyon"
        title="Pwofil kandida yo"
        subtitle="12 enskripsyon prelimine pou prezidans dapre CEP, an atant verifikasyon ofisyèl. Chak pwofil swiv menm fòma a, e sa nou pa ka sipòte ak yon sous, nou pa pibliye l."
      />
      <div className="container-max section">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {offices.map((office) => (
              <div key={office} className="mb-10">
                <h2 className="mb-4 text-2xl font-bold">{office}</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {candidates.filter((c) => c.office === office).map((c) => (
                    <CandidateCard key={c.slug} candidate={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <ElectionNotice />
            <div className="card">
              <h2 className="font-sans text-base font-bold">Kisa estati yo vle di</h2>
              <ul className="mt-4 space-y-4 text-sm text-navy-700">
                {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((k) => (
                  <li key={k}>
                    <StatusBadge status={k} />
                    <p className="mt-1">{statusLabels[k].fr}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-navy-500">Anonse ≠ apwouve. Chak estati gen dat ak sous.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
