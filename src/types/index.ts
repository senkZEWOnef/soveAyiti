export type CandidacyStatus = 'registered' | 'announced' | 'filed' | 'approved'

export interface SourceLink {
  label: string
  url: string
}

export interface Candidate {
  slug: string
  name: string
  office: string
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
