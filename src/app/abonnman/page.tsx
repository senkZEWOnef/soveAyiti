import type { Metadata } from 'next'
import { PageHeader } from '@/components/Shared'
import SimpleForm from '@/components/SignupForm'
import { site, questionOfTheWeek } from '@/data/site'

export const metadata: Metadata = { title: 'Rezime semenn' }

export default function SubscribePage() {
  return (
    <>
      <PageHeader
        eyebrow="Rezime semenn"
        title="Pi bon travay nou, chak semenn"
        subtitle="Yon rezime kout ak lyen ak pi bon pwofil, eksplikasyon, kilti ak espò. Gratis, volontè, ou ka kite l nenpòt ki lè."
      />
      <div className="container-max section max-w-2xl">
        {site.social.whatsapp && (
          <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-accent mb-8">
            Rejwenn chèn WhatsApp la
          </a>
        )}
        <SimpleForm
          topic="rezime semenn"
          submitLabel="Abòne"
          successMessage="Mèsi! Ou abòne."
          fields={[
            { name: 'kontak', label: 'Imèl oswa nimewo WhatsApp', required: true },
            { name: 'kesyon', label: questionOfTheWeek, type: 'textarea' },
          ]}
        />
      </div>
    </>
  )
}
