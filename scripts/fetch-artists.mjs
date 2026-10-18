// Snapshots public facts about the artists/groups listed in src/data/artist-ids.json from Wikidata (CC0) into
// src/data/artists-snapshot.json, and downloads each one's Wikimedia Commons photo (only if it carries a free licence)
// into public/artists/ together with the credit that licence requires. Same approach as scripts/fetch-athletes.mjs.
// Re-run any time: `node scripts/fetch-artists.mjs`. Add an artist by adding their Wikidata ID to artist-ids.json.
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

const ids = JSON.parse(await readFile(new URL('src/data/artist-ids.json', root), 'utf8'))

const entities = {}
for (const a of ids) {
  const data = await getJson(`https://www.wikidata.org/wiki/Special:EntityData/${a.qid}.json`)
  entities[a.qid] = data.entities[a.qid]
  await pause(250)
}

const val = (c) => c?.mainsnak?.datavalue?.value
const best = (claims) => (claims ?? []).filter((c) => c.rank !== 'deprecated').sort((x, y) => (y.rank === 'preferred') - (x.rank === 'preferred'))
const qid = (c) => val(c)?.id
const ids_ = (claims) => best(claims).map(qid).filter(Boolean)
const iso = (t) => {
  if (!t) return undefined
  const m = String(t.time).match(/^\+(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return undefined
  if (t.precision >= 11 && m[2] !== '00' && m[3] !== '00') return `${m[1]}-${m[2]}-${m[3]}`
  if (t.precision === 10 && m[2] !== '00') return `${m[1]}-${m[2]}`
  return m[1]
}

const refs = new Set()
for (const e of Object.values(entities)) {
  for (const p of ['P19', 'P27', 'P31', 'P106', 'P136', 'P412', 'P1303', 'P463', 'P495', 'P17', 'P740', 'P527', 'P20']) ids_(e.claims[p]).forEach((x) => refs.add(x))
}
const labels = {}
const all = [...refs]
for (let i = 0; i < all.length; i += 40) {
  const batch = all.slice(i, i + 40)
  const d = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${batch.join('|')}&props=labels&languages=en|fr|mul&format=json`)
  for (const [id, ent] of Object.entries(d.entities)) labels[id] = { en: ent.labels?.en?.value ?? ent.labels?.mul?.value, fr: ent.labels?.fr?.value }
  await pause(250)
}
const lab = (id) => labels[id]?.en ?? labels[id]?.fr ?? id

await mkdir(new URL('public/artists/', root), { recursive: true })
const exists = (u) => access(u).then(() => true, () => false)
const FREE = /^(CC0|CC BY|CC BY-SA|Public domain|PD|Attribution|Copyrighted free use)/i
const strip = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

async function commonsPhoto(slug, fileName) {
  const info = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + fileName)}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=900&format=json`,
  )
  const ii = Object.values(info.query.pages)[0]?.imageinfo?.[0]
  const meta = ii?.extmetadata
  if (!ii || !meta) return null
  const license = meta.LicenseShortName?.value ?? ''
  if (!FREE.test(license)) return { skipped: `licence "${license}" is not clearly free` }
  const file = `public/artists/${slug}.jpg`
  if (!(await exists(new URL(file, root)))) {
    const res = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return { skipped: `download ${res.status}` }
    await writeFile(new URL(file, root), Buffer.from(await res.arrayBuffer()))
  }
  return { path: `/artists/${slug}.jpg`, credit: `${strip(meta.Artist?.value) || 'Wikimedia Commons'} · ${license}`, page: ii.descriptionurl }
}

const out = {}
for (const a of ids) {
  const e = entities[a.qid]
  const c = e.claims
  const types = ids_(c.P31).map(lab)
  const isGroup = types.some((t) => /band|group|duo|ensemble|orchestra/i.test(t)) || !ids_(c.P31).includes('Q5')
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
  const sitelinks = e.sitelinks ?? {}
  const wiki = (lang) => (sitelinks[`${lang}wiki`] ? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(sitelinks[`${lang}wiki`].title.replace(/ /g, '_'))}` : undefined)
  out[a.slug] = {
    qid: a.qid,
    name: e.labels?.en?.value ?? e.labels?.mul?.value ?? e.labels?.fr?.value ?? a.slug,
    kind: isGroup ? 'group' : 'person',
    types,
    description: { en: e.descriptions?.en?.value, fr: e.descriptions?.fr?.value },
    birth: iso(val(best(c.P569)[0])) ?? iso(val(best(c.P571)[0])),
    birthIsFormation: !c.P569 && Boolean(c.P571),
    death: iso(val(best(c.P570)[0])) ?? iso(val(best(c.P576)[0])),
    gender: { Q6581072: 'male', Q6581097: 'female' }[qid(best(c.P21)[0])],
    birthPlace: ids_(c.P19).map(lab)[0] ?? ids_(c.P740).map(lab)[0],
    citizenship: ids_(c.P27).map(lab),
    countryOfOrigin: ids_(c.P495).concat(ids_(c.P17)).map(lab),
    occupations: ids_(c.P106).map(lab),
    genres: ids_(c.P136).map(lab),
    instruments: ids_(c.P1303).map(lab),
    voiceType: ids_(c.P412).map(lab),
    memberOf: ids_(c.P463).map(lab),
    members: ids_(c.P527).map(lab),
    pseudonyms: (c.P742 ?? []).map((x) => val(x)).filter((v) => typeof v === 'string'),
    website: val(best(c.P856)[0]),
    wikipedia: { en: wiki('en'), fr: wiki('fr'), ht: wiki('ht') },
    commons: photo && !photo.skipped ? photo : undefined,
    photoNote: photo?.skipped,
  }
  const o = out[a.slug]
  const haitian = o.citizenship.concat(o.countryOfOrigin).includes('Haiti') || /haiti/i.test(`${o.description.en ?? ''} ${o.description.fr ?? ''} ${o.birthPlace ?? ''}`)
  if (!haitian) console.warn(`!! ${a.slug}: no Haitian connection found in Wikidata. Review before publishing.`)
  console.log(`${a.slug}: ${o.name} [${o.kind}] ${o.types.join('/')} | ${o.birth ?? '—'} ${o.birthPlace ?? ''} | cit ${o.citizenship.join(',') || '—'} orig ${o.countryOfOrigin.join(',') || '—'} | genres ${o.genres.join(', ') || '—'} | occ ${o.occupations.join(', ') || '—'} | photo ${photo?.path ?? photo?.skipped ?? 'none'}`)
}

await writeFile(
  new URL('src/data/artists-snapshot.json', root),
  JSON.stringify({ fetchedAt: new Date().toISOString().slice(0, 10), source: 'https://www.wikidata.org/', artists: out }, null, 1) + '\n',
)
console.log(`Saved ${Object.keys(out).length} artists`)
