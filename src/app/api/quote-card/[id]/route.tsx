import { ImageResponse } from 'next/og'
import { candidates } from '@/data/candidates'
import { quotes } from '@/data/quotes'
import { site } from '@/data/site'
import { localizeCandidate } from '@/i18n/content'
import { formatDate } from '@/lib/utils'
import { Brand, OG, publicImageDataUri } from '@/lib/og'

// Instagram portrait card (1080x1350) for one quote: /api/quote-card/<quote id>. Save the PNG and post it with the caption.
const size = { width: 1080, height: 1350 }

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const q = quotes.find((x) => x.id === params.id)
  const raw = q && candidates.find((c) => c.slug === q.candidateSlug)
  if (!q || !raw) return new Response('Not found', { status: 404 })

  const c = localizeCandidate(raw, 'ht')
  const photo = await publicImageDataUri(c.photo)
  const initials = c.name.split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const host = new URL(site.url).host
  const n = q.quote.length
  const quoteSize = n > 220 ? 44 : n > 140 ? 54 : n > 80 ? 64 : 74

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: OG.navy800, color: OG.cream, padding: 72 }}>
        <Brand />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 150, height: 190, borderRadius: 20, overflow: 'hidden', background: OG.navy700 }}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" width={150} height={190} style={{ objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 700, color: OG.navy200 }}>{initials}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 32 }}>
              <div style={{ display: 'flex', fontSize: 46, fontWeight: 700, lineHeight: 1.1 }}>{c.name}</div>
              <div style={{ display: 'flex', fontSize: 26, color: OG.red, fontWeight: 700, marginTop: 10, textTransform: 'uppercase', letterSpacing: 2 }}>{c.office}</div>
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: quoteSize, fontWeight: 700, lineHeight: 1.15, marginTop: 56 }}>{`« ${q.quote} »`}</div>
          {q.coverage && <div style={{ display: 'flex', fontSize: 30, color: OG.navy200, lineHeight: 1.35, marginTop: 28 }}>{q.coverage}</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 26, color: OG.navy200, lineHeight: 1.35 }}>
            {`Source : ${q.source.author}, ${q.source.outlet} · ${formatDate(q.date, q.language)}`}
          </div>
          <div style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 28, padding: '16px 32px', borderRadius: 999, background: OG.red, fontSize: 30, fontWeight: 700 }}>
            {`Plis deklarasyon sou ${host}`}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
