import type { Article, Candidate, PublicRecordEntry } from '@/types'
import type { Lang } from './config'
import { dict } from './dictionary'

// Content translations. The Creole text in src/data/*.ts is the source of truth; anything missing here
// falls back to it. When you add a candidate's details in Creole, add their fr/en entries below too.

export const PHOTO_CREDIT_PENDING = 'Foto: kredi ak otorizasyon poko konfime'
const photoCreditPending: Record<Lang, string> = {
  ht: PHOTO_CREDIT_PENDING,
  fr: 'Photo : crédit et autorisation pas encore confirmés',
  en: 'Photo: credit and permission not yet confirmed',
}

type Pos = Candidate['positions'][number]
type Overlay = {
  blurb?: string
  education?: string[]
  career?: string[]
  positions?: Pos[]
  officialLinks?: string[] // labels, same order as the Creole entry
  sourceLabels?: string[] // labels, same order as the Creole entry
  publicRecord?: (Pick<PublicRecordEntry, 'issuer' | 'summary' | 'limits'> & { sourceLabel: string })[]
}

const candidateTranslations: Record<string, Partial<Record<Exclude<Lang, 'ht'>, Overlay>>> = {
  'jean-ernest-muscadin': {
    fr: {
      blurb: 'Avocat et commissaire du gouvernement à Miragoâne depuis 2020. Inscription préliminaire à la présidentielle, structure politique : FCN. L’approbation finale est en attente de la vérification du CEP.',
      education: [
        'École nationale Michel Lazard (1980–1986)',
        'Lycée Philippe Guerrier, Les Cayes',
        'Diplômé du Lycée Jean-Jacques Dessalines, Port-au-Prince (1996)',
        'Licence en droit — École de droit et des sciences économiques des Cayes (2004)',
      ],
      career: ['Avocat', 'Commissaire du gouvernement près le tribunal de Miragoâne (Nippes)'],
      positions: [{ office: 'Commissaire du gouvernement, Miragoâne', dates: 'Nommé le 31 janvier 2020', role: 'Représente le ministère public dans la juridiction de Miragoâne.' }],
    },
    en: {
      blurb: 'Lawyer and Government Commissioner in Miragoâne since 2020. Preliminary presidential registration, political structure: FCN. Final approval is pending CEP verification.',
      education: [
        'Michel Lazard National School (1980–1986)',
        'Lycée Philippe Guerrier, Les Cayes',
        'Graduated from Lycée Jean-Jacques Dessalines, Port-au-Prince (1996)',
        'Law degree — School of Law and Economic Sciences of Les Cayes (2004)',
      ],
      career: ['Lawyer', 'Government Commissioner at the Miragoâne court (Nippes)'],
      positions: [{ office: 'Government Commissioner, Miragoâne', dates: 'Appointed 31 January 2020', role: 'Represents the public prosecutor’s office in the Miragoâne jurisdiction.' }],
    },
  },
  'jocelerme-privert': {
    fr: {
      blurb: 'Comptable, ancien président par intérim (2016–2017), ancien président du Sénat et ancien sénateur des Nippes. Inscription préliminaire à la présidentielle, structure politique : AYITI TRANSFOME. L’approbation finale est en attente de la vérification du CEP.',
      education: ['Comptable (formation : établissement et détails pas encore documentés)'],
      career: ['Comptable', 'Direction générale des impôts (DGI), 1979–1999'],
      positions: [
        { office: 'Président provisoire de la République', dates: '14 février 2016 – 7 février 2017', role: 'Élu par l’Assemblée nationale dans l’attente du second tour de l’élection de 2015. Successeur : Jovenel Moïse.' },
        { office: 'Président du Sénat', dates: '14 janvier 2016 – 14 février 2016', role: 'Préside le Sénat.' },
        { office: 'Sénateur des Nippes', dates: '6 avril 2011 – 14 janvier 2016', role: 'Représente le département des Nippes au Sénat.' },
        { office: 'Ministre de l’Intérieur et des Collectivités territoriales', dates: '2002 – 2004', role: 'Ministre dans le gouvernement de Jean-Bertrand Aristide.' },
        { office: 'Ministre de l’Économie et des Finances', dates: '2001 – 2002', role: 'Ministre dans le gouvernement de Jean-Bertrand Aristide.' },
      ],
    },
    en: {
      blurb: 'Accountant, former interim president (2016–2017), former Senate president and former senator for Nippes. Preliminary presidential registration, political structure: AYITI TRANSFOME. Final approval is pending CEP verification.',
      education: ['Accountant (training: institution and details not yet documented)'],
      career: ['Accountant', 'General Tax Directorate (DGI), 1979–1999'],
      positions: [
        { office: 'Interim President of the Republic', dates: '14 February 2016 – 7 February 2017', role: 'Elected by the National Assembly pending the 2015 election runoff. Successor: Jovenel Moïse.' },
        { office: 'President of the Senate', dates: '14 January 2016 – 14 February 2016', role: 'Presided over the Senate.' },
        { office: 'Senator for Nippes', dates: '6 April 2011 – 14 January 2016', role: 'Represented the Nippes department in the Senate.' },
        { office: 'Minister of the Interior and Territorial Collectivities', dates: '2002 – 2004', role: 'Minister in Jean-Bertrand Aristide’s government.' },
        { office: 'Minister of Economy and Finance', dates: '2001 – 2002', role: 'Minister in Jean-Bertrand Aristide’s government.' },
      ],
    },
  },
  'claude-joseph': {
    fr: {
      blurb: 'Ancien Premier ministre par intérim (2021) et ancien ministre des Affaires étrangères (2020–2021). Inscription préliminaire à la présidentielle, structure politique : EDE. L’approbation finale est en attente de la vérification du CEP.',
      education: ['Doctorat en politiques publiques — The New School (New York)', 'Master en administration publique (MPA) — Long Island University'],
      career: ['Professeur d’université aux États-Unis : University of Connecticut et Long Island University'],
      positions: [
        { office: 'Premier ministre par intérim', dates: '14 avril 2021 – 20 juillet 2021', role: 'Nommé par le président Jovenel Moïse. Successeur : Ariel Henry.' },
        { office: 'Ministre des Affaires étrangères et des Cultes', dates: '4 mars 2020 – novembre 2021', role: 'Ministre dans le gouvernement de Joseph Jouthe, puis dans celui d’Ariel Henry. Successeur : Jean Victor Généus.' },
      ],
    },
    en: {
      blurb: 'Former interim Prime Minister (2021) and former Minister of Foreign Affairs (2020–2021). Preliminary presidential registration, political structure: EDE. Final approval is pending CEP verification.',
      education: ['PhD in public policy — The New School (New York)', 'Master of Public Administration (MPA) — Long Island University'],
      career: ['University professor in the United States: University of Connecticut and Long Island University'],
      positions: [
        { office: 'Interim Prime Minister', dates: '14 April 2021 – 20 July 2021', role: 'Appointed by President Jovenel Moïse. Successor: Ariel Henry.' },
        { office: 'Minister of Foreign Affairs and Worship', dates: '4 March 2020 – November 2021', role: 'Minister in Joseph Jouthe’s government, then in Ariel Henry’s. Successor: Jean Victor Généus.' },
      ],
    },
  },
  'deus-deronneth': {
    fr: {
      blurb: 'Économiste et ancien député de Marigot (2016–2020). Inscription préliminaire à la présidentielle, structure politique : DVNH. L’approbation finale est en attente de la vérification du CEP.',
      education: [
        'Doctorant en sciences économiques',
        'Diplômé de l’École nationale d’administration financière (ENAF)',
        'Maîtrise en administration publique et gouvernance — Université des Antilles et de la Guyane (UAG)',
        'Maîtrise en affaires et marchés — UAG',
      ],
      career: [
        'Économiste, expert en gouvernance et consultant indépendant',
        'Professeur d’université',
        'Fondateur de l’Institut de gestion, de gouvernance et des études politiques (IGGEP), 2020',
      ],
      positions: [
        { office: 'Député de la circonscription de Marigot', dates: '50e législature (2016–2020)', role: 'Représente la circonscription de Marigot à la Chambre des députés.' },
        { office: 'Directeur départemental des impôts (DGI) du Sud-Est', dates: 'Dates pas encore documentées', role: 'Directeur départemental de l’administration fiscale dans le département du Sud-Est.' },
      ],
    },
    en: {
      blurb: 'Economist and former deputy for Marigot (2016–2020). Preliminary presidential registration, political structure: DVNH. Final approval is pending CEP verification.',
      education: [
        'Doctoral student in economics',
        'Graduate of the National School of Financial Administration (ENAF)',
        'Master’s in Public Administration and Governance — Université des Antilles et de la Guyane (UAG)',
        'Master’s in Business and Markets — UAG',
      ],
      career: [
        'Economist, governance expert and independent consultant',
        'University professor',
        'Founder of the Institute of Management, Governance and Political Studies (IGGEP), 2020',
      ],
      positions: [
        { office: 'Deputy for the Marigot constituency', dates: '50th legislature (2016–2020)', role: 'Represented the Marigot constituency in the Chamber of Deputies.' },
        { office: 'Departmental Director of Taxes (DGI), Sud-Est', dates: 'Dates not yet documented', role: 'Departmental director of the tax administration in the Sud-Est department.' },
      ],
    },
  },
  'moise-durocher': {
    fr: {
      blurb: 'Docteur en mathématiques et professeur d’université. Selon NAGO.TV, SOL AYITI (une coalition de onze partis) l’a désigné candidat à l’issue d’une primaire le 21 septembre 2026. Inscription préliminaire à la présidentielle. L’approbation finale est en attente de la vérification du CEP.',
      education: ['Doctorat en mathématiques (établissement pas encore documenté)'],
      career: ['Docteur en mathématiques', 'Professeur dans plusieurs universités privées de Port-au-Prince et à la Faculté des sciences de l’Université d’État d’Haïti (UEH)'],
      positions: [{ office: 'Fonctionnaire de l’administration du Palais national', dates: 'Environ 15 ans (dates exactes pas encore documentées)', role: 'Intitulé exact du poste et responsabilités pas encore documentés.' }],
      sourceLabels: ['CEP — Statistiques d’enregistrement des candidats', 'NAGO.TV (d’après Vant Bèf Info) — SOL AYITI désigne le Dr Moïse Durocher candidat à la présidence, 26 septembre 2026'],
    },
    en: {
      blurb: 'Doctor of mathematics and university professor. According to NAGO.TV, SOL AYITI (a coalition of eleven parties) designated him its candidate after a September 21, 2026 primary. Preliminary presidential registration. Final approval is pending CEP verification.',
      education: ['Doctorate in mathematics (institution not yet documented)'],
      career: ['Doctor of mathematics', 'Professor at several private universities in Port-au-Prince and at the Faculty of Sciences of the State University of Haiti (UEH)'],
      positions: [{ office: 'Official in the National Palace administration', dates: 'About 15 years (exact dates not yet documented)', role: 'Exact title and responsibilities not yet documented.' }],
      sourceLabels: ['CEP — Candidate registration statistics', 'NAGO.TV (via Vant Bèf Info) — SOL AYITI designates Dr. Moïse Durocher as presidential candidate, September 26, 2026'],
    },
  },
  'gandhy-dorfeuille': {
    fr: {
      blurb: 'Ancien député de Saint-Louis-du-Sud et ancien questeur de la Chambre des députés. Président du parti Ansanm Nou Fò. Inscription préliminaire à la présidentielle, structure politique : ANF. L’approbation finale est en attente de la vérification du CEP.',
      career: ['Président et dirigeant du parti politique Ansanm Nou Fò'],
      positions: [
        { office: 'Député de Saint-Louis-du-Sud', dates: '49e et 50e législatures (dates exactes pas encore documentées)', role: 'Représente Saint-Louis-du-Sud à la Chambre des députés.' },
        { office: 'Questeur de la Chambre des députés', dates: 'Depuis janvier 2019 (date de fin pas encore documentée)', role: 'Poste au bureau de la Chambre des députés. Responsabilités exactes pas encore documentées.' },
      ],
    },
    en: {
      blurb: 'Former deputy for Saint-Louis-du-Sud and former quaestor of the Chamber of Deputies. President of the Ansanm Nou Fò party. Preliminary presidential registration, political structure: ANF. Final approval is pending CEP verification.',
      career: ['President and leader of the Ansanm Nou Fò political party'],
      positions: [
        { office: 'Deputy for Saint-Louis-du-Sud', dates: '49th and 50th legislatures (exact dates not yet documented)', role: 'Represented Saint-Louis-du-Sud in the Chamber of Deputies.' },
        { office: 'Quaestor of the Chamber of Deputies', dates: 'From January 2019 (end date not yet documented)', role: 'A post on the Chamber of Deputies’ bureau. Exact responsibilities not yet documented.' },
      ],
    },
  },
  'maxo-joseph': {
    fr: {
      blurb: 'Pasteur, fondateur du parti VIHAMO et ancien candidat à la présidentielle de 2016. Selon un article du 24 septembre 2026, il s’engage à « rétablir l’autorité de l’État ». Inscription préliminaire à la présidentielle, structure politique : RCH (Réveil des Citoyens Haïtiens). L’approbation finale est en attente de la vérification du CEP.',
      career: ['Pasteur', 'Fondateur du parti Vision pour Haïti et le Monde (VIHAMO)', 'A été candidat à la présidentielle de 2016 sous la bannière Rendez-vous'],
    },
    en: {
      blurb: 'Pastor, founder of the VIHAMO party and former 2016 presidential candidate. According to a September 24, 2026 article, he pledges to “restore State authority”. Preliminary presidential registration, political structure: RCH (Réveil des Citoyens Haïtiens). Final approval is pending CEP verification.',
      career: ['Pastor', 'Founder of the Vision pour Haïti et le Monde (VIHAMO) party', 'Ran for president in 2016 under the Rendez-vous banner'],
    },
  },
  'wilson-jeudy': {
    fr: { positions: [{ office: 'Maire de Delmas (ancien)', dates: 'Dates pas encore documentées', role: 'Ancien maire de la commune de Delmas. Détails et sources pas encore ajoutés.' }] },
    en: { positions: [{ office: 'Mayor of Delmas (former)', dates: 'Dates not yet documented', role: 'Former mayor of the commune of Delmas. Details and sources not yet added.' }] },
  },
  'gary-bodeau': {
    fr: {
      blurb: 'Ancien président de la Chambre des députés (2018–2020) et ancien député de l’Ouest. Inscription préliminaire à la présidentielle, structure politique : P.R. L’approbation finale est en attente de la vérification du CEP.',
      positions: [
        { office: 'Président de la Chambre des députés', dates: '10 janvier 2018 – 13 janvier 2020', role: 'Préside la Chambre des députés. Prédécesseur : Cholzer Chancy.' },
        { office: 'Député du département de l’Ouest', dates: '11 janvier 2016 – 13 janvier 2020', role: 'Représente le département de l’Ouest à la Chambre des députés.' },
      ],
      publicRecord: [
        {
          issuer: 'Département du Trésor des États-Unis (OFAC)',
          summary: 'Le Département du Trésor des États-Unis a imposé des sanctions à son encontre en vertu du décret exécutif 13818, l’accusant d’avoir participé à des schémas de corruption. Le document du Trésor affirme qu’en 2018 et 2019 il aurait recouru à des paiements pour influencer des votes sur des nominations ministérielles. Il s’agit d’allégations du Trésor, et non d’un jugement.',
          limits: 'Décision administrative américaine, et non condamnation judiciaire. Aucune information sur une procédure devant un tribunal.',
          sourceLabel: 'Trésor des États-Unis — sanctions contre l’ancien président de la Chambre des députés (5 avril 2023)',
        },
      ],
    },
    en: {
      blurb: 'Former President of the Chamber of Deputies (2018–2020) and former deputy for Ouest. Preliminary presidential registration, political structure: P.R. Final approval is pending CEP verification.',
      positions: [
        { office: 'President of the Chamber of Deputies', dates: '10 January 2018 – 13 January 2020', role: 'Presided over the Chamber of Deputies. Predecessor: Cholzer Chancy.' },
        { office: 'Deputy for the Ouest department', dates: '11 January 2016 – 13 January 2020', role: 'Represented the Ouest department in the Chamber of Deputies.' },
      ],
      publicRecord: [
        {
          issuer: 'U.S. Department of the Treasury (OFAC)',
          summary: 'The U.S. Department of the Treasury imposed sanctions on him under Executive Order 13818, stating he took part in corruption schemes. The Treasury document says that in 2018 and 2019 he used payments to influence votes on ministerial appointments. These are the Treasury’s allegations, not a court judgment.',
          limits: 'A U.S. administrative decision, not a court conviction. No information about court proceedings.',
          sourceLabel: 'U.S. Treasury — sanctions on former President of the Chamber of Deputies (April 5, 2023)',
        },
      ],
    },
  },
  'wilner-joseph': {
    fr: {
      blurb: 'Ancien secrétaire d’État à la Population sous le président Jovenel Moïse. Selon un article du 29 septembre 2026, il se présente comme le candidat de la « réconciliation nationale ». Inscription préliminaire à la présidentielle, structure politique : VIKTWA. L’approbation finale est en attente de la vérification du CEP.',
      career: ['A été candidat à la députation dans la 3e circonscription de Port-au-Prince (élections de 2016, plateforme Verite)'],
      positions: [{ office: 'Secrétaire d’État à la Population (ancien)', dates: 'Dates pas encore documentées', role: 'Dans l’administration du président Jovenel Moïse.' }],
    },
    en: {
      blurb: 'Former Secretary of State for Population under President Jovenel Moïse. According to a September 29, 2026 article, he presents himself as the “national reconciliation” candidate. Preliminary presidential registration, political structure: VIKTWA. Final approval is pending CEP verification.',
      career: ['Ran for deputy in Port-au-Prince’s 3rd constituency (2016 elections, Verite platform)'],
      positions: [{ office: 'Secretary of State for Population (former)', dates: 'Dates not yet documented', role: 'In President Jovenel Moïse’s administration.' }],
    },
  },
  'munir-joseph-mourra': {
    fr: {
      blurb: 'Président de la Mobilisation pour le Progrès d’Haïti (MPH), selon le site du parti. Inscription préliminaire à la présidentielle. L’approbation finale est en attente de la vérification du CEP.',
      career: ['Président de la Mobilisation pour le Progrès d’Haïti (MPH) — selon le site officiel du parti, date non précisée'],
      officialLinks: ['MPH — page des candidats (site du parti)', 'MPH — Manifeste 2026 (PDF, du parti)', 'MPH sur Facebook', 'MPH sur X', 'MPH sur Instagram', 'MPH sur YouTube'],
      sourceLabels: ['CEP — Statistiques d’enregistrement des candidats', 'MPH — page des candidats (site du parti, source non indépendante)'],
    },
    en: {
      blurb: 'President of the Mobilisation pour le Progrès d’Haïti (MPH), according to the party’s website. Preliminary presidential registration. Final approval is pending CEP verification.',
      career: ['President of the Mobilisation pour le Progrès d’Haïti (MPH) — according to the party’s official site, date not specified'],
      officialLinks: ['MPH — candidates page (party website)', 'MPH — 2026 Manifesto (PDF, from the party)', 'MPH on Facebook', 'MPH on X', 'MPH on Instagram', 'MPH on YouTube'],
      sourceLabels: ['CEP — Candidate registration statistics', 'MPH — candidates page (party website, not an independent source)'],
    },
  },
}

const cepSourceLabel: Record<Lang, string> = {
  ht: 'CEP — Statistiques enregistrement des candidats',
  fr: 'CEP — Statistiques d’enregistrement des candidats',
  en: 'CEP — Candidate registration statistics',
}

function genericBlurb(c: Candidate, lang: Lang) {
  const t = dict[lang]
  const office = t.offices[c.officeKey]
  const pos = c.position ? (t.positions[c.position] ?? c.position) : ''
  const where = [c.locality, c.department].filter(Boolean).join(', ')
  const head = lang === 'ht' ? 'Enskripsyon prelimine pou' : lang === 'fr' ? 'Inscription préliminaire —' : 'Preliminary registration —'
  const mid = lang === 'ht' ? ', estrikti politik:' : lang === 'fr' ? ', structure politique :' : ', political structure:'
  const tail =
    lang === 'ht' ? 'Apwobasyon final la ap tann verifikasyon CEP.' : lang === 'fr' ? 'Approbation finale en attente de la vérification du CEP.' : 'Final approval pending CEP verification.'
  const officeText = lang === 'ht' ? office.toLowerCase() : office
  return `${head} ${officeText}${pos ? ` (${pos})` : ''}${where ? ` · ${where}` : ''}${mid} ${c.affiliation}. ${tail}`
}

export function localizeCandidate(c: Candidate, lang: Lang): Candidate {
  const t = dict[lang]
  const base: Candidate = {
    ...c,
    office: t.offices[c.officeKey],
    position: c.position ? (t.positions[c.position] ?? c.position) : undefined,
    photoCredit: c.photoCredit === PHOTO_CREDIT_PENDING ? photoCreditPending[lang] : c.photoCredit,
    statusSource: { ...c.statusSource, label: cepSourceLabel[lang] },
    sources: c.sources.map((s) => (s.url === c.statusSource.url ? { ...s, label: cepSourceLabel[lang] } : s)),
  }
  const o = lang === 'ht' ? undefined : candidateTranslations[c.slug]?.[lang]
  const out: Candidate = { ...base, blurb: o?.blurb ?? c.blurb ?? genericBlurb(c, lang) }
  if (!o) return out
  if (o.education) out.education = o.education
  if (o.career) out.career = o.career
  if (o.positions) out.positions = o.positions
  if (o.officialLinks && c.officialLinks) out.officialLinks = c.officialLinks.map((l, i) => ({ ...l, label: o.officialLinks![i] ?? l.label }))
  if (o.sourceLabels) out.sources = c.sources.map((s, i) => ({ ...s, label: o.sourceLabels![i] ?? s.label }))
  if (o.publicRecord && c.publicRecord) {
    out.publicRecord = c.publicRecord.map((e, i) => {
      const x = o.publicRecord![i]
      return x ? { ...e, issuer: x.issuer, summary: x.summary, limits: x.limits, source: { ...e.source, label: x.sourceLabel } } : e
    })
  }
  return out
}

const articleTranslations: Record<string, Partial<Record<Exclude<Lang, 'ht'>, Pick<Article, 'title' | 'excerpt' | 'body'>>>> = {
  'diferans-anonse-ak-apwouve': {
    fr: {
      title: 'Annoncer sa candidature n’est pas être candidat approuvé : quelle différence ?',
      excerpt: 'Quelqu’un peut dire publiquement qu’il sera candidat sans que son dossier ne soit jamais approuvé. Voici les trois étapes que nous utilisons pour marquer chaque profil.',
      body: [
        'Sur les réseaux sociaux, beaucoup de personnes se présentent comme candidates. Cela ne veut pas dire que les autorités électorales ont approuvé leur candidature.',
        'Chez SoveAyiti, nous marquons chaque candidat avec l’un de ces trois statuts : Annoncée (la personne dit publiquement qu’elle sera candidate), Dossier déposé (elle a présenté son dossier) et Officiellement approuvée (les autorités compétentes confirment la candidature).',
        'Chaque statut a une date et une source. Si nous n’avons pas de source, nous ne changeons pas le statut.',
      ],
    },
    en: {
      title: 'Announcing a candidacy ≠ approved candidate: what’s the difference?',
      excerpt: 'Someone can say publicly that they will run without their file ever being approved. Here are the three stages we use to label every profile.',
      body: [
        'On social media, many people present themselves as candidates. That does not mean the electoral authorities have approved their candidacy.',
        'At SoveAyiti, we label every candidate with one of three statuses: Announced (the person says publicly they are running), File submitted (they have presented their file) and Officially approved (the competent authorities confirm the candidacy).',
        'Each status has a date and a source. If we have no source, we do not change the status.',
      ],
    },
  },
  'kijan-nou-verifye-enfòmasyon': {
    fr: {
      title: 'Comment nous vérifions l’information avant de la publier',
      excerpt: 'Nos règles éditoriales, en langage simple : sources, dates, corrections, et ce que nous refusons de publier.',
      body: [
        'Chaque fiche de profil a ses sources, la date de sa dernière révision et une section de corrections visible.',
        'Quand nous ne trouvons pas un document, nous le disons clairement : « Relevé de vote individuel non localisé. » Le fait qu’une loi soit adoptée ne montre pas comment chaque parlementaire a voté.',
        'Nous ne publions pas d’allégations. Chaque candidat reçoit le même questionnaire, le même délai et le même espace. Les réponses sont présentées comme des déclarations attribuées, et non comme des faits vérifiés.',
        'Si vous voyez une erreur, écrivez-nous. Nous la corrigeons publiquement.',
      ],
    },
    en: {
      title: 'How we verify information before publishing it',
      excerpt: 'Our editorial rules in plain language: sources, dates, corrections, and what we refuse to publish.',
      body: [
        'Every profile page has its sources, the date of its last review and a visible corrections section.',
        'When we cannot find a document, we say so clearly: “Individual voting record not located.” A law passing does not show how each legislator voted.',
        'We do not publish allegations. Every candidate receives the same questionnaire, the same deadline and the same space. Answers are presented as attributed statements, not as verified facts.',
        'If you see an error, write to us. We correct it publicly.',
      ],
    },
  },
  'kisa-sena-fè': {
    fr: {
      title: 'Ce que fait un sénateur, en 5 minutes',
      excerpt: 'Le rôle du Sénat dans le système politique haïtien et ce qu’il faut chercher dans le parcours d’un ancien sénateur.',
      body: [
        'Le Sénat est l’une des deux chambres du Parlement. Il vote les lois, contrôle l’exécutif et participe à certaines nominations.',
        'Pour juger un ancien sénateur, cherchez ses votes individuels, les projets de loi qu’il a déposés et son travail en commission — pas seulement ce qu’il dit pendant la campagne.',
        'Note : cet article est un modèle. Vérifiez-le avec les textes officiels avant de le publier.',
      ],
    },
    en: {
      title: 'What a senator does, in 5 minutes',
      excerpt: 'The Senate’s role in Haiti’s political system and what to look for in a former senator’s record.',
      body: [
        'The Senate is one of the two chambers of Parliament. It votes on laws, oversees the executive and takes part in certain appointments.',
        'To judge a former senator, look for their individual votes, the bills they filed and their committee work — not only what they say during the campaign.',
        'Note: this article is a template. Verify it against official texts before publishing.',
      ],
    },
  },
  'atis-ayisyen-pou-konnen': {
    fr: {
      title: 'Modèle : portrait d’artiste (culture)',
      excerpt: 'Un espace pour votre premier article culture. Musique, cinéma, littérature, cuisine, mode.',
      body: ['Remplacez ce texte par le premier article original.'],
    },
    en: {
      title: 'Template: artist profile (culture)',
      excerpt: 'A space for your first culture article. Music, film, literature, food, fashion.',
      body: ['Replace this text with the first original article.'],
    },
  },
  'foutbòl-analiz-modèl': {
    fr: {
      title: 'Modèle : analyse de football (sports)',
      excerpt: 'Un espace pour des commentaires originaux, des histoires du sport local et des portraits de joueurs.',
      body: ['Remplacez ce texte par le premier article original.'],
    },
    en: {
      title: 'Template: football analysis (sports)',
      excerpt: 'A space for original commentary, local sports stories and player profiles.',
      body: ['Replace this text with the first original article.'],
    },
  },
}

const authors: Record<Lang, string> = { ht: 'Redaksyon SoveAyiti', fr: 'Rédaction SoveAyiti', en: 'SoveAyiti Editorial Team' }

export function localizeArticle(a: Article, lang: Lang): Article {
  const author = a.author === 'Redaksyon SoveAyiti' ? authors[lang] : a.author
  if (lang === 'ht') return { ...a, author }
  const tr = articleTranslations[a.slug]?.[lang]
  // The French subtitle is only shown on the Creole version.
  return { ...a, ...tr, author, titleFr: undefined }
}
