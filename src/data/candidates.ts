import type { Candidate, CandidacyStatus, OfficeKey } from '@/types'
import snapshot from './cep-snapshot.json'

// Source for the registration status below. CEP states these are PRELIMINARY online registration
// figures; the official list comes only after CEP verification and validation.
export const CEP_SOURCE = {
  label: 'CEP — Statistiques enregistrement des candidats',
  url: 'https://cephaiti.ht/statistiques-enregistrement-des-candidats/',
}
export const REGISTRATION_SNAPSHOT = snapshot.fetchedAt

// To fill in a profile later, add fields to its entry in `details` below (education, career,
// positions, votes, pledges, program, interviews, officialLinks, photo, photoCredit…).
// Missing data is displayed as "not yet documented", never as "none".
const details: Record<string, Partial<Candidate>> = {
  // 'gary-bodeau': { photo: '/candidates/gary-bodeau.jpg', photoCredit: 'Foto: …', education: ['…'] },
  // TODO(sources): add article URLs — AyiboPost, « Qui est Ernest Muscadin ? » (Molière Adely, 7 juin 2022);
  // Le Nouvelliste (Miragoâne); canada-haiti.ca; HaitiLibre. Facts below come from a Wikipedia-style bio.
  // TODO(photo): confirm owner/permission for the photo before launch.
  // TODO(sources): only "ancien maire de Delmas" supplied by the editor; no source URL or dates yet. A web search
  // found nothing citable (one 2011 advocacy-site item, not used). Add dates + a source (e.g. Radio Haiti archive,
  // CEP/municipal records, news report) before this line is shown as verified.
  // TODO(photo): confirm owner/permission before launch.
  'wilson-jeudy': {
    photo: '/candidates/wilson-jeudy.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    positions: [
      { office: 'Majistra Delma (ansyen)', dates: 'Dat poko dokimante', role: 'Ansyen majistra komin Delma. Detay ak sous poko ajoute.' },
    ],
  },
  // TODO(sources): bio is Wikipedia-style (refs: IPU data.ipu.org, Routledge/CQ Press directories). Add direct URLs.
  // Birth date and party history ("Alliance Parlementaire pour Haïti") left out: registered structure is P.R.
  // TODO(photo): confirm owner/permission before launch.
  'gary-bodeau': {
    photo: '/candidates/gary-bodeau.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Ansyen prezidan Chanm Depite yo (2018–2020) ak ansyen depite Lwès. Enskripsyon prelimine pou prezidans, estrikti politik: P.R. Apwobasyon final la ap tann verifikasyon CEP.',
    positions: [
      { office: 'Prezidan Chanm Depite yo', dates: '10 janvye 2018 – 13 janvye 2020', role: 'Prezide Chanm Depite yo. Predesesè: Cholzer Chancy.' },
      { office: 'Depite pou depatman Lwès', dates: '11 janvye 2016 – 13 janvye 2020', role: 'Reprezante depatman Lwès (Ouest) nan Chanm Depite yo.' },
    ],
    // Hidden until site.showPublicRecord is true AND reviewStatus is 'published' (see docs/dosye-piblik-rubrik.md).
    publicRecord: [
      {
        kind: 'official-action',
        issuer: 'Depatman Trezò Etazini (OFAC)',
        date: '2023-04-05',
        summary:
          'Depatman Trezò Etazini a te enpoze sanksyon sou li dapre Òd Egzekitif 13818, an di li patisipe nan konplo koripsyon. Dokiman Trezò a deklare ke an 2018 ak 2019 li te sèvi ak peman pou enfliyanse vòt yo sou nominasyon minis yo. Se alegasyon Trezò a, se pa yon jijman tribinal.',
        limits: 'Se yon desizyon administratif Ameriken, pa yon kondanasyon jidisyè. Pa gen enfòmasyon sou pwosè nan tribinal.',
        // TODO: replace with the original home.treasury.gov press release URL (this is a mirror).
        source: { label: 'Trezò Etazini — sanksyon kont ansyen prezidan Chanm Depite yo (5 avril 2023)', url: 'https://www.globalsecurity.org/military/library/news/2023/04/mil-230405-treasury01.htm' },
        responseStatus: 'notRequested',
        reviewStatus: 'draft',
      },
    ],
  },
  // TODO(sources): from a 29 Sep 2026 article by Jean Junior Celestin (outlet and URL not supplied). Add the URL.
  // Dates for the Secretary of State post are not in the source. "Verite" is the 2016 platform name as written there.
  // TODO(photo): confirm owner/permission before launch.
  'wilner-joseph': {
    photo: '/candidates/wilner-joseph.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Ansyen sekretè deta pou Popilasyon sou Prezidan Jovenel Moïse. Dapre yon atik 29 sektanm 2026, li prezante tèt li kòm kandida « rekonsilyasyon nasyonal ». Enskripsyon prelimine pou prezidans, estrikti politik: VIKTWA. Apwobasyon final la ap tann verifikasyon CEP.',
    career: ['Te kandida pou depite nan 3yèm sikonskripsyon Pòtoprens (eleksyon 2016, plateform Verite)'],
    positions: [
      { office: 'Sekretè deta pou Popilasyon (ansyen)', dates: 'Dat poko dokimante', role: 'Nan administrasyon Prezidan Jovenel Moïse.' },
    ],
  },
  // Source: the MPH party's own candidates page (self-published, not independently verified). Its biography text is
  // truncated ("Lire la suite") and gives no education, career dates or offices held. Party founding year (2004) is
  // the PARTY's, not his tenure, so it is not shown as his. The party's manifesto PDF is linked, but not entered as
  // his "program" until its date/author are confirmed.
  // TODO(photo): file was a WhatsApp image (Sept 2026), likely supplied by the party; confirm owner/permission.
  'munir-joseph-mourra': {
    photo: '/candidates/munir-joseph-mourra.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Prezidan Mobilizasyon pou Pwogrè Ayiti (MPH), dapre sit pati a. Enskripsyon prelimine pou prezidans. Apwobasyon final la ap tann verifikasyon CEP.',
    career: ['Prezidan Mobilisation pour le Progrès d’Haïti (MPH) — dapre sit ofisyèl pati a, dat pa presize'],
    officialLinks: [
      { label: 'MPH — paj kandida (sit pati a)', url: 'https://mphhaiti.org/candidats?poste=Pr%C3%A9sident+de+la+R%C3%A9publique' },
      { label: 'MPH — Manifèst 2026 (PDF, pati a)', url: 'https://mphhaiti.org/media/manifeste-mph-2026.pdf' },
      { label: 'MPH sou Facebook', url: 'https://www.facebook.com/profile.php?id=61585385507387' },
      { label: 'MPH sou X', url: 'https://x.com/mph_haiti' },
      { label: 'MPH sou Instagram', url: 'https://www.instagram.com/mphhaiti/' },
      { label: 'MPH sou YouTube', url: 'https://www.youtube.com/channel/UCalWI21OqHopExzRdEiC48g' },
    ],
    sources: [
      CEP_SOURCE,
      { label: 'MPH — paj kandida (sit pati a, sous pa endepandan)', url: 'https://mphhaiti.org/candidats?poste=Pr%C3%A9sident+de+la+R%C3%A9publique' },
    ],
  },
  // TODO(sources): from a 24 Sep 2026 article by Jean Junior Celestin (outlet and URL not supplied; same author as the
  // Wilner Joseph piece). Add the URL. Once it is available, enter the "restore State authority" pledge under `pledges`
  // (topic, pledge text, date 2026-09-24, source link); it is only in the blurb for now because a pledge needs a source link.
  // "Rendez-vous" (2016) and VIHAMO are names as written in that article. The registered structure RCH = Réveil des Citoyens Haïtiens.
  // TODO(photo): file name looks like a Facebook image download; confirm owner/permission before launch.
  'maxo-joseph': {
    photo: '/candidates/maxo-joseph.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Pastè, fondatè pati VIHAMO ak ansyen kandida prezidan an 2016. Dapre yon atik 24 septanm 2026, li pran angajman pou « retabli otorite Leta ». Enskripsyon prelimine pou prezidans, estrikti politik: RCH (Réveil des Citoyens Haïtiens). Apwobasyon final la ap tann verifikasyon CEP.',
    career: [
      'Pastè',
      'Fondatè pati Vision pour Haïti et le Monde (VIHAMO)',
      'Te kandida pou prezidan an 2016 anba bannyè Rendez-vous',
    ],
  },
  // TODO(sources): the text supplied has NO named source or links (it reads like a generated summary), so every fact
  // below is unverified. Check the deputy terms and the quaestor post against Haiti-Référence / Chamber of Deputies records.
  // Spelling follows the CEP ("Gandhy"); the text also writes "Gandhi". Party "Ansanm Nou Fò" matches the CEP structure ANF.
  // TODO(photo): confirm owner/permission before launch.
  'gandhy-dorfeuille': {
    photo: '/candidates/gandhy-dorfeuille.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Ansyen depite Sen-Lwi-di-Sid ak ansyen kesyonè Chanm Depite yo. Prezidan pati Ansanm Nou Fò. Enskripsyon prelimine pou prezidans, estrikti politik: ANF. Apwobasyon final la ap tann verifikasyon CEP.',
    career: ['Prezidan ak lidè pati politik Ansanm Nou Fò'],
    positions: [
      { office: 'Depite pou Sen-Lwi-di-Sid (Saint-Louis-du-Sud)', dates: '49yèm ak 50yèm lejislati (dat egzak poko dokimante)', role: 'Reprezante Sen-Lwi-di-Sid nan Chanm Depite yo.' },
      { office: 'Kesyonè Chanm Depite yo', dates: 'Depi janvye 2019 (dat fen poko dokimante)', role: 'Pòs nan biwo Chanm Depite yo. Responsablite egzak yo poko dokimante.' },
    ],
  },
  // Source: NAGO.TV, 26 Sept 2026 (originally Vant Bèf Info). Read through an automated summary of the page, so the exact
  // wording and the palace post's title/dates should be re-checked against the original. The article gives no program.
  // The coalition is named "Solidarite Pou Ayiti Respire" in the CEP party list.
  // TODO(photo): file name suggests a WhatsApp image (24 Sept 2026), likely supplied by the campaign; confirm owner/permission.
  'moise-durocher': {
    photo: '/candidates/moise-durocher.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Doktè nan matematik ak pwofesè inivèsitè. Dapre NAGO.TV, SOL AYITI (yon kowalisyon onz pati) te dezinye l kandida apre yon primè 21 septanm 2026. Enskripsyon prelimine pou prezidans. Apwobasyon final la ap tann verifikasyon CEP.',
    education: ['Doktora nan matematik (etablisman poko dokimante)'],
    career: [
      'Doktè nan matematik',
      'Pwofesè nan plizyè inivèsite prive nan Pòtoprens ak nan Fakilte Syans Inivèsite Leta Ayiti (UEH)',
    ],
    positions: [
      { office: 'Fonksyonè nan administrasyon Palè Nasyonal la', dates: 'Apeprè 15 an (dat egzak poko dokimante)', role: 'Tit egzak la ak responsablite yo poko dokimante.' },
    ],
    sources: [
      CEP_SOURCE,
      { label: 'NAGO.TV (dapre Vant Bèf Info) — SOL AYITI dezinye Dr Moïse Durocher kòm kandida prezidan, 26 septanm 2026', url: 'https://nago.tv/es/news/sol-ayiti-designe-dr-moise-durocher-comme-candidat-a-la-presidence' },
    ],
  },
  // TODO(sources): from a French Wikipedia article (flagged there since July 2021 for insufficient sources; it cites
  // Haiti-Référence, "50ème Législature (2016-2020)", for the deputy seat). Verify against Haiti-Référence / Chamber records.
  // NOT shown, pending verification: the bio says he proposed three bills (legalisation des pièces, stage obligatoire,
  // protection sociale obligatoire), founded IGGEP and computerised the DGI Sud-Est, and describes a 3-axis program
  // (bonne gouvernance, décentralisation, industrialisation). Those are self-reported / unsourced claims; once sourced,
  // add them under `pledges`/`program` (attributed) and, for the bills, the legislative record. Spelling follows the CEP
  // ("Deus"); Wikipedia writes "Déus".
  // TODO(photo): confirm owner/permission before launch.
  'deus-deronneth': {
    photo: '/candidates/deus-deronneth.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Ekonomis ak ansyen depite Marigot (2016–2020). Enskripsyon prelimine pou prezidans, estrikti politik: DVNH. Apwobasyon final la ap tann verifikasyon CEP.',
    education: [
      'Doktoran nan syans ekonomik',
      'Diplome Ecole Nationale d’Administration Financière (ENAF)',
      'Metriz nan Administrasyon Piblik ak Gouvènans — Université des Antilles et de la Guyane (UAG)',
      'Metriz nan Biznis ak Mache (Affaires et Marchés) — UAG',
    ],
    career: [
      'Ekonomis, ekspè nan gouvènans ak konsiltan endepandan',
      'Pwofesè inivèsitè',
      'Fondatè Institut de Gestion, de Gouvernance et des Études Politiques (IGGEP), 2020',
    ],
    positions: [
      { office: 'Depite pou sikonskripsyon Marigot', dates: '50yèm lejislati (2016–2020)', role: 'Reprezante sikonskripsyon Marigot nan Chanm Depite yo.' },
      { office: 'Direktè depatmantal Enpo (DGI) Sidès', dates: 'Dat poko dokimante', role: 'Direktè depatmantal administrasyon enpo a nan depatman Sidès.' },
    ],
  },
  // TODO(sources): bio is Wikipedia-style (refs: Washington Post, CNN, NYT 2021; Juno7 25 Nov 2021; AP 2022/2024;
  // PressLakay 5 Sept 2022). Add direct URLs. Birth date is marked "citation needed" there, so it is left out.
  // TODO(photo): confirm owner/permission before launch. Source photo is landscape (cropped to portrait frame).
  'claude-joseph': {
    photo: '/candidates/claude-joseph.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Ansyen premye minis enterimè (2021) ak ansyen minis Afè Etranjè (2020–2021). Enskripsyon prelimine pou prezidans, estrikti politik: EDE. Apwobasyon final la ap tann verifikasyon CEP.',
    education: [
      'Doktora nan politik piblik — The New School (New York)',
      'Metriz nan administrasyon piblik (MPA) — Long Island University',
    ],
    career: [
      'Pwofesè inivèsitè Ozetazini: University of Connecticut ak Long Island University',
    ],
    positions: [
      { office: 'Premye minis enterimè', dates: '14 avril 2021 – 20 jiyè 2021', role: 'Nonmen pa Prezidan Jovenel Moïse. Siksesè: Ariel Henry.' },
      { office: 'Minis Afè Etranjè ak Kilt', dates: '4 mas 2020 – novanm 2021', role: 'Minis nan gouvènman Joseph Jouthe, apre sa nan gouvènman Ariel Henry. Siksesè: Jean Victor Généus.' },
    ],
    officialLinks: [],
  },
  // TODO(sources): bio is a Wikipedia-style text (refs: leparlementhaitien.info, AFP/ABC News 2016, Haiti Sentinel,
  // CIDOB biography). Add direct URLs. Birth year is inconsistent in the bio (1953 vs 1954) so it is left out.
  // TODO(photo): confirm owner/permission before launch.
  'jocelerme-privert': {
    photo: '/candidates/jocelerme-privert.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Kontab ak ansyen prezidan pwovizwa (2016–2017), ansyen prezidan Sena a ak ansyen sènatè Nippes. Enskripsyon prelimine pou prezidans, estrikti politik: AYITI TRANSFOME. Apwobasyon final la ap tann verifikasyon CEP.',
    education: ['Kontab (fòmasyon: detay ak etablisman poko dokimante)'],
    career: [
      'Kontab',
      'Direksyon Jeneral Enpo (DGI), 1979–1999',
    ],
    positions: [
      { office: 'Prezidan pwovizwa Repiblik la', dates: '14 fevriye 2016 – 7 fevriye 2017', role: 'Eli pa Asanble Nasyonal la nan tan tann dezyèm tou eleksyon 2015 la. Siksesè: Jovenel Moïse.' },
      { office: 'Prezidan Sena a', dates: '14 janvye 2016 – 14 fevriye 2016', role: 'Prezide Sena a.' },
      { office: 'Sènatè Nippes', dates: '6 avril 2011 – 14 janvye 2016', role: 'Reprezante depatman Nippes nan Sena a.' },
      { office: 'Minis Enteryè ak Kolektivite Teritoryal', dates: '2002 – 2004', role: 'Minis nan gouvènman Jean-Bertrand Aristide.' },
      { office: 'Minis Ekonomi ak Finans', dates: '2001 – 2002', role: 'Minis nan gouvènman Jean-Bertrand Aristide.' },
    ],
  },
  'jean-ernest-muscadin': {
    photo: '/candidates/jean-ernest-muscadin.jpg',
    photoCredit: 'Foto: kredi ak otorizasyon poko konfime',
    blurb:
      'Avoka ak Komisè gouvènman nan Miragwàn depi 2020. Enskripsyon prelimine pou prezidans, estrikti politik: FCN. Apwobasyon final la ap tann verifikasyon CEP.',
    education: [
      'Lekòl Nasyonal Michel Lazard (1980–1986)',
      'Lise Philippe Guerrier, Okay',
      'Diplome Lise Jean-Jacques Dessalines, Pòtoprens (1996)',
      'Lisans an dwa — Ecole de Droit et des Sciences Économiques des Cayes (2004)',
    ],
    career: [
      'Avoka',
      'Komisè gouvènman bò tribinal Miragwàn (Nippes)',
    ],
    positions: [
      {
        office: 'Komisè gouvènman (Commissaire du gouvernement), Miragwàn',
        dates: 'Nonmen 31 janvye 2020',
        role: 'Reprezante Minis Piblik la nan jiridiksyon Miragwàn nan.',
      },
    ],
    interviews: [],
  },
}

// ---- Registrations come from src/data/cep-snapshot.json (run `node scripts/fetch-cep.mjs` to refresh). ----
// Preliminary CEP data: names/parties exactly as the CEP lists them (title-cased for display).
const officeByPoste: Record<string, { key: OfficeKey; label: string }> = {
  'Président': { key: 'president', label: 'Prezidan' },
  'Sénateur': { key: 'senator', label: 'Senatè' },
  'Député': { key: 'deputy', label: 'Depite' },
  'Maire': { key: 'mayor', label: 'Majistra' },
}

const slugify = (t: string) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const titleCase = (t: string) =>
  t.toLowerCase().split(/([\s\-'’/.(])/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')

type Row = (typeof snapshot.rows)[number]
const baseSlug = (r: Row) => slugify(`${r.prenom} ${r.nom}`)
const baseCount = new Map<string, number>()
snapshot.rows.forEach((r) => baseCount.set(baseSlug(r), (baseCount.get(baseSlug(r)) ?? 0) + 1))
const usedSlugs = new Set<string>()

function uniqueSlug(r: Row): string {
  let slug = baseSlug(r)
  if ((baseCount.get(slug) ?? 0) > 1) slug = `${slug}-${officeByPoste[r.poste].key}-${slugify(r.localite.slice(1).concat(r.localite[0]).join('-'))}`
  let candidate = slug
  for (let n = 2; usedSlugs.has(candidate); n++) candidate = `${slug}-${n}`
  usedSlugs.add(candidate)
  return candidate
}

export const candidates: Candidate[] = snapshot.rows.map((r) => {
  const office = officeByPoste[r.poste]
  const slug = uniqueSlug(r)
  const isNational = r.localite[0] === 'National'
  const department = isNational ? undefined : titleCase(r.localite[0])
  const locality = r.localite[1] ? titleCase(r.localite[1]) : undefined
  const affiliation = r.structure
  const where = [locality, department].filter(Boolean).join(', ')
  return {
    slug,
    name: titleCase(`${r.prenom} ${r.nom}`),
    office: office.label,
    officeKey: office.key,
    department,
    locality,
    position: r.position === 'Titulaire' ? undefined : r.position,
    affiliation,
    status: 'registered' as CandidacyStatus,
    statusDate: REGISTRATION_SNAPSHOT,
    statusSource: CEP_SOURCE,
    education: [],
    career: [],
    positions: [],
    votes: null,
    proposals: [],
    sources: [CEP_SOURCE],
    lastReviewed: REGISTRATION_SNAPSHOT,
    corrections: [],
    questionnaireStatus: 'notSent' as const,
    ...details[slug],
  }
})

export const presidentialCandidates = candidates.filter((c) => c.officeKey === 'president')

export const officeKeys: OfficeKey[] = ['president', 'senator', 'deputy', 'mayor']

export const departments = Array.from(new Set(candidates.map((c) => c.department).filter(Boolean) as string[])).sort((a, b) =>
  a.localeCompare(b, 'fr'),
)

// Display text for statuses lives in src/i18n/dictionary.ts (status.*); only the badge colors live here.
export const statusTone = {
  registered: 'bg-cream-200 text-navy-800',
  announced: 'bg-cream-200 text-navy-800',
  filed: 'bg-navy-100 text-navy-800',
  approved: 'bg-flag-500 text-white',
} as const

export const pledgeTopics = [
  'Sekirite ak jistis',
  'Ekonomi ak travay',
  'Edikasyon',
  'Sante',
  'Enfrastrikti ak enèji',
  'Agrikilti ak anviwònman',
  'Gouvènans ak sèvis piblik',
]
