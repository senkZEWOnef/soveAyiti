// Saves the Instagram card of every quote in src/data/quotes.ts as a PNG in ~/Desktop/soveayiti-instagram.
// Needs the dev server running so the address on the cards is the real one:
//   NEXT_PUBLIC_SITE_URL=https://sauverhaiti.com npm run dev
//   node scripts/export-quote-cards.mjs [baseUrl]     (default http://localhost:3000)
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

const base = process.argv[2] ?? 'http://localhost:3000'
const out = path.join(homedir(), 'Desktop', 'soveayiti-instagram')
const src = await readFile(new URL('../src/data/quotes.ts', import.meta.url), 'utf8')
const ids = [...src.matchAll(/^\s*id:\s*'([^']+)'/gm)].map((m) => m[1])

await mkdir(out, { recursive: true })
for (const id of ids) {
  const res = await fetch(`${base}/api/quote-card/${id}`)
  if (!res.ok) { console.error(`✗ ${id}: HTTP ${res.status}`); continue }
  await writeFile(path.join(out, `${id}.png`), Buffer.from(await res.arrayBuffer()))
  console.log(`✓ ${id}.png`)
}
console.log(`\n${ids.length} card(s) in ${out}`)
