import type { Candidate } from '@/types'

// IMPORTANT: the entries below are TEMPLATE profiles with fictional names, so the
// design can be reviewed. Replace them with real, sourced profiles and delete `isSample`.
// Never publish a claim without a source link; when a vote record is missing use `votes: null`.
export const candidates: Candidate[] = [
  {
    slug: 'modèl-a',
    name: 'Kandida Egzanp A',
    office: 'Sena',
    status: 'announced',
    statusDate: '2026-10-01',
    statusSource: { label: 'Sous la ap ale la', url: '#' },
    education: ['Fòmasyon: ranpli ak dokiman verifye sèlman'],
    career: ['Karyè: ranpli ak dokiman verifye sèlman'],
    positions: [{ office: 'Pòs egzanp', dates: '0000–0000', role: 'Rezon ak responsablite pòs la' }],
    votes: null,
    proposals: [{ statement: 'Pwopozisyon atribiye kandida a, ak lyen ak dokiman orijinal la.', source: { label: 'Sous orijinal', url: '#' } }],
    sources: [{ label: 'Dokiman sipò', url: '#' }],
    lastReviewed: '2026-10-06',
    corrections: [],
    isSample: true,
  },
  {
    slug: 'modèl-b',
    name: 'Kandida Egzanp B',
    office: 'Depite',
    status: 'filed',
    statusDate: '2026-10-02',
    statusSource: { label: 'Sous la ap ale la', url: '#' },
    education: ['Fòmasyon: ranpli ak dokiman verifye sèlman'],
    career: ['Karyè: ranpli ak dokiman verifye sèlman'],
    positions: [],
    votes: [
      {
        date: '0000-00-00',
        measure: 'Non pwojè lwa a',
        vote: 'Pou / Kont / Abstansyon',
        source: { label: 'Dokiman vòt la', url: '#' },
      },
    ],
    proposals: [],
    sources: [],
    lastReviewed: '2026-10-06',
    corrections: [],
    isSample: true,
  },
  {
    slug: 'modèl-c',
    name: 'Kandida Egzanp C',
    office: 'Prezidan',
    status: 'approved',
    statusDate: '2026-10-03',
    statusSource: { label: 'Sous la ap ale la', url: '#' },
    education: [],
    career: [],
    positions: [],
    votes: null,
    proposals: [],
    sources: [],
    lastReviewed: '2026-10-06',
    corrections: [],
    isSample: true,
  },
]

export const statusLabels = {
  announced: { ht: 'Anonse kandidati', fr: 'Candidature annoncée', tone: 'bg-cream-200 text-navy-800' },
  filed: { ht: 'Depoze dosye', fr: 'Dossier déposé', tone: 'bg-navy-100 text-navy-800' },
  approved: { ht: 'Kandidati apwouve ofisyèlman', fr: 'Candidature officiellement approuvée', tone: 'bg-flag-500 text-white' },
} as const
