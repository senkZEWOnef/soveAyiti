'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { site } from '@/data/site'

const navigation = [
  { name: 'Kandida', href: '/kandida' },
  { name: 'Eksplike', href: '/eksplike' },
  { name: 'Kilti', href: '/kilti' },
  { name: 'Espò', href: '/espo' },
  { name: 'Apwopo', href: '/apwopo' },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 overflow-hidden rounded-md" aria-hidden>
        <span className="w-1/2 bg-navy-700" />
        <span className="w-1/2 bg-flag-500" />
      </span>
      <span className="leading-none">
        <span className={`block font-serif text-xl font-bold ${light ? 'text-cream-50' : 'text-navy-800'}`}>
          {site.name}
        </span>
        <span className={`block text-[11px] tracking-wide ${light ? 'text-navy-200' : 'text-navy-500'}`}>
          {site.frName}
        </span>
      </span>
    </span>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50/95 backdrop-blur">
      <div className="container-max flex items-center justify-between py-3">
        <Link href="/" aria-label={`${site.name} — akèy`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasyon prensipal">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-navy-700 hover:text-flag-600">
              {item.name}
            </Link>
          ))}
          <Link href="/abonnman" className="btn-primary !py-2">
            Rezime semenn
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-navy-700 hover:bg-cream-200 md:hidden"
          aria-label={open ? 'Fèmen meni' : 'Louvri meni'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="container-max flex flex-col border-t border-cream-300 pb-4 md:hidden" aria-label="Navigasyon mobil">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-navy-800"
            >
              {item.name}
            </Link>
          ))}
          <Link href="/abonnman" onClick={() => setOpen(false)} className="btn-primary mt-2">
            Rezime semenn
          </Link>
        </nav>
      )}
    </header>
  )
}
