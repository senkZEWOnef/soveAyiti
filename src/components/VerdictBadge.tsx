import type { Verdict } from '@/data/claims'
import { getTools } from '@/i18n/tools'

const tone: Record<Verdict, string> = {
  true: 'bg-emerald-700 text-white',
  false: 'bg-flag-600 text-white',
  misleading: 'bg-amber-500 text-navy-900',
  unverified: 'bg-cream-300 text-navy-800',
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${tone[verdict]}`}>{getTools().verify.verdicts[verdict]}</span>
}
