import type { Article, Category } from '@/types'

export const categoryLabels: Record<Category, { ht: string; fr: string; href: string }> = {
  election: { ht: 'Eleksyon', fr: 'Élections', href: '/kandida' },
  explainer: { ht: 'Kijan gouvènman an mache', fr: 'Comment fonctionne l’État', href: '/eksplike' },
  records: { ht: 'Dokiman piblik', fr: 'Documents publics', href: '/eksplike' },
  culture: { ht: 'Kilti', fr: 'Culture', href: '/kilti' },
  sports: { ht: 'Espò', fr: 'Sports', href: '/espo' },
}

// Starter pieces: structural explainers and editorial notes that make no claim about any
// living person. Replace/extend with real reporting; newest first is handled by sorting.
export const articles: Article[] = [
  {
    slug: 'diferans-anonse-ak-apwouve',
    title: 'Anonse yon kandidati ≠ kandida apwouve: ki diferans lan?',
    titleFr: 'Annoncer sa candidature n’est pas être candidat approuvé : quelle différence ?',
    category: 'explainer',
    date: '2026-10-06',
    author: 'Redaksyon SoveAyiti',
    excerpt: 'Yon moun ka di piblikman li pral kandida san dosye l pa janm apwouve. Men twa etap nou itilize pou make chak pwofil.',
    body: [
      'Sou rezo sosyal, anpil moun prezante tèt yo kòm kandida. Sa pa vle di otorite elektoral yo apwouve kandidati yo.',
      'Nan SoveAyiti, nou make chak kandida ak youn nan twa estati: Anonse (moun nan di piblikman li ap kandida), Dosye depoze (li prezante dosye l), ak Apwouve ofisyèlman (otorite konpetan yo konfime kandidati a).',
      'Chak estati gen yon dat ak yon sous. Si nou pa gen sous, nou pa chanje estati a.',
    ],
  },
  {
    slug: 'kijan-nou-verifye-enfòmasyon',
    title: 'Kijan nou verifye enfòmasyon anvan nou pibliye l',
    titleFr: 'Comment nous vérifions l’information avant de la publier',
    category: 'explainer',
    date: '2026-10-06',
    author: 'Redaksyon SoveAyiti',
    excerpt: 'Règ editoryal nou yo, nan lang senp: sous, dat, koreksyon, ak sa nou refize pibliye.',
    body: [
      'Chak fèy pwofil gen sous li yo, dat dènye revizyon an, ak yon seksyon koreksyon ki vizib.',
      'Lè nou pa jwenn yon dokiman, nou di sa klèman: « Rekò vòt endividyèl pa jwenn. » Yon lwa ki pase pa montre kijan chak sèlman te vote.',
      'Nou pa pibliye alegasyon. Chak kandida resevwa menm kesyonè a, menm delè ak menm espas. Repons yo make kòm deklarasyon atribiye, pa kòm fè verifye.',
      'Si ou wè yon erè, ekri nou. Nou korije l piblikman.',
    ],
  },
  {
    slug: 'kisa-sena-fè',
    title: 'Kisa yon senatè fè, an 5 minit',
    titleFr: 'Ce que fait un sénateur, en 5 minutes',
    category: 'explainer',
    date: '2026-10-05',
    author: 'Redaksyon SoveAyiti',
    excerpt: 'Wòl Sena a nan sistèm politik ayisyen an ak sa pou chèche nan rekò yon ansyen senatè.',
    body: [
      'Sena a se youn nan de chanm Palman an. Li vote lwa, li kontwole egzekitif la, epi li patisipe nan sèten nominasyon.',
      'Pou jije yon ansyen senatè, chèche vòt endividyèl li yo, pwojè lwa li depoze, ak travay li nan komisyon yo — pa sèlman sa li di nan kanpay.',
      'Nòt: atik sa a se yon modèl. Verifye ak tèks ofisyèl yo anvan ou pibliye l.',
    ],
  },
  {
    slug: 'atis-ayisyen-pou-konnen',
    title: 'Modèl: pòtrè atis (kilti)',
    category: 'culture',
    date: '2026-10-04',
    author: 'Redaksyon SoveAyiti',
    excerpt: 'Espas pou premye atik kilti ou. Mizik, sinema, literati, kwizin, mòd.',
    body: ['Ranplase tèks sa a ak premye atik orijinal la.'],
  },
  {
    slug: 'foutbòl-analiz-modèl',
    title: 'Modèl: analiz foutbòl (espò)',
    category: 'sports',
    date: '2026-10-03',
    author: 'Redaksyon SoveAyiti',
    excerpt: 'Espas pou kòmantè orijinal, istwa espò lokal, ak pòtrè jwè.',
    body: ['Ranplase tèks sa a ak premye atik orijinal la.'],
  },
]

export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date))
export const byCategory = (c: Category) => sortedArticles.filter((a) => a.category === c)
