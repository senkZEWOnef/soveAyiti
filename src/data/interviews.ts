import type { Lang } from '@/i18n/config'
import type { SourceLink } from '@/types'

// Interviews are plain data: add an object to `interviews` and the page /kilti/entevyou/<slug> exists. Rules (also shown to
// readers on /kilti): same questions for every artist, answers published as given, the artist can ask for corrections.
// An interview is shown ONLY when `consent` is true.
export interface Interview {
  slug: string
  /** slug of the artist in src/data/artists.ts, when they have a profile */
  artistSlug?: string
  /** ISO date of publication */
  date: string
  title: Record<Lang, string>
  intro: Record<Lang, string>
  /** language the questions and answers were recorded in */
  language: Lang
  qa: { q: string; a: string }[]
  /** who conducted/transcribed it (a name or "Redaksyon SoveAyiti") */
  recordedBy: string
  /** the interviewee agreed to publication */
  consent: boolean
  sourceLinks: SourceLink[]
}

export const interviews: Interview[] = []

export const publishedInterviews = () => interviews.filter((i) => i.consent).sort((a, b) => b.date.localeCompare(a.date))
export const interviewBySlug = (slug: string) => publishedInterviews().find((i) => i.slug === slug)
