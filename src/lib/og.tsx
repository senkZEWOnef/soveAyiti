import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Shared pieces for the social share cards (WhatsApp / Facebook / X previews). Colors mirror tailwind.config.ts.
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'
export const OG = { navy900: '#0a1832', navy800: '#0f2248', navy700: '#152f60', navy200: '#b3c9ea', cream: '#fffdf9', red: '#c8374a' }

/** Reads a /public image into a data URI (Satori only renders JPEG/PNG/GIF). Returns undefined if missing. */
export async function publicImageDataUri(publicPath?: string): Promise<string | undefined> {
  if (!publicPath || !/\.(jpe?g|png)$/i.test(publicPath)) return undefined
  try {
    const file = await readFile(path.join(process.cwd(), 'public', publicPath))
    return `data:image/${publicPath.toLowerCase().endsWith('png') ? 'png' : 'jpeg'};base64,${file.toString('base64')}`
  } catch {
    return undefined
  }
}

export function Brand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: 52, height: 52, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: 26, height: 52, background: OG.navy700 }} />
        <div style={{ width: 26, height: 52, background: OG.red }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 16 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: OG.cream, lineHeight: 1 }}>SoveAyiti</div>
        <div style={{ fontSize: 18, color: OG.navy200, marginTop: 4 }}>Sauver Haïti</div>
      </div>
    </div>
  )
}
