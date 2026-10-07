export type CandidacyStatus = 'registered' | 'announced' | 'filed' | 'approved'

export interface SourceLink {
  label: string
  url: string
}

/**
 * Public-record rubric entry. Kept apart from the biography: it holds documented actions and reports by named
 * institutions about a candidate, never SoveAyiti's own claims. Rules: docs/dosye-piblik-rubrik.md
 */
export type PublicRecordKind = 'official-action' | 'court-decision' | 'institutional-report'

export interface PublicRecordEntry {
  kind: PublicRecordKind
  /** institution that issued the document, e.g. "Ministère de la Justice", "ONU (BINUH/HCDH)" */
  issuer: string
  /** date of the document itself */
  date: string
  /** neutral, attributed wording: "Le rapport X affirme que…", never "il a fait…" */
  summary: string
  /** must point to the original document or a reputable report of it */
  source: SourceLink
  /** candidate's own response, attributed. Always offer one before publishing. */
  response?: { text: string; date: string; source?: SourceLink }
  responseStatus: 'notRequested' | 'requested' | 'received' | 'declined'
  /** only 'published' entries can appear, and only when site.showPublicRecord is true */
  reviewStatus: 'draft' | 'published'
  /** what the entry does NOT establish, e.g. "Pa gen kondanasyon jidisyè" */
  limits?: string
}

export type OfficeKey = 'president' | 'senator' | 'deputy' | 'mayor'

export interface Candidate {
  slug: string
  name: string
  /** display label (Creole) */
  office: string
  officeKey: OfficeKey
  /** department as listed by the CEP; undefined for the national presidential race */
  department?: string
  /** circonscription (deputies) or commune (mayors) */
  locality?: string
  /** CEP position: Titulaire, 1er Adjoint, 2ème Adjoint */
  position?: string
  /** political structure exactly as supplied in the registration data */
  affiliation?: string
  status: CandidacyStatus
  statusDate: string
  statusSource: SourceLink
  education: string[]
  career: string[]
  positions: { office: string; dates: string; role: string }[]
  /** null = individual voting record could not be located */
  votes: { date: string; measure: string; vote: string; source: SourceLink }[] | null
  proposals: { statement: string; source: SourceLink }[]
  questionnaire?: { question: string; answer: string }[]
  sources: SourceLink[]
  lastReviewed: string
  corrections: { date: string; note: string }[]
  /** path under /public (e.g. /candidates/name.jpg). Only use photos you have permission to publish. */
  photo?: string
  /** one-line summary shown on the homepage carousel */
  blurb?: string
  photoCredit?: string
  pledges?: { topic: string; pledge: string; timeline?: string; source: SourceLink; date: string }[]
  program?: { title: string; publishedOn: string; url: string; summary?: string }
  questionnaireStatus?: 'notSent' | 'sent' | 'received'
  interviews?: { title: string; date: string; url: string }[]
  officialLinks?: SourceLink[]
  publicRecord?: PublicRecordEntry[]
}

export type Category = 'election' | 'explainer' | 'records' | 'culture' | 'sports'

export interface Article {
  slug: string
  title: string
  titleFr?: string
  category: Category
  date: string
  author: string
  excerpt: string
  body: string[]
  sources?: SourceLink[]
}
