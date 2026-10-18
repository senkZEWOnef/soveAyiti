import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { presidentialCandidates } from '@/data/candidates'
import { athletes } from '@/data/athletes'
import { artists } from '@/data/artists'
import { publishedInterviews } from '@/data/interviews'
import { claims } from '@/data/claims'
import { sortedArticles } from '@/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/vote', '/kandida', '/konpare', '/gid-elekte', '/verifye', '/eksplike', '/kilti', '/kilti/atis',
    '/espo', '/espo/atlet', '/espo/sondaj', '/espo/grenadye', '/apwopo', '/abonnman', '/kontak',
  ]
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    // Only presidential profiles: the other ~2,400 registrations are thin pages not worth indexing yet.
    ...presidentialCandidates.map((c) => ({ url: `${site.url}/kandida/${c.slug}` })),
    ...athletes.map((a) => ({ url: `${site.url}/espo/atlet/${a.slug}` })),
    ...artists.map((a) => ({ url: `${site.url}/kilti/atis/${a.slug}` })),
    ...publishedInterviews().map((i) => ({ url: `${site.url}/kilti/entevyou/${i.slug}` })),
    ...claims.map((c) => ({ url: `${site.url}/verifye/${c.slug}` })),
    ...sortedArticles.map((a) => ({ url: `${site.url}/atik/${a.slug}` })),
  ]
}
