# SoveAyiti (Sauver Haïti)

Independent Haitian media site: verified election information (candidate profiles, explainers),
plus culture and sports. Entirely free: no ads, donations, sales or paid features. Next.js 14 + Tailwind.

## Run
    npm install && npm run dev

## Edit content
- `src/data/site.ts` — name, social links, form endpoint, election-calendar status ("last verified")
- `src/data/candidates.ts` — candidate profiles (current entries are fictional templates; delete `isSample` when real)
- `src/data/articles.ts` — articles for Eksplike / Kilti / Espò

## Anonymity
No personal names, locations or author metadata are in the code. Forms post to `NEXT_PUBLIC_FORM_ENDPOINT`
(use a service that does not expose a personal inbox). Identity-related settings live in `src/data/site.ts`.
