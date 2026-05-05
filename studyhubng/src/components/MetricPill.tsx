export function MetricPill({ label, value, tone }: { label: string; value: string; tone: 'indigo' | 'emerald' | 'slate' }) {
  const tones = {
    indigo: 'bg-blue-600/15 text-blue-200',
    emerald: 'bg-cyan-500/10 text-cyan-200',
    slate: 'bg-slate-950 text-slate-300',
  }

  return (
    <div className={`rounded-2xl px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  )
}
