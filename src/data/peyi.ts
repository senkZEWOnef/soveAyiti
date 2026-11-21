import { candidates, departments as candidateDepartments } from './candidates'
import type { Candidate, OfficeKey, SourceLink } from '@/types'

// "Peyi a": the 10 departments, their communes, and the local sites/issues we put to candidates.
//
// Administrative frame (Haiti): 10 departments → arrondissements → communes (municipalities, led by a mayor and two
// deputy-mayors, elected as a team of three) → sections communales. Deputies are elected by circonscription (named
// after communes in the CEP data), senators by department, the president nationally. Communes below are NOT typed by
// hand: they come from the CEP mayoral registrations, so they match the candidate lists exactly.
//
// Editorial text below is a first draft (Creole). TODO(sources): add a citation for every highlight before launch.

export interface Department {
  slug: string
  /** department name exactly as in candidates.ts (title-cased CEP value) */
  key: string
  /** Creole display name */
  name: string
  capital: string
  summary: string
  highlights: { title: string; text: string }[]
}

export const departmentList: Department[] = [
  {
    slug: 'nord', key: 'Nord', name: 'Nò', capital: 'Kap-Ayisyen',
    summary: 'Bèso istwa revolisyon an: Sitadèl, Sans-Souci, Kap-Ayisyen ak zòn bò lanmè yo.',
    highlights: [
      { title: 'Patrimwàn istorik', text: 'Sitadèl Laferrière, Palè Sans-Souci ak bilding Ramiers yo (Milot), sit Patrimwàn Mondyal UNESCO.' },
      { title: 'Vil ak pò', text: 'Kap-Ayisyen, gwo vil nan nò a, ak pò li a.' },
      { title: 'Touris bò lanmè', text: 'Plaj ak zòn kotyè nan nò a, tankou Labadi.' },
    ],
  },
  {
    slug: 'nord-est', key: 'Nord-Est', name: 'Nòdès', capital: 'Fòlibète',
    summary: 'Fwontyè ak Repiblik Dominikèn, kòmès ak lakou endistriyèl.',
    highlights: [
      { title: 'Fwontyè', text: 'Wanament (Ouanaminthe) se youn nan pwen pasaj prensipal ak Repiblik Dominikèn.' },
      { title: 'Endistri', text: 'Pak endistriyèl Karakòl la.' },
      { title: 'Baie Fòlibète', text: 'Kapital depatman an chita bò yon gwo baie.' },
    ],
  },
  {
    slug: 'nord-ouest', key: 'Nord-Ouest', name: 'Nòdwès', capital: 'Pòdepè',
    summary: 'Pwent nòdwès peyi a: Mòl Sen Nikola, Latòti, ak agrikilti.',
    highlights: [
      { title: 'Istwa', text: 'Mòl Sen Nikola, kote Kristòf Kolomb te debake an 1492 dapre tradisyon istorik la.' },
      { title: 'Zile', text: 'Latòti (Île de la Tortue) bò kòt nò a.' },
      { title: 'Pò', text: 'Pòdepè, pò prensipal depatman an.' },
    ],
  },
  {
    slug: 'artibonite', key: 'Artibonite', name: 'Latibonit', capital: 'Gonayiv',
    summary: 'Gwo plenn diri a ak vil endepandans lan.',
    highlights: [
      { title: 'Endepandans', text: 'Gonayiv, kote yo pwoklame endepandans Ayiti 1ye janvye 1804.' },
      { title: 'Agrikilti', text: 'Vale larivyè Latibonit la, zòn diri prensipal peyi a.' },
      { title: 'Pò', text: 'Sen Mak, vil pò enpòtan.' },
    ],
  },
  {
    slug: 'centre', key: 'Centre', name: 'Sant', capital: 'Ench',
    summary: 'Platoyo santral la, elvaj, ak lak Peligre.',
    highlights: [
      { title: 'Enèji ak dlo', text: 'Baraj ak lak Peligre, sou rivyè Latibonit.' },
      { title: 'Pèlerinaj', text: 'Soudo (Saut-d’Eau), yon gwo kote pèlerinaj ak touris.' },
      { title: 'Elvaj', text: 'Plato Santral la konnen pou elvaj.' },
    ],
  },
  {
    slug: 'ouest', key: 'Ouest', name: 'Lwès', capital: 'Pòtoprens',
    summary: 'Kapital peyi a, pi gwo pò ak mache, ak anpil entèdepandans.',
    highlights: [
      { title: 'Kapital', text: 'Pòtoprens ak katye li yo, sant gouvènman an ak lekòl siperyè yo.' },
      { title: 'Zile ak nati', text: 'Lagonav, lak Azwèi (Étang Saumâtre) ak mòn Kenscòf.' },
      { title: 'Pò ak kòmès', text: 'Pò Pòtoprens, pwen antre machandiz prensipal.' },
    ],
  },
  {
    slug: 'sud-est', key: 'Sud-Est', name: 'Sidès', capital: 'Jakmèl',
    summary: 'Vil atizan ak kanaval, kaskad ak plaj.',
    highlights: [
      { title: 'Kilti', text: 'Jakmèl, vil atizan ak kanaval li a.' },
      { title: 'Nati', text: 'Basen Ble (Bassin-Bleu), kaskad ak basen natirèl.' },
      { title: 'Kòt', text: 'Plaj sou kòt sid la.' },
    ],
  },
  {
    slug: 'sud', key: 'Sud', name: 'Sid', capital: 'Okay',
    summary: 'Lavi nan peyi a, plaj ak zile.',
    highlights: [
      { title: 'Touris', text: 'Pòsali, Zile a Vach ak plaj bò kòt la.' },
      { title: 'Vil', text: 'Okay, gwo vil nan sid la.' },
      { title: 'Agrikilti', text: 'Plenn ak mòn ki bay pwodwi agrikòl.' },
    ],
  },
  {
    slug: 'grandans', key: "Grand'Anse", name: 'Grandans', capital: 'Jérémi',
    summary: 'Vil powèt yo ak mòn Lawòt.',
    highlights: [
      { title: 'Kilti', text: 'Jérémi, ke yo rele « vil powèt yo ».' },
      { title: 'Nati', text: 'Mòn Lawòt (Massif de la Hotte) ak anpil espès plant ak bèt ki ra.' },
      { title: 'Agrikilti', text: 'Kakawo, pen-bwa ak lòt pwodwi.' },
    ],
  },
  {
    slug: 'nippes', key: 'Nippes', name: 'Nip', capital: 'Miragwàn',
    summary: 'Pi jèn depatman an, ak lak Miragwàn.',
    highlights: [
      { title: 'Nouvo depatman', text: 'Kreye an 2003, kapital li se Miragwàn.' },
      { title: 'Nati', text: 'Lak Miragwàn (Étang de Miragoâne).' },
      { title: 'Kòt', text: 'Kote bò lanmè ak vil tankou Anse-à-Veau ak Petit-Trou-de-Nippes.' },
    ],
  },
]

export const departmentBySlug = (slug: string) => departmentList.find((d) => d.slug === slug)
export const departmentByKey = (key: string) => departmentList.find((d) => d.key === key)

// Sanity: every CEP department must have an entry here (fails the build loudly if the CEP renames one).
for (const key of candidateDepartments) {
  if (!departmentByKey(key)) throw new Error(`peyi.ts: no department entry for CEP department "${key}"`)
}

// ---- Communes (from mayoral registrations) ----

export interface Commune {
  dept: string
  name: string
  /** mayoral candidates (team leaders only) */
  mayors: number
}

export const communes: Commune[] = (() => {
  const map = new Map<string, Commune>()
  for (const c of candidates) {
    if (c.officeKey !== 'mayor' || !c.department || !c.locality) continue
    const k = `${c.department}/${c.locality}`
    const row = map.get(k) ?? { dept: c.department, name: c.locality, mayors: 0 }
    if (!c.position) row.mayors++
    map.set(k, row)
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
})()

export const communesOf = (deptKey: string) => communes.filter((c) => c.dept === deptKey)

// ---- Sites & issues with candidate challenges ----

export type ReplyStatus = 'notSent' | 'sent' | 'answered' | 'declined'

export interface Challenge {
  level: OfficeKey
  question: string
}

export interface Reply {
  status: ReplyStatus
  sentOn?: string
  /** verbatim answer, quoted in full or linked; never summarized by us */
  text?: string
  date?: string
  source?: SourceLink
}

export interface Site {
  slug: string
  dept: string
  /** commune as in candidates.ts (title-cased CEP value) */
  commune: string
  name: string
  kind: string
  summary: string
  facts: string[]
  /** what we have not documented yet. Shown as such, never as "nothing". */
  todo: string[]
  sources: SourceLink[]
  challenges: Challenge[]
  /** keyed by candidate slug; a missing key means status 'notSent' */
  replies: Record<string, Reply>
  lastReviewed: string
}

export const sites: Site[] = [
  {
    slug: 'sitadel',
    dept: 'nord',
    commune: 'Milot',
    name: 'Sitadèl Laferrière',
    kind: 'Patrimwàn istorik',
    summary:
      'Gwo fò mòn ki sou tèt yon mòn nan Milot, bati nan kòmansman 19yèm syèk la anba lòd Henri Christophe, apre endepandans lan. Li fè pati Pak Nasyonal Istorik la ak Palè Sans-Souci ak bilding Ramiers yo.',
    facts: [
      'Sit Patrimwàn Mondyal UNESCO depi 1982, ansanm ak Palè Sans-Souci ak bilding Ramiers yo.',
      'Li chita nan komin Milot, depatman Nò.',
    ],
    todo: [
      'Eta konsèvasyon aktyèl sit la (rapò ofisyèl).',
      'Ki enstitisyon ki jere sit la ak ki bidjè li genyen (ISPAN, Minis Kilti, lòt).',
      'Kantite vizitè ak ki jan revni yo benefisye Milot.',
      'Aksè pa wout, sekirite vizitè yo, ak sèvis lokal yo (gid, atizan, lojman).',
    ],
    sources: [
      { label: 'UNESCO — National History Park: Citadel, Sans Souci, Ramiers', url: 'https://whc.unesco.org/en/list/180' },
    ],
    challenges: [
      {
        level: 'mayor',
        question:
          'Ki plan ou genyen pou Sitadèl la ak pou vil Milot: aksè, gid ak atizan lokal yo, pwòpte, sekirite vizitè yo, epi ki jan lavil la ka benefisye revni touris la?',
      },
      {
        level: 'deputy',
        question:
          'Ki lwa, ki kontwòl bidjè oswa ki aksyon ou ap pouse nan Palman an pou pwoteje ak antretni Sitadèl la, epi pou revni sit la rive jwenn kominote a?',
      },
      {
        level: 'senator',
        question:
          'Ki aksyon lejislatif ou genyen pou patrimwàn depatman an (Sitadèl, Sans-Souci, Ramiers), epi ki jan w ap suiv lajan leta ki ale ladan l?',
      },
      {
        level: 'president',
        question:
          'Si w eli, ki politik nasyonal ou genyen pou patrimwàn istorik la ak touris kiltirèl: ki enstitisyon w ap chaje, ak ki bidjè?',
      },
    ],
    replies: {},
    lastReviewed: '2026-11-07',
  },
]

export const sitesOf = (deptSlug: string) => sites.filter((s) => s.dept === deptSlug)
export const siteBySlug = (dept: string, slug: string) => sites.find((s) => s.dept === dept && s.slug === slug)

/** Candidates who must answer a challenge, by office level. Mayors: team leaders only (adjoints run on the same ticket). */
export function candidatesFor(site: Site, level: OfficeKey): Candidate[] {
  const dept = departmentBySlug(site.dept)!
  return candidates.filter((c) => {
    if (c.officeKey !== level) return false
    if (level === 'president') return true
    if (c.department !== dept.key) return false
    if (level === 'senator') return true
    if (level === 'mayor') return c.locality === site.commune && !c.position
    // deputies: circonscriptions are named after one or more communes, e.g. "Plaine-Du-Nord/Milot"
    return (c.locality ?? '').split('/').includes(site.commune)
  })
}

export const replyFor = (site: Site, slug: string): Reply => site.replies[slug] ?? { status: 'notSent' }
