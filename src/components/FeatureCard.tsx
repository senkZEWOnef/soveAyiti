import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

// A larger "preview" card for carousels: photo, a badge, name, a short summary, and a clear link to the full profile.
export function FeatureCard({
  href,
  name,
  photo,
  alt,
  placeholder,
  badge,
  flag,
  sub,
  preview,
  cta,
}: {
  href: string
  name: string
  photo?: string
  alt: string
  placeholder: ReactNode
  badge?: string
  flag?: string
  sub?: string
  preview?: string
  cta: string
}) {
  return (
    <Link href={href} className="card group flex h-full flex-col overflow-hidden !p-0">
      <div className="relative aspect-[4/5] bg-navy-800">
        {photo ? (
          <Image src={photo} alt={alt} fill sizes="(min-width:1024px) 22rem, (min-width:640px) 45vw, 78vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-navy-300">{placeholder}</div>
        )}
        {badge && <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase text-navy-800">{badge}</span>}
        {flag && <span className="absolute bottom-3 left-3 rounded bg-flag-600 px-2.5 py-1 text-xs font-bold text-white">{flag}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-bold leading-snug text-navy-900 group-hover:text-flag-600">{name}</h3>
        {sub && <p className="mt-0.5 text-sm text-navy-600">{sub}</p>}
        {preview && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-700">{preview}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-flag-600">
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
