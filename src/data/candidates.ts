import type { Candidate, CandidacyStatus } from '@/types'

// Source for the registration status below. CEP states these are PRELIMINARY online registration
// figures; the official list comes only after CEP verification and validation.
export const CEP_SOURCE = {
  label: 'CEP — Statistiques enregistrement des candidats',
  url: 'https://cephaiti.ht/statistiques-enregistrement-des-candidats/',
}
export const REGISTRATION_SNAPSHOT = '2026-10-06'

// Names and structures are copied as supplied; spelling still to be checked against the CEP table.
const presidentialRegistrations: [slug: string, name: string, affiliation: string][] = [
  ['gary-bodeau', 'Gary Bodeau', 'P.R'],
  ['deus-deronneth', 'Deus Deronneth', 'DVNH'],
  ['gandhy-dorfeuille', 'Gandhy Dorfeuille', 'ANF'],
  ['moise-durocher', 'Moise Durocher', 'SOL AYITI'],
  ['ricardo-jean-pierre', 'Ricardo Jean-Pierre', 'PANAH'],
  ['wilson-jeudy', 'Wilson Jeudy', 'VAR'],
  ['claude-joseph', 'Claude Joseph', 'EDE'],
  ['maxo-joseph', 'Maxo Joseph', 'RCH'],
  ['wilner-joseph', 'Wilner Joseph', 'VIKTWA'],
  ['munir-joseph-mourra', 'Munir Joseph Mourra', 'MPH'],
  ['jean-ernest-muscadin', 'Jean Ernest Muscadin', 'FCN'],
  ['jocelerme-privert', 'Jocelerme Privert', 'AYITI TRANSFOME'],
]

// To fill in a profile later, add fields to its entry in `details` below (education, career,
// positions, votes, pledges, program, interviews, officialLinks, photo, photoCredit…).
// Missing data is displayed as "not yet documented", never as "none".
const details: Record<string, Partial<Candidate>> = {
  // 'gary-bodeau': { photo: '/candidates/gary-bodeau.jpg', photoCredit: 'Foto: …', education: ['…'] },
}

export const candidates: Candidate[] = presidentialRegistrations.map(([slug, name, affiliation]) => ({
  slug,
  name,
  office: 'Prezidan',
  affiliation,
  status: 'registered' as CandidacyStatus,
  statusDate: REGISTRATION_SNAPSHOT,
  statusSource: CEP_SOURCE,
  blurb: `Enskripsyon prelimine pou prezidans, estrikti politik: ${affiliation}. Apwobasyon final la ap tann verifikasyon CEP.`,
  education: [],
  career: [],
  positions: [],
  votes: null,
  proposals: [],
  sources: [CEP_SOURCE],
  lastReviewed: REGISTRATION_SNAPSHOT,
  corrections: [],
  questionnaireStatus: 'notSent' as const,
  ...details[slug],
}))

export const statusLabels = {
  registered: { ht: 'Enskripsyon prelimine · tann verifikasyon CEP', fr: 'Inscription préliminaire — en attente de vérification et validation par le CEP', tone: 'bg-cream-200 text-navy-800' },
  announced: { ht: 'Anonse kandidati', fr: 'Candidature annoncée', tone: 'bg-cream-200 text-navy-800' },
  filed: { ht: 'Depoze dosye', fr: 'Dossier déposé', tone: 'bg-navy-100 text-navy-800' },
  approved: { ht: 'Kandidati apwouve ofisyèlman', fr: 'Candidature officiellement approuvée', tone: 'bg-flag-500 text-white' },
} as const

export const pledgeTopics = [
  'Sekirite ak jistis',
  'Ekonomi ak travay',
  'Edikasyon',
  'Sante',
  'Enfrastrikti ak enèji',
  'Agrikilti ak anviwònman',
  'Gouvènans ak sèvis piblik',
]
