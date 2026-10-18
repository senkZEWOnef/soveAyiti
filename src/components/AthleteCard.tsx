import Link from 'next/link'
import Image from 'next/image'
import type { Athlete } from '@/data/athletes'
import { getT } from '@/i18n/server'

export const initialsOf = (name: string) => name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export function AthleteCard({ athlete: a }: { athlete: Athlete }) {
  const { t } = getT()
  const l = t.athletes
  const sport = a.sport ? l.sports[a.sport] ?? a.sport : undefined
  const pos = a.positions[0] ? l.positions[a.positions[0]] ?? a.positions[0] : undefined
  return (
    <Link href={`/espo/atlet/${a.slug}`} className="card group flex h-full flex-col overflow-hidden !p-0">
      <div className="relative aspect-[4/5] bg-navy-800">
        {a.photo ? (
          <Image src={a.photo.src} alt={t.hero.photoAlt(a.name)} fill sizes="(min-width:1024px) 15rem, (min-width:640px) 30vw, 45vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-navy-300">
            <span className="font-serif text-5xl font-bold" aria-hidden>{initialsOf(a.name)}</span>
            <span className="text-[11px]">{l.photoPlaceholder}</span>
          </div>
        )}
        {sport && <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase text-navy-800">{sport}</span>}
        {a.haitiSenior && (
          <span className="absolute bottom-2 left-2 rounded bg-flag-600 px-2 py-0.5 text-[11px] font-bold text-white">
            {a.haitiSenior.caps ? `${a.haitiSenior.caps} ${l.caps}` : l.national}
            {a.haitiSenior.goals ? ` · ${a.haitiSenior.goals} ${l.goals}` : ''}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-base font-bold leading-snug text-navy-900 group-hover:text-flag-600 sm:text-lg">{a.name}</h3>
        {pos && <p className="mt-0.5 text-xs text-navy-700 sm:text-sm">{pos}</p>}
        {a.current && <p className="text-xs text-navy-500">{a.current.team}</p>}
      </div>
    </Link>
  )
}
