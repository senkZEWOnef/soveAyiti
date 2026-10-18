import type { SourceLink } from '@/types'

// "Current club" is shown ONLY when it is listed here with a source and the date it was checked. Wikidata's last club is
// often out of date (e.g. it still listed Wilson Isidor at Monaco), so it is never presented as the current club.
// To add or refresh one: set `team`, `asOf` (the day you checked) and a `source` (transfer report or club/league page).
// Left out on purpose because sources disagreed on 2026-10-18: Duckens Nazon (Al Nasr vs Esteghlal), Frantzdy Pierrot
// (AEK Athens vs Rizespor vs Maccabi Haifa), Estevan Florial, Junior Colson (2026 roster status unconfirmed).
export const currentTeamOverrides: Record<string, { team: string; asOf: string; source: SourceLink }> = {
  'bennedict-mathurin': {
    team: 'New Orleans Pelicans',
    asOf: '2026-10-18',
    source: { label: 'TSN — Mathurin signs two-year, $16M deal with Pelicans (Aug 2026)', url: 'https://www.tsn.ca/nba/article/report-montreals-mathurin-joins-pels-on-two-year-16m-deal/' },
  },
  'wilson-isidor': {
    team: 'Sunderland',
    asOf: '2026-10-18',
    source: { label: 'Wikipedia — Wilson Isidor', url: 'https://en.wikipedia.org/wiki/Wilson_Isidor' },
  },
}
