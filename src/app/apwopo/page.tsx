import type { Metadata } from 'next'
import { PageHeader, IndependenceBar } from '@/components/Shared'

export const metadata: Metadata = { title: 'Apwopo' }

const practices = [
  ['Dokimante enfòmasyon kandida yo', 'Nou kenbe sous pou pòs yo te okipe, fòmasyon, pwopozisyon, ak vòt endividyèl nan lejislati a.'],
  ['Separe fè, opinyon, ak deklarasyon kandida', 'Atribiye yon deklarasyon pa fè l vre. Nou make klèman kisa ki fè verifye ak kisa ki di pa kandida a.'],
  ['Sèvi ak sèlman sa nou gen dwa', 'Foto, mizik ak videyo foutbòl nou itilize se sa nou gen pèmisyon pou itilize. Bay kredi pou kont li pa se pèmisyon.'],
  ['Modere kòmantè yo menm jan pou tout moun', 'Nou aksepte kritik, men nou retire menas, enfòmasyon prive, ak akizasyon san prèv.'],
  ['Pibliye koreksyon', 'Nou bay yon fason senp pou kontakte nou ak pou konteste yon enfòmasyon ki pa egzat.'],
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Apwopo"
        title="Yon sous enfòmasyon endepandan pou ayisyen"
        subtitle="SoveAyiti (Sauver Haïti) se yon platfòm enfòmasyon endepandan ayisyen."
      />
      <div className="container-max section max-w-3xl">
        <div className="rounded-xl bg-navy-800 p-6 text-cream-50"><IndependenceBar /></div>

        <p className="mt-8 text-lg leading-relaxed text-navy-800">
          Fondatè ak editè SoveAyiti, yon platfòm enfòmasyon endepandan ayisyen.
        </p>
        <p className="mt-2 text-sm text-navy-500">
          Founder and editor of SoveAyiti, an independent Haitian information platform.
        </p>
        <p className="mt-6 leading-relaxed text-navy-700">
          Non an ka sanble yon mouvman politik. Li pa youn. Nou pa sipòte okenn kandida, okenn pati, okenn kanp.
          Misyon nou se fè enfòmasyon piblik fasil pou konprann, pou tcheke, ak pou diskite.
        </p>

        <h2 className="mt-12 text-2xl font-bold">Règ editoryal nou</h2>
        <ul className="mt-5 space-y-5">
          {practices.map(([t, d]) => (
            <li key={t} className="border-l-4 border-flag-500 pl-4">
              <h3 className="font-sans font-bold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy-700">{d}</p>
            </li>
          ))}
        </ul>

        <h2 id="koreksyon" className="mt-12 scroll-mt-24 text-2xl font-bold">Siyale yon erè</h2>
        <p className="mt-3 leading-relaxed text-navy-700">
          Si ou wè yon enfòmasyon ki pa egzat, voye l ban nou ak yon sous. Nou korije l epi nou make koreksyon an sou paj la.
        </p>
        <a href="/kontak" className="btn-outline mt-4">Voye yon koreksyon</a>

        <h2 id="kòmantè" className="mt-12 scroll-mt-24 text-2xl font-bold">Règ kòmantè yo</h2>
        <p className="mt-3 leading-relaxed text-navy-700">
          Dezakò pèmèt. Nou retire menas, doxxing (piblikasyon enfòmasyon prive), vòlè idantite, spam, ak akizasyon san prèv
          prezante kòm fè. Kòmantè yo toujou separe ak rapò editoryal nou an.
        </p>

        <p className="mt-12 text-xs text-navy-500">
          Enfòmasyon sou sit sa a se enfòmasyon jeneral, pa konsèy jiridik.
        </p>
      </div>
    </>
  )
}
