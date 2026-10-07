import Link from 'next/link'
import { site } from '@/data/site'
import { Logo } from './Header'
import { getT } from '@/i18n/server'

const socials: { key: keyof typeof site.social; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'youtube', label: 'YouTube' },
]

export default function Footer() {
  const { t } = getT()
  const active = socials.filter((s) => site.social[s.key])

  return (
    <footer className="mt-10 bg-navy-900 text-navy-200">
      <div className="container-max grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed">{t.footer.blurb}</p>
        </div>

        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-cream-50">{t.footer.explore}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/kandida" className="hover:text-white">{t.footer.candidates}</Link></li>
            <li><Link href="/eksplike" className="hover:text-white">{t.footer.explain}</Link></li>
            <li><Link href="/kilti" className="hover:text-white">{t.footer.culture}</Link></li>
            <li><Link href="/espo" className="hover:text-white">{t.footer.sports}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-cream-50">{t.footer.stayConnected}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/abonnman" className="hover:text-white">{t.footer.digest}</Link></li>
            <li><Link href="/kontak" className="hover:text-white">{t.footer.reportError}</Link></li>
            <li><Link href="/apwopo#kòmantè" className="hover:text-white">{t.footer.commentRules}</Link></li>
            {active.map((s) => (
              <li key={s.key}>
                <a href={site.social[s.key]} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-700 py-5 text-center text-xs text-navy-300">
        © {new Date().getFullYear()} {site.name} · {t.independence.join(' • ')}
      </div>
    </footer>
  )
}
