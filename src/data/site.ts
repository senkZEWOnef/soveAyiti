// Central site settings. Fill in handles/URLs when the accounts exist;
// anything left empty is simply not rendered.
export const site = {
  name: 'SoveAyiti',
  frName: 'Sauver Haïti',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soveayiti.example',
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

// Update lastVerified whenever the electoral calendar is re-checked against official sources.
// The summary text itself is translated in src/i18n/dictionary.ts (electionNotice.*).
export const electionStatus = {
  lastVerified: '2026-10-07',
  source: { url: 'https://cephaiti.ht/prolongation-de-la-periode-dinscription-en-ligne-des-candidats-et-ajustement-de-certaines-echeances-du-processus-electoral/' },
  items: [] as { label: string; date: string; source: { label: string; url: string } }[],
}

// Master switch for the "Rekò piblik" section on candidate profiles. Entries can be stored as drafts in
// src/data/candidates.ts; nothing shows until this is true AND an entry is reviewStatus 'published'.
export const showPublicRecord = false
