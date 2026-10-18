import { ImageResponse } from 'next/og'
import { guideDict } from '@/i18n/guide'
import { Brand, OG, ogContentType, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'SoveAyiti — gid elektè'

// Crawlers send no language cookie, so share cards are in Creole (the site default).
export default function Image() {
  const g = guideDict.ht
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: '56px 64px' }}>
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: OG.red, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>{g.eyebrow}</div>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 16, maxWidth: 980 }}>{g.ogTitle}</div>
          <div style={{ display: 'flex', fontSize: 30, color: OG.navy200, marginTop: 22, maxWidth: 900 }}>{g.subtitle}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: OG.navy200 }}>sauverhaiti.com</div>
      </div>
    ),
    size,
  )
}
