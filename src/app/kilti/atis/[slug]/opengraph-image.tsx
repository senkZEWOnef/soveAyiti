import { ImageResponse } from 'next/og'
import { artistBySlug } from '@/data/artists'
import { describeArtist } from '@/lib/artistText'
import { music } from '@/i18n/music'
import { Brand, OG, ogContentType, ogSize, publicImageDataUri } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'SoveAyiti — mizik ayisyen'

// Crawlers send no language cookie, so share cards are in Creole (the site default).
export default async function Image({ params }: { params: { slug: string } }) {
  const a = artistBySlug(params.slug)
  const m = music.ht
  if (!a) return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: OG.navy800 }} />, size)
  const photo = await publicImageDataUri(a.photo?.src)
  const initials = a.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const { genres } = describeArtist(a, m)
  const nameSize = a.name.length > 22 ? 62 : 76
  const line = [a.kind === 'group' ? m.group : m.person, genres[0]].filter(Boolean).join(' · ')

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: OG.navy800, color: OG.cream }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '56px 24px 52px 64px' }}>
          <Brand />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 26, color: OG.red, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{m.eyebrow}</div>
            <div style={{ display: 'flex', fontSize: nameSize, fontWeight: 700, lineHeight: 1.05, marginTop: 14 }}>{a.name}</div>
            {line && <div style={{ display: 'flex', fontSize: 28, color: OG.navy200, marginTop: 14 }}>{line}</div>}
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: OG.navy200 }}>sauverhaiti.com</div>
        </div>
        <div style={{ display: 'flex', width: 440, padding: '40px 64px 40px 0', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', width: 376, height: 550, borderRadius: 24, overflow: 'hidden', background: OG.navy700, border: `3px solid ${OG.navy700}` }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" width={376} height={550} style={{ objectFit: 'cover', objectPosition: 'top' }} />
            ) : (
              <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 140, fontWeight: 700, color: OG.navy200 }}>{initials}</div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
