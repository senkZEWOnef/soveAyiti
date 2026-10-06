// Central site settings. Fill in handles/URLs when the accounts exist;
// anything left empty is simply not rendered.
export const site = {
  name: 'SoveAyiti',
  frName: 'Sauver Haïti',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soveayiti.example',
  tagline: 'Medya endepandan. Sous verifye. Pa gen sipò pou kandida.',
  independence: ['Medya endepandan', 'Sous verifye', 'Okenn sipò pou kandida'],
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
    whatsapp: '',
    youtube: '',
  },
  // Where forms are posted (e.g. a Formspree/Getform URL). No personal inbox is exposed.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '',
}

// Update this whenever the electoral calendar is re-checked against official sources.
export const electionStatus = {
  lastVerified: '2026-10-06',
  summary:
    'Kalandriye elektoral la ap chanje. Nou pa afiche dat final tankou yon konte a rebou: nou make chak dat ak dènye jou nou verifye l.',
  summaryFr:
    "Le calendrier électoral est en cours de révision. Nous n'affichons pas de compte à rebours : chaque date indique sa dernière vérification.",
  items: [] as { label: string; date: string; source: { label: string; url: string } }[],
}

export const questionOfTheWeek = 'Ki sa ou ta renmen nou eksplike pou ou semèn sa a?'
