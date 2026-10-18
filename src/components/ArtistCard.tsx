import Link from 'next/link'
import Image from 'next/image'
import { Music } from 'lucide-react'
import type { Artist } from '@/data/artists'
import { describeArtist } from '@/lib/artistText'
import { getMusicT } from '@/i18n/music'

export function ArtistCard({ artist: a }: { artist: Artist }) {
  const m = getMusicT()
  const { genres, jobs } = describeArtist(a, m)
  return (
    <Link href={`/kilti/atis/${a.slug}`} className="card group flex h-full flex-col overflow-hidden !p-0">
      <div className="relative aspect-[4/5] bg-navy-800">
        {a.photo ? (
          <Image src={a.photo.src} alt={a.name} fill sizes="(min-width:1024px) 15rem, (min-width:640px) 30vw, 45vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-navy-300">
            <Music className="h-10 w-10" aria-hidden />
            <span className="font-serif text-lg font-bold leading-tight text-navy-200">{a.name}</span>
            <span className="text-[11px]">{m.photoPlaceholder}</span>
          </div>
        )}
        {genres[0] && <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase text-navy-800">{genres[0]}</span>}
        {a.kind === 'group' && <span className="absolute bottom-2 left-2 rounded bg-flag-600 px-2 py-0.5 text-[11px] font-bold text-white">{m.group}</span>}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-base font-bold leading-snug text-navy-900 group-hover:text-flag-600 sm:text-lg">{a.name}</h3>
        {jobs[0] && <p className="mt-0.5 text-xs capitalize text-navy-700 sm:text-sm">{jobs[0]}</p>}
        {a.start && <p className="text-xs text-navy-500">{a.start.slice(0, 4)}{a.end ? `–${a.end.slice(0, 4)}` : ''}</p>}
      </div>
    </Link>
  )
}
