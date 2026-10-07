import type { Metadata } from 'next'
import { PageHeader } from '@/components/Shared'
import SimpleForm from '@/components/SignupForm'
import { site } from '@/data/site'
import { getT } from '@/i18n/server'

export function generateMetadata(): Metadata {
  return { title: getT().t.digest.metaTitle }
}

export default function SubscribePage() {
  const { t } = getT()
  const d = t.digest
  return (
    <>
      <PageHeader eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className="container-max section max-w-2xl">
        {site.social.whatsapp && (
          <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-accent mb-8">
            {d.joinWhatsapp}
          </a>
        )}
        <SimpleForm
          topic="rezime semenn"
          submitLabel={d.submit}
          successMessage={d.success}
          fields={[
            { name: 'kontak', label: d.contactLabel, required: true },
            { name: 'kesyon', label: t.questionOfTheWeek, type: 'textarea' },
          ]}
        />
      </div>
    </>
  )
}
