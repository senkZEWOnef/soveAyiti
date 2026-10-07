import { ImageResponse } from 'next/og'
import { dict } from '@/i18n/dictionary'
import { Brand, OG, ogContentType, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'SoveAyiti — medya endepandan ayisyen'

export default function Image() {
  const t = dict.ht
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: '56px 72px' }}>
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            {`${t.home.h1a}${t.home.h1b}${t.home.h1c}`}
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: OG.navy200, marginTop: 24 }}>{t.home.alt}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: OG.red, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          {t.independence.join(' • ')}
        </div>
      </div>
    ),
    size,
  )
}
