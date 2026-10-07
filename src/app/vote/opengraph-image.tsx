import { ImageResponse } from 'next/og'
import { dict } from '@/i18n/dictionary'
import { Brand, OG, ogContentType, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'Sondaj SoveAyiti'

export default function Image() {
  const t = dict.ht
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: '56px 72px' }}>
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: OG.red, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{t.vote.eyebrow}</div>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>{t.vote.title}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: OG.navy200 }}>{t.independence.join(' • ')}</div>
      </div>
    ),
    size,
  )
}
