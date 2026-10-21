import type { Lang } from '@/i18n/config'

// Quotes are plain data: add an object to `quotes` and it appears in the home carousel and on the candidate's profile.
// Rules: keep `quote` and `coverage` in the ORIGINAL language of the article (set `language` to match), keep excerpts short,
// and always credit the article. Every field of `source` is required, so a quote without its author cannot be added.
export interface CandidateQuote {
  /** unique, kebab-case, e.g. 'gary-bodeau-2026-10-12-securite' */
  id: string
  /** slug of the candidate in src/data/candidates.ts */
  candidateSlug: string
  /** the candidate's words, exactly as printed in the article (without surrounding quote marks) */
  quote: string
  /** optional short passage from the article that frames the quote, also verbatim */
  coverage?: string
  /** language of `quote` and `coverage` (the article's original language) */
  language: Lang
  /** ISO date the article was published */
  date: string
  source: {
    author: string
    outlet: string
    title: string
    url: string
  }
}

export const quotes: CandidateQuote[] = [
  {
    id: 'munir-joseph-mourra-2026-10-19-gestionnaire',
    candidateSlug: 'munir-joseph-mourra',
    quote: 'Haïti n’a pas besoin d’un politicien mais d’un gestionnaire',
    language: 'fr',
    date: '2026-10-19',
    source: {
      author: 'Jean Junior Celestin',
      outlet: 'Le Nouvelliste',
      title: '« Haïti n’a pas besoin d’un politicien mais d’un gestionnaire », selon le candidat à la présidence Munir Joseph Mourra',
      url: 'https://lenouvelliste.com/article/273098/haiti-na-pas-besoin-dun-politicien-mais-dun-gestionnaire-selon-le-candidat-a-la-presidence-munir-joseph-mourra',
    },
  },
]

export const sortedQuotes = [...quotes].sort((a, b) => b.date.localeCompare(a.date))
export const quotesFor = (slug: string) => sortedQuotes.filter((q) => q.candidateSlug === slug)
