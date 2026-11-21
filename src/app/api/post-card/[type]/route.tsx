import { ImageResponse } from 'next/og'
import { candidates } from '@/data/candidates'
import { site } from '@/data/site'
import { Brand, OG } from '@/lib/og'

// Instagram portrait cards (1080x1350): /api/post-card/<registration|date|know>. Save the PNG and post it with the caption.
// Dates come from the CEP calendar published 28 Oct 2026 (1st round 18 Jul 2027, runoff 4 Oct 2027) — re-check on cephaiti.ht before posting.
const size = { width: 1080, height: 1350 }

export async function GET(_req: Request, { params }: { params: { type: string } }) {
  const host = new URL(site.url).host
  const presidents = candidates.filter((c) => c.officeKey === 'president').length

  const cards: Record<string, { kicker: string; big: string; text: string; note: string }> = {
    registration: {
      kicker: 'Prezidans 2027',
      big: String(presidents),
      text: 'kandida enskri pou prezidans lan. Enskripsyon an fèmen 15 novanm.',
      note: 'Chif prelimine. Lis ofisyèl la vini apre verifikasyon CEP (dosye yo dwe depoze avan 30 novanm).',
    },
    date: {
      kicker: 'Dat eleksyon yo',
      big: '18 jiyè 2027',
      text: 'Premye tou eleksyon prezidansyèl ak lejislatif la. Dezyèm tou: 4 oktòb 2027.',
      note: 'Kalandriye CEP la pibliye 28 oktòb 2026. Li ka chanje.',
    },
    know: {
      kicker: 'Konnen kandida w yo',
      big: 'Anvan w vote',
      text: 'Gade pwogram yo, pozisyon yo ak sa yo di piblikman, pou tout kandida yo.',
      note: 'Nou pa pran pozisyon pou okenn kandida.',
    },
  }
  const c = cards[params.type]
  if (!c) return new Response('Not found', { status: 404 })

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: 72 }}>
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 30, color: OG.red, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3 }}>{c.kicker}</div>
          <div style={{ display: 'flex', fontSize: c.big.length > 4 ? 120 : 280, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>{c.big}</div>
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, lineHeight: 1.2, marginTop: 28 }}>{c.text}</div>
          <div style={{ display: 'flex', fontSize: 28, color: OG.navy200, lineHeight: 1.35, marginTop: 36 }}>{c.note}</div>
        </div>
        <div style={{ display: 'flex', alignSelf: 'flex-start', padding: '16px 32px', borderRadius: 999, background: OG.red, fontSize: 30, fontWeight: 700 }}>
          {`Plis enfòmasyon sou ${host}`}
        </div>
      </div>
    ),
    size,
  )
}
