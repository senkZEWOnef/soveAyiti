import type { SourceLink } from '@/types'
import { CEP_SOURCE } from './candidates'

// "Vre oswa fo?" fact-checks. Rules: every verdict needs at least one source that supports it; say what the claim
// is WITHOUT naming or shaming whoever shared it; use "unverified" when sources do not settle it. Newest first.
// To add one: copy an entry, change slug/date/texts/verdict/sources. Texts are Creole (source), French, English.
export type Verdict = 'true' | 'false' | 'misleading' | 'unverified'
type L3 = { ht: string; fr: string; en: string }

export interface Claim {
  slug: string
  /** day the check was made (YYYY-MM-DD) */
  date: string
  claim: L3
  verdict: Verdict
  finding: L3
  sources: SourceLink[]
}

export const claims: Claim[] = [
  {
    slug: 'lis-cep-se-lis-final',
    date: '2026-10-18',
    claim: {
      ht: '« Moun ki sou lis kandida CEP a se kandida ofisyèl ki apwouve. »',
      fr: '« Les personnes sur la liste des candidats du CEP sont des candidats officiels approuvés. »',
      en: '“The people on the CEP candidate list are official, approved candidates.”',
    },
    verdict: 'misleading',
    finding: {
      ht: 'Chif CEP a pibliye yo se enskripsyon prelimine sou entènèt. CEP la di lis ofisyèl la rive sèlman apre li fin verifye ak valide dosye yo. Se konsa, yon moun ki sou lis la se yon moun ki enskri, pa otomatikman yon kandida apwouve. Sa se rezon poukisa SoveAyiti make chak pwofil « enskripsyon prelimine · tann verifikasyon CEP ».',
      fr: 'Les chiffres publiés par le CEP sont des inscriptions préliminaires en ligne. Le CEP indique que la liste officielle n’arrive qu’après vérification et validation des dossiers. Une personne sur la liste est donc une personne inscrite, pas automatiquement un candidat approuvé. C’est pourquoi SoveAyiti marque chaque profil « inscription préliminaire · en attente de vérification par le CEP ».',
      en: 'The figures the CEP publishes are preliminary online registrations. The CEP says the official list comes only after it has verified and validated the files. So a person on the list is a registered person, not automatically an approved candidate. That is why SoveAyiti labels every profile “preliminary registration · awaiting CEP verification”.',
    },
    sources: [CEP_SOURCE],
  },
]

export const claimBySlug = (slug: string) => claims.find((c) => c.slug === slug)
