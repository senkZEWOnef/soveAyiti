import type { Metadata } from 'next'
import { PageHeader } from '@/components/Shared'
import SimpleForm from '@/components/SignupForm'
import { getT } from '@/i18n/server'

export function generateMetadata(): Metadata {
  return { title: getT().t.contact.metaTitle }
}

export default function ContactPage() {
  const { t } = getT()
  const c = t.contact
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <div className="container-max section max-w-2xl">
        <SimpleForm
          topic="kontak / koreksyon"
          submitLabel={c.submit}
          successMessage={c.success}
          fields={[
            { name: 'sijè', label: c.subjectLabel, type: 'select', required: true, options: c.subjects },
            { name: 'kontak', label: c.contactLabel },
            { name: 'mesaj', label: c.messageLabel, type: 'textarea', required: true, placeholder: c.messagePlaceholder },
          ]}
        />
      </div>
    </>
  )
}
