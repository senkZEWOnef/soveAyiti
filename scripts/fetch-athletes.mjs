// Snapshots public biographical + career data for the athletes listed in src/data/athlete-ids.json from Wikidata
// (CC0) into src/data/athletes-snapshot.json, and downloads each athlete's Wikimedia Commons photo (only if it carries
// a free licence) into public/athletes/ together with the credit required by that licence.
// Re-run any time: `node scripts/fetch-athletes.mjs`. Add an athlete by adding their Wikidata ID to athlete-ids.json.
// Be gentle with the APIs: sequential requests with a short pause.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'

const UA = 'SoveAyitiBot/1.0 (https://sauverhaiti.com; editorial fact snapshot)'
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const root = new URL('../', import.meta.url)

async function getJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      return await res.json()
    } catch (e) {
      if (attempt === 3) throw new Error(`${url}: ${e.message}`)
      await pause(1000 * attempt)
    }
  }
}

const ids = JSON.parse(await readFile(new URL('src/data/athlete-ids.json', root), 'utf8'))

// ---- 1. entities ----
const entities = {}
for (const a of ids) {
  const data = await getJson(`https://www.wikidata.org/wiki/Special:EntityData/${a.qid}.json`)
  entities[a.qid] = data.entities[a.qid]
  await pause(250)
}

const val = (c) => c?.mainsnak?.datavalue?.value
const best = (claims) => (claims ?? []).filter((c) => c.rank !== 'deprecated').sort((x, y) => (y.rank === 'preferred') - (x.rank === 'preferred'))
const qid = (c) => val(c)?.id
const year = (t) => (t ? Number(String(t.time).slice(1, 5)) : undefined)
const iso = (t) => {
  if (!t) return undefined
  const m = String(t.time).match(/^\+(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return undefined
  if (t.precision >= 11 && m[2] !== '00' && m[3] !== '00') return `${m[1]}-${m[2]}-${m[3]}`
  if (t.precision === 10 && m[2] !== '00') return `${m[1]}-${m[2]}`
  return m[1]
}

// ---- 2. labels of everything they reference (clubs, places, positions, sports, countries) ----
const refs = new Set()
for (const e of Object.values(entities)) {
  for (const p of ['P19', 'P27', 'P413', 'P641', 'P106']) best(e.claims[p]).forEach((c) => qid(c) && refs.add(qid(c)))
  best(e.claims.P54).forEach((c) => {
    qid(c) && refs.add(qid(c))
    ;(c.qualifiers?.P118 ?? []).forEach((q) => q.datavalue && refs.add(q.datavalue.value.id))
  })
}
const labels = {}
const all = [...refs]
for (let i = 0; i < all.length; i += 40) {
  const batch = all.slice(i, i + 40)
  const d = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${batch.join('|')}&props=labels|claims&languages=en|fr&format=json`)
  for (const [id, ent] of Object.entries(d.entities)) {
    labels[id] = { en: ent.labels?.en?.value, fr: ent.labels?.fr?.value, p17: qid(best(ent.claims?.P17)[0]), p31: best(ent.claims?.P31).map(qid) }
  }
  await pause(250)
}
const lab = (id) => labels[id]?.en ?? labels[id]?.fr ?? id
// National-team entries: "instance of" a national (sports) team class, or the label says so.
const isNational = (id) => /national|olympic|olympics/i.test(lab(id)) || labels[id]?.p31?.some((x) => ['Q6979593', 'Q1194951', 'Q46190676'].includes(x))

// ---- 3. photos ----
await mkdir(new URL('public/athletes/', root), { recursive: true })
const exists = (u) => access(u).then(() => true, () => false)
const FREE = /^(CC0|CC BY|CC BY-SA|Public domain|PD|Attribution|Copyrighted free use)/i
const strip = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

async function commonsPhoto(slug, fileName) {
  const title = `File:${fileName}`
  const info = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=900&format=json`,
  )
  const page = Object.values(info.query.pages)[0]
  const ii = page?.imageinfo?.[0]
  const meta = ii?.extmetadata
  if (!ii || !meta) return null
  const license = meta.LicenseShortName?.value ?? ''
  if (!FREE.test(license)) return { skipped: `licence "${license}" is not clearly free` }
  const file = `public/athletes/${slug}.jpg`
  if (!(await exists(new URL(file, root)))) {
    const res = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return { skipped: `download ${res.status}` }
    await writeFile(new URL(file, root), Buffer.from(await res.arrayBuffer()))
  }
  return {
    path: `/athletes/${slug}.jpg`,
    credit: `${strip(meta.Artist?.value) || 'Wikimedia Commons'} · ${license}`,
    page: ii.descriptionurl,
  }
}

// ---- 4. assemble ----
const out = {}
for (const a of ids) {
  const e = entities[a.qid]
  const c = e.claims
  const birth = iso(val(best(c.P569)[0]))
  const death = iso(val(best(c.P570)[0]))
  const teams = best(c.P54).map((s) => {
    const id = qid(s)
    const q = s.qualifiers ?? {}
    const first = (p) => q[p]?.[0]?.datavalue?.value
    return {
      id,
      name: lab(id),
      national: isNational(id),
      from: iso(first('P580')),
      to: iso(first('P582')),
      caps: first('P1350')?.amount ? Number(first('P1350').amount) : undefined,
      goals: first('P1351')?.amount ? Number(first('P1351').amount) : undefined,
      league: q.P118?.[0]?.datavalue ? lab(q.P118[0].datavalue.value.id) : undefined,
    }
  })
  const sorted = [...teams].sort((x, y) => (x.from ?? '').localeCompare(y.from ?? ''))
  const clubs = sorted.filter((t) => !t.national)
  const nationalTeams = sorted.filter((t) => t.national)
  const current = clubs.filter((t) => !t.to).pop()
  const sitelinks = e.sitelinks ?? {}
  const wiki = (lang) => (sitelinks[`${lang}wiki`] ? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(sitelinks[`${lang}wiki`].title.replace(/ /g, '_'))}` : undefined)
  const imageName = val(best(c.P18)[0])
  let photo
  if (imageName) {
    try {
      photo = await commonsPhoto(a.slug, imageName)
      await pause(250)
    } catch (err) {
      photo = { skipped: err.message }
    }
  }
  out[a.slug] = {
    qid: a.qid,
    name: e.labels?.en?.value ?? e.labels?.fr?.value ?? a.slug,
    birth,
    death,
    gender: { Q6581072: 'male', Q6581097: 'female' }[qid(best(c.P21)[0])],
    birthPlace: best(c.P19).map(qid).filter(Boolean).map(lab)[0],
    citizenship: best(c.P27).map(qid).filter(Boolean).map(lab),
    sports: best(c.P641).map(qid).filter(Boolean).map(lab),
    positions: best(c.P413).map(qid).filter(Boolean).map(lab),
    heightCm: val(best(c.P2048)[0])?.amount ? Math.round(Number(val(best(c.P2048)[0]).amount) * (val(best(c.P2048)[0]).unit?.endsWith('Q174728') ? 1 : 100)) : undefined,
    clubs,
    nationalTeams,
    currentClub: current?.name,
    wikipedia: { en: wiki('en'), fr: wiki('fr') },
    commons: photo && !photo.skipped ? photo : undefined,
    photoNote: photo?.skipped,
  }
  console.log(`${a.slug}: ${out[a.slug].name} · ${out[a.slug].currentClub ?? '—'} · nt ${nationalTeams.map((t) => `${t.name} ${t.caps ?? '?'}/${t.goals ?? '?'}`).join(', ') || '—'} · photo ${photo?.path ?? photo?.skipped ?? 'none'}`)
}

await writeFile(
  new URL('src/data/athletes-snapshot.json', root),
  JSON.stringify({ fetchedAt: new Date().toISOString().slice(0, 10), source: 'https://www.wikidata.org/', athletes: out }, null, 1) + '\n',
)
console.log(`Saved ${Object.keys(out).length} athletes`)
