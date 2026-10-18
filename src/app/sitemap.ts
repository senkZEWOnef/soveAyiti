import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { presidentialCandidates } from '@/data/candidates'
import { sortedArticles } from '@/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/vote', '/kandida', '/eksplike', '/kilti', '/espo', '/apwopo', '/abonnman', '/kontak']
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    // Only presidential profiles: the other ~2,400 registrations are thin pages not worth indexing yet.
    ...presidentialCandidates.map((c) => ({ url: `${site.url}/kandida/${c.slug}` })),
    ...sortedArticles.map((a) => ({ url: `${site.url}/atik/${a.slug}` })),
  ]
}
