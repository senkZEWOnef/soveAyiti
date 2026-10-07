import { ImageResponse } from 'next/og'
import { candidates } from '@/data/candidates'
import { localizeCandidate } from '@/i18n/content'
import { dict } from '@/i18n/dictionary'
import { formatDate } from '@/lib/utils'
import { Brand, OG, ogContentType, ogSize, publicImageDataUri } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'SoveAyiti — pwofil kandida'

// Crawlers send no language cookie, so share cards are in Creole (the site default).
export default async function Image({ params }: { params: { slug: string } }) {
  const raw = candidates.find((x) => x.slug === params.slug)
  const t = dict.ht
  if (!raw) {
    return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: OG.navy800 }} />, size)
  }
  const c = localizeCandidate(raw, 'ht')
  const photo = await publicImageDataUri(c.photo)
  const initials = c.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const where = [c.locality, c.department].filter(Boolean).join(' · ')
  const nameSize = c.name.length > 22 ? 62 : 76

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: OG.navy800, color: OG.cream }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '56px 24px 52px 64px' }}>
          <Brand />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 26, color: OG.red, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              {`${c.office}${c.affiliation ? ` · ${c.affiliation}` : ''}`}
            </div>
            <div style={{ display: 'flex', fontSize: nameSize, fontWeight: 700, lineHeight: 1.05, marginTop: 14 }}>{c.name}</div>
            {where && <div style={{ display: 'flex', fontSize: 26, color: OG.navy200, marginTop: 14 }}>{where}</div>}
            <div
              style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 26, padding: '10px 20px', borderRadius: 999, background: OG.navy700, fontSize: 24 }}
            >
              {t.status[c.status].label}
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: OG.navy200 }}>
            {`${t.independence[0]} • ${t.independence[2]} · ${formatDate(c.lastReviewed, 'ht')}`}
          </div>
        </div>
        <div style={{ display: 'flex', width: 440, padding: '40px 64px 40px 0', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', width: 376, height: 550, borderRadius: 24, overflow: 'hidden', background: OG.navy700, border: `3px solid ${OG.navy700}` }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" width={376} height={550} style={{ objectFit: 'cover', objectPosition: 'top' }} />
            ) : (
              <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 140, fontWeight: 700, color: OG.navy200 }}>
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
