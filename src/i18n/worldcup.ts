import 'server-only'
import { getLang } from './server'

// Haiti at the 2026 FIFA World Cup. Creole is the source text; fr/en mirror it.
// Every figure below was read from the sources listed in WC_SOURCES on WC_AS_OF. Where sources differ it says so.
export const WC_AS_OF = '2026-10-18'

export const WC_SOURCES = {
  groupC: { label: 'Wikipedia — 2026 FIFA World Cup Group C (matches, scorers, standings, line-ups)', url: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_Group_C' },
  concacaf: { label: 'Concacaf — FIFA World Cup 2026 team profile: Haiti', url: 'https://www.concacaf.com/news/fifa-world-cup-2026-team-profile-haiti' },
  concacafNic: { label: 'Concacaf — Haiti ends 51-year World Cup drought with victory against Nicaragua', url: 'https://www.concacaf.com/en/world-cup-qualifying-men/news/haiti-ends-51-year-world-cup-drought-with-victory-against-nicaragua' },
  wlrn: { label: 'WLRN — Curaçao and Haiti qualify for the World Cup (19 Nov 2025)', url: 'https://www.wlrn.org/americas/2025-11-19/curacao-haiti-world-cup' },
  bein: { label: 'beIN SPORTS — Haiti’s official squad announced for the 2026 FIFA World Cup', url: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/haiti-s-official-squad-announced-for-the-2026-fifa-world-cup-2026-05-15?an=He' },
} as const

export type TeamCode = 'HAI' | 'BRA' | 'MAR' | 'SCO'
export type Pos = 'GK' | 'DF' | 'MF' | 'FW'

export interface WcMatch {
  n: number
  date: string
  venue: string
  city: string
  home: TeamCode
  away: TeamCode
  homeGoals: number
  awayGoals: number
  /** Haiti's perspective */
  scorers: { player: string; team: TeamCode; minute: string; note?: 'og' }[]
}

export const wcMatches: WcMatch[] = [
  {
    n: 1, date: '2026-06-13', venue: 'Gillette Stadium', city: 'Foxborough', home: 'HAI', away: 'SCO', homeGoals: 0, awayGoals: 1,
    scorers: [{ player: 'McGinn', team: 'SCO', minute: '28’' }],
  },
  {
    n: 2, date: '2026-06-19', venue: 'Lincoln Financial Field', city: 'Philadelphia', home: 'BRA', away: 'HAI', homeGoals: 3, awayGoals: 0,
    scorers: [
      { player: 'Cunha', team: 'BRA', minute: '23’' },
      { player: 'Cunha', team: 'BRA', minute: '36’' },
      { player: 'Vinícius', team: 'BRA', minute: '45+3’' },
    ],
  },
  {
    n: 3, date: '2026-06-24', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', home: 'MAR', away: 'HAI', homeGoals: 4, awayGoals: 2,
    scorers: [
      { player: 'Yassine Bounou', team: 'HAI', minute: '10’', note: 'og' },
      { player: 'Hakimi', team: 'MAR', minute: '39’' },
      { player: 'Wilson Isidor', team: 'HAI', minute: '43’' },
      { player: 'Saibari', team: 'MAR', minute: '45+1’' },
      { player: 'Rahimi', team: 'MAR', minute: '78’' },
      { player: 'Yassine', team: 'MAR', minute: '89’' },
    ],
  },
]

export const wcStandings: { team: TeamCode; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }[] = [
  { team: 'BRA', p: 3, w: 2, d: 1, l: 0, gf: 7, ga: 1, pts: 7 },
  { team: 'MAR', p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 3, pts: 7 },
  { team: 'SCO', p: 3, w: 1, d: 0, l: 2, gf: 1, ga: 4, pts: 3 },
  { team: 'HAI', p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 8, pts: 0 },
]

export interface WcPlayer {
  name: string
  pos: Pos
  club: string
  /** page in /espo/atlet, used only if that slug exists in src/data/athlete-ids.json */
  slug?: string
  startedVsMorocco?: boolean
}

// Squad of 26 as listed by beIN SPORTS (clubs as listed at the time, May 2026). Starters: Wikipedia line-up, Morocco match.
export const wcSquad: WcPlayer[] = [
  { name: 'Johny Placide', pos: 'GK', club: 'Bastia', startedVsMorocco: true },
  { name: 'Alexandre Pierre', pos: 'GK', club: 'Sochaux' },
  { name: 'Josué Duverger', pos: 'GK', club: 'FC Cosmos Koblenz' },
  { name: 'Ricardo Adé', pos: 'DF', club: 'LDU Quito', startedVsMorocco: true },
  { name: 'Carlens Arcus', pos: 'DF', club: 'Angers', slug: 'carlens-arcus' },
  { name: 'Martin Expérience', pos: 'DF', club: 'Nancy', startedVsMorocco: true },
  { name: 'Jean-Kévin Duverne', pos: 'DF', club: 'Gent', startedVsMorocco: true },
  { name: 'Duke Lacroix', pos: 'DF', club: 'Colorado Springs Switchbacks' },
  { name: 'Wilguens Paugain', pos: 'DF', club: 'Zulte Waregem' },
  { name: 'Hannes Delcroix', pos: 'DF', club: 'Lugano', startedVsMorocco: true },
  { name: 'Keeto Thermoncy', pos: 'DF', club: 'Young Boys' },
  { name: 'Leverton Pierre', pos: 'MF', club: 'Vizela' },
  { name: 'Danley Jean-Jacques', pos: 'MF', club: 'Philadelphia Union', startedVsMorocco: true },
  { name: 'Carl Sainté', pos: 'MF', club: 'El Paso Locomotive' },
  { name: 'Jean-Ricner Bellegarde', pos: 'MF', club: 'Wolverhampton', startedVsMorocco: true },
  { name: 'Woodensky Pierre', pos: 'MF', club: 'Violette' },
  { name: 'Dominique Simon', pos: 'MF', club: 'Tatran Prešov' },
  { name: 'Duckens Nazon', pos: 'FW', club: 'Esteghlal', slug: 'duckens-nazon' },
  { name: 'Frantzdy Pierrot', pos: 'FW', club: 'Çaykur Rizespor', slug: 'frantzdy-pierrot' },
  { name: 'Derrick Etienne Jr.', pos: 'FW', club: 'Toronto FC', slug: 'derrick-etienne-jr' },
  { name: 'Louicius Deedson', pos: 'FW', club: 'FC Dallas' },
  { name: 'Ruben Providence', pos: 'FW', club: 'Almere City', startedVsMorocco: true },
  { name: 'Josué Casimir', pos: 'FW', club: 'Auxerre', startedVsMorocco: true },
  { name: 'Yassin Fortuné', pos: 'FW', club: 'Vizela' },
  { name: 'Wilson Isidor', pos: 'FW', club: 'Sunderland', slug: 'wilson-isidor', startedVsMorocco: true },
  { name: 'Lenny Joseph', pos: 'FW', club: 'Ferencváros', startedVsMorocco: true },
]

type TimelineItem = { date: string; text: string; source: keyof typeof WC_SOURCES }

const ht = {
  metaTitle: 'Ayiti nan Koup di Mond 2026',
  metaDescription: 'Rezilta, lis jwè yo, bò gòl ak kijan Grenadye yo kalifye pou Koup di Mond FIFA 2026, ak sous pou chak enfòmasyon.',
  eyebrow: 'Grenadye · Koup di Mond FIFA 2026',
  title: 'Ayiti nan Koup di Mond 2026',
  heroLine: 'Ayiti fini dènye nan Gwoup C: twa defèt, 2 gòl pou, 8 gòl kont.',
  heroSub: 'Dezyèm patisipasyon Ayiti nan yon Koup di Mond, 52 an apre premye a an 1974. Dapre Wikipedia, se te premye ekip ki elimine nan tounwa a.',
  coach: 'Antrenè: Sébastien Migné',
  stats: { pts: 'pwen', gf: 'gòl pou', ga: 'gòl kont', pos: 'plas nan gwoup la' },
  position4: '4yèm',
  resultsTitle: 'Matchs yo',
  resultsIntro: 'Gwoup C: Brezil, Moròk, Ekòs, Ayiti. Òd lokal yo se sa Wikipedia bay.',
  teams: { HAI: 'Ayiti', BRA: 'Brezil', MAR: 'Moròk', SCO: 'Ekòs' } as Record<TeamCode, string>,
  matchLabel: (n: number) => `Match ${n}`,
  scorersLabel: 'Bò gòl yo',
  ownGoal: 'gòl kont kan',
  atVenue: (v: string, c: string) => `${v}, ${c}`,
  standingsTitle: 'Klasman final Gwoup C',
  cols: { team: 'Ekip', p: 'J', w: 'G', d: 'N', l: 'P', gf: 'GP', ga: 'GK', pts: 'Pwen' },
  standingsNote: 'Brezil ak Moròk te egal sou pwen: Brezil pran premye plas la sou diferans gòl. Yo de a pase nan 16yèm final yo.',
  haitiScorersTitle: 'Gòl Ayiti yo',
  haitiScorers: [
    'Wilson Isidor, kont Moròk, 43yèm minit (24 jen).',
    'Yassine Bounou (gadyen Moròk) te make yon gòl kont kan nan 10yèm minit, ki konte pou Ayiti (24 jen).',
  ],
  haitiScorersNote: 'Ayiti pa t make nan de premye match yo (0–1 kont Ekòs, 0–3 kont Brezil).',
  qualTitle: 'Kijan Ayiti kalifye',
  timeline: [
    { date: 'Jen 2024', text: 'Sébastien Migné pran tèt ekip nasyonal la.', source: 'concacaf' },
    { date: 'Sezon 2024/25', text: 'Ayiti genyen sis match nan Gwoup C, Lig B Nations League Concacaf la, epi monte nan Lig A.', source: 'concacaf' },
    { date: 'Septanm (twazyèm wonn)', text: 'Duckens Nazon make yon hat-trick kòm ranplasan kont Kosta Rika. Li fini ak sis gòl nan kalifikasyon yo.', source: 'concacaf' },
    { date: '18 novanm 2025', text: 'Ayiti bat Nikaragwa 2–0 nan Willemstad, Kirasao (Louicius Deedson 9yèm minit, Ruben Providence nan tan ajoute premye mitan an). Li fini premye nan Gwoup C twazyèm wonn lan epi kalifye dirèk: premye fwa depi 1974.', source: 'concacafNic' },
    { date: 'Pandan kalifikasyon yo', text: 'Akoz ensekirite nan peyi a, Ayiti pa t kapab jwe lakay li: match "lakay" yo te fèt Kirasao.', source: 'wlrn' },
    { date: '15 me 2026', text: 'Lis 26 jwè pou Koup di Mond lan piblye.', source: 'bein' },
    { date: '13, 19 ak 24 jen 2026', text: 'Twa match nan Gwoup C: Ekòs, Brezil, Moròk.', source: 'groupC' },
  ] as TimelineItem[],
  history: 'Sèl lòt Koup di Mond Ayiti te jwe se te sa an 1974 nan Almay: twa defèt, 2 gòl pou ak 14 kont.',
  squadTitle: 'Lis 26 jwè yo',
  squadIntro: 'Klib yo se sa beIN SPORTS te make lè lis la te anonse (mè 2026). Yon jwè ka chanje klib depi lè sa a.',
  starter: 'Te kòmanse match Moròk la',
  starterNote: 'Mak sa a montre jwè ki te nan onzèm kòmansman kont Moròk (dapre Wikipedia).',
  pos: { GK: 'Gadyen', DF: 'Defansè', MF: 'Milye', FW: 'Atakan' } as Record<Pos, string>,
  seeProfile: 'Wè pwofil la',
  moreAthletes: 'Wè tout atlèt ayisyen aletranje yo',
  sourcesTitle: 'Sous yo',
  asOf: (d: string) => `Enfòmasyon verifye ${d}.`,
  notesTitle: 'Nòt sou sous yo',
  notes: [
    'Òtograf: beIN SPORTS ekri « Daley Jean-Jacques », Wikipedia ekri « Danley Jean Jacques ». Nou itilize « Danley Jean-Jacques ».',
    'Dat anons lis 26 jwè a (15 me 2026) soti nan adrès atik beIN lan; atik la menm pa bay dat klè.',
    'Gòl Bounou a: Wikipedia ekri non li nan lis gòl Ayiti yo, ak nòt ke se yon gòl kont kan.',
  ],
  disclaimer: 'Se pa FIFA, ni Federasyon Ayisyen Foutbòl la ki ekri paj sa a.',
  ogLine: 'Rezilta, jwè ak sous',
}

export type WorldCupDict = typeof ht

const fr: WorldCupDict = {
  metaTitle: 'Haïti à la Coupe du monde 2026',
  metaDescription: 'Résultats, liste des joueurs, buteurs et parcours des Grenadiers vers la Coupe du monde FIFA 2026, avec la source de chaque information.',
  eyebrow: 'Grenadiers · Coupe du monde FIFA 2026',
  title: 'Haïti à la Coupe du monde 2026',
  heroLine: 'Haïti termine dernier du Groupe C : trois défaites, 2 buts marqués, 8 encaissés.',
  heroSub: 'Deuxième participation d’Haïti à une Coupe du monde, 52 ans après la première en 1974. Selon Wikipédia, ce fut la première équipe éliminée du tournoi.',
  coach: 'Entraîneur : Sébastien Migné',
  stats: { pts: 'points', gf: 'buts pour', ga: 'buts contre', pos: 'place dans le groupe' },
  position4: '4e',
  resultsTitle: 'Les matchs',
  resultsIntro: 'Groupe C : Brésil, Maroc, Écosse, Haïti. Les scores et buteurs sont ceux de Wikipédia.',
  teams: { HAI: 'Haïti', BRA: 'Brésil', MAR: 'Maroc', SCO: 'Écosse' } as Record<TeamCode, string>,
  matchLabel: (n: number) => `Match ${n}`,
  scorersLabel: 'Buteurs',
  ownGoal: 'but contre son camp',
  atVenue: (v: string, c: string) => `${v}, ${c}`,
  standingsTitle: 'Classement final du Groupe C',
  cols: { team: 'Équipe', p: 'J', w: 'G', d: 'N', l: 'P', gf: 'BP', ga: 'BC', pts: 'Pts' },
  standingsNote: 'Le Brésil et le Maroc étaient à égalité de points : le Brésil prend la première place à la différence de buts. Les deux passent en seizièmes de finale.',
  haitiScorersTitle: 'Les buts d’Haïti',
  haitiScorers: [
    'Wilson Isidor, contre le Maroc, 43e minute (24 juin).',
    'Yassine Bounou (gardien du Maroc) a marqué contre son camp à la 10e minute, but crédité à Haïti (24 juin).',
  ],
  haitiScorersNote: 'Haïti n’a pas marqué lors de ses deux premiers matchs (0–1 contre l’Écosse, 0–3 contre le Brésil).',
  qualTitle: 'Comment Haïti s’est qualifié',
  timeline: [
    { date: 'Juin 2024', text: 'Sébastien Migné prend la tête de l’équipe nationale.', source: 'concacaf' },
    { date: 'Saison 2024/25', text: 'Haïti gagne ses six matchs du Groupe C de la Ligue B de la Ligue des nations de la Concacaf et monte en Ligue A.', source: 'concacaf' },
    { date: 'Septembre (troisième tour)', text: 'Duckens Nazon inscrit un triplé en tant que remplaçant contre le Costa Rica. Il termine avec six buts dans les éliminatoires.', source: 'concacaf' },
    { date: '18 novembre 2025', text: 'Haïti bat le Nicaragua 2–0 à Willemstad, Curaçao (Louicius Deedson 9e, Ruben Providence en fin de première mi-temps). Premier du Groupe C du troisième tour, il se qualifie directement : une première depuis 1974.', source: 'concacafNic' },
    { date: 'Pendant les éliminatoires', text: 'À cause de l’insécurité dans le pays, Haïti n’a pas pu jouer chez lui : ses matchs « à domicile » ont eu lieu à Curaçao.', source: 'wlrn' },
    { date: '15 mai 2026', text: 'Publication de la liste de 26 joueurs pour la Coupe du monde.', source: 'bein' },
    { date: '13, 19 et 24 juin 2026', text: 'Trois matchs du Groupe C : Écosse, Brésil, Maroc.', source: 'groupC' },
  ] as TimelineItem[],
  history: 'La seule autre Coupe du monde d’Haïti remonte à 1974 en Allemagne : trois défaites, 2 buts marqués et 14 encaissés.',
  squadTitle: 'Les 26 joueurs',
  squadIntro: 'Les clubs sont ceux indiqués par beIN SPORTS lors de l’annonce de la liste (mai 2026). Un joueur a pu changer de club depuis.',
  starter: 'Titulaire contre le Maroc',
  starterNote: 'Ce repère indique les joueurs alignés d’entrée contre le Maroc (selon Wikipédia).',
  pos: { GK: 'Gardiens', DF: 'Défenseurs', MF: 'Milieux', FW: 'Attaquants' } as Record<Pos, string>,
  seeProfile: 'Voir le profil',
  moreAthletes: 'Voir tous les athlètes haïtiens à l’étranger',
  sourcesTitle: 'Sources',
  asOf: (d: string) => `Informations vérifiées le ${d}.`,
  notesTitle: 'Notes sur les sources',
  notes: [
    'Orthographe : beIN SPORTS écrit « Daley Jean-Jacques », Wikipédia écrit « Danley Jean Jacques ». Nous utilisons « Danley Jean-Jacques ».',
    'La date d’annonce de la liste de 26 joueurs (15 mai 2026) vient de l’adresse de l’article beIN ; l’article lui-même ne donne pas de date claire.',
    'But de Bounou : Wikipédia l’inscrit dans la liste des buts d’Haïti, avec la mention qu’il s’agit d’un but contre son camp.',
  ],
  disclaimer: 'Cette page n’est écrite ni par la FIFA ni par la Fédération haïtienne de football.',
  ogLine: 'Résultats, joueurs et sources',
}

const en: WorldCupDict = {
  metaTitle: 'Haiti at the 2026 World Cup',
  metaDescription: 'Results, squad, scorers and how the Grenadiers qualified for the 2026 FIFA World Cup, with the source of every fact.',
  eyebrow: 'Grenadiers · FIFA World Cup 2026',
  title: 'Haiti at the 2026 World Cup',
  heroLine: 'Haiti finished bottom of Group C: three defeats, 2 goals scored, 8 conceded.',
  heroSub: 'Haiti’s second World Cup, 52 years after the first in 1974. According to Wikipedia, they were the first team eliminated from the tournament.',
  coach: 'Head coach: Sébastien Migné',
  stats: { pts: 'points', gf: 'goals for', ga: 'goals against', pos: 'place in group' },
  position4: '4th',
  resultsTitle: 'The matches',
  resultsIntro: 'Group C: Brazil, Morocco, Scotland, Haiti. Scores and scorers are as given by Wikipedia.',
  teams: { HAI: 'Haiti', BRA: 'Brazil', MAR: 'Morocco', SCO: 'Scotland' } as Record<TeamCode, string>,
  matchLabel: (n: number) => `Match ${n}`,
  scorersLabel: 'Scorers',
  ownGoal: 'own goal',
  atVenue: (v: string, c: string) => `${v}, ${c}`,
  standingsTitle: 'Final Group C standings',
  cols: { team: 'Team', p: 'P', w: 'W', d: 'D', l: 'L', gf: 'GF', ga: 'GA', pts: 'Pts' },
  standingsNote: 'Brazil and Morocco finished level on points: Brazil took first place on goal difference. Both went through to the round of 32.',
  haitiScorersTitle: 'Haiti’s goals',
  haitiScorers: [
    'Wilson Isidor, against Morocco, 43rd minute (24 June).',
    'Yassine Bounou (Morocco’s goalkeeper) scored an own goal in the 10th minute, credited to Haiti (24 June).',
  ],
  haitiScorersNote: 'Haiti did not score in their first two matches (0–1 against Scotland, 0–3 against Brazil).',
  qualTitle: 'How Haiti qualified',
  timeline: [
    { date: 'June 2024', text: 'Sébastien Migné takes charge of the national team.', source: 'concacaf' },
    { date: '2024/25 season', text: 'Haiti win all six matches in Group C of Concacaf Nations League B and are promoted to League A.', source: 'concacaf' },
    { date: 'September (third round)', text: 'Duckens Nazon scores a hat-trick as a substitute against Costa Rica. He finishes with six goals in qualifying.', source: 'concacaf' },
    { date: '18 November 2025', text: 'Haiti beat Nicaragua 2–0 in Willemstad, Curaçao (Louicius Deedson 9th, Ruben Providence in first-half stoppage time). They finish top of third-round Group C and qualify directly: the first time since 1974.', source: 'concacafNic' },
    { date: 'During qualifying', text: 'Because of insecurity at home, Haiti could not play in their own country: their “home” matches were played in Curaçao.', source: 'wlrn' },
    { date: '15 May 2026', text: 'The 26-man World Cup squad is published.', source: 'bein' },
    { date: '13, 19 and 24 June 2026', text: 'Three Group C matches: Scotland, Brazil, Morocco.', source: 'groupC' },
  ] as TimelineItem[],
  history: 'Haiti’s only other World Cup was in 1974 in West Germany: three defeats, 2 goals scored and 14 conceded.',
  squadTitle: 'The 26 players',
  squadIntro: 'Clubs are those listed by beIN SPORTS when the squad was announced (May 2026). A player may have changed club since.',
  starter: 'Started against Morocco',
  starterNote: 'This marker shows who was in the starting line-up against Morocco (according to Wikipedia).',
  pos: { GK: 'Goalkeepers', DF: 'Defenders', MF: 'Midfielders', FW: 'Forwards' } as Record<Pos, string>,
  seeProfile: 'See profile',
  moreAthletes: 'See all Haitian athletes abroad',
  sourcesTitle: 'Sources',
  asOf: (d: string) => `Information verified ${d}.`,
  notesTitle: 'Notes on the sources',
  notes: [
    'Spelling: beIN SPORTS writes “Daley Jean-Jacques”, Wikipedia writes “Danley Jean Jacques”. We use “Danley Jean-Jacques”.',
    'The squad announcement date (15 May 2026) comes from the beIN article’s web address; the article itself gives no clear date.',
    'Bounou’s goal: Wikipedia lists it among Haiti’s goals, noting that it was an own goal.',
  ],
  disclaimer: 'This page is not written by FIFA or by the Haitian Football Federation.',
  ogLine: 'Results, players and sources',
}

export const worldCupDict = { ht, fr, en }
export const getWorldCupT = () => worldCupDict[getLang()]
