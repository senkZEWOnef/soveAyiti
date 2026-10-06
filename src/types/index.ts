export type CandidacyStatus = 'announced' | 'filed' | 'approved'

export interface SourceLink {
  label: string
  url: string
}

export interface Candidate {
  slug: string
  name: string
  office: string
  party?: string
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
  /** true while the profile contains template text only */
  isSample?: boolean
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
