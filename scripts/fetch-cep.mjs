// Snapshots the CEP's PRELIMINARY candidate registrations (the same public endpoint the CEP dashboard uses)
// into src/data/cep-snapshot.json. Re-run any time: `node scripts/fetch-cep.mjs`.
// Offices covered: Président, Sénateur, Député, Maire. Be gentle: sequential requests with a short pause.
import { writeFile } from 'node:fs/promises'

const BASE = 'https://tableau.cephaiti.ht/api/tableau/candidats'
const POSTES = ['Président', 'Sénateur', 'Député', 'Maire']
const pause = (ms) => new Promise((r) => setTimeout(r, ms))

async function getPage(poste, page) {
  const url = `${BASE}?poste=${encodeURIComponent(poste)}${page > 1 ? `&page=${page}` : ''}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      return await res.json()
    } catch (e) {
      if (attempt === 3) throw new Error(`${poste} page ${page}: ${e.message}`)
      await pause(1000 * attempt)
    }
  }
}

const rows = []
for (const poste of POSTES) {
  const first = await getPage(poste, 1)
  const pages = Math.ceil(first.total / first.pageSize)
  let got = first.items
  for (let p = 2; p <= pages; p++) {
    await pause(250)
    got = got.concat((await getPage(poste, p)).items)
  }
  if (got.length !== first.total) throw new Error(`${poste}: expected ${first.total}, got ${got.length}`)
  console.log(`${poste}: ${got.length}`)
  rows.push(...got)
}

await writeFile(
  new URL('../src/data/cep-snapshot.json', import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString().slice(0, 10), source: 'https://cephaiti.ht/statistiques-enregistrement-des-candidats/', rows }, null, 0) + '\n',
)
console.log('Saved', rows.length, 'rows')
