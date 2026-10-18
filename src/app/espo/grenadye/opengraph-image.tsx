import { ImageResponse } from 'next/og'
import { worldCupDict, wcStandings } from '@/i18n/worldcup'
import { Brand, OG, ogContentType, ogSize } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'SoveAyiti — Ayiti nan Koup di Mond 2026'

// Crawlers send no language cookie, so share cards are in Creole (the site default).
export default function Image() {
  const w = worldCupDict.ht
  const hai = wcStandings.find((s) => s.team === 'HAI')!
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: '56px 64px' }}>
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: OG.red, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>{w.eyebrow}</div>
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>{w.title}</div>
          <div style={{ display: 'flex', marginTop: 28 }}>
            {[
              [String(hai.pts), w.stats.pts],
              [String(hai.gf), w.stats.gf],
              [String(hai.ga), w.stats.ga],
            ].map(([v, l]) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', marginRight: 44 }}>
                <div style={{ display: 'flex', fontSize: 64, fontWeight: 700 }}>{v}</div>
                <div style={{ display: 'flex', fontSize: 24, color: OG.navy200 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: OG.navy200 }}>{`${w.ogLine} · sauverhaiti.com`}</div>
      </div>
    ),
    size,
  )
}
