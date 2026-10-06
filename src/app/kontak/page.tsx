import type { Metadata } from 'next'
import { PageHeader } from '@/components/Shared'
import SimpleForm from '@/components/SignupForm'

export const metadata: Metadata = { title: 'Kontak ak koreksyon' }

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Siyale yon erè oswa ekri nou"
        subtitle="Si yon enfòmasyon pa egzat, voye l ak yon sous. Nou korije l piblikman."
      />
      <div className="container-max section max-w-2xl">
        <SimpleForm
          topic="kontak / koreksyon"
          submitLabel="Voye mesaj la"
          successMessage="Mèsi! Nou resevwa mesaj ou a."
          fields={[
            { name: 'sijè', label: 'Sa w ap voye', type: 'select', required: true, options: ['Koreksyon', 'Sijesyon sijè', 'Rapò kòmantè', 'Lòt'] },
            { name: 'kontak', label: 'Imèl oswa WhatsApp (opsyonèl, si w vle yon repons)' },
            { name: 'mesaj', label: 'Mesaj ou', type: 'textarea', required: true, placeholder: 'Mete lyen sous la si w gen youn.' },
          ]}
        />
      </div>
    </>
  )
}
