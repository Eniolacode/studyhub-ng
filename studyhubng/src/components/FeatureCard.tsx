import { LucideIcon } from 'lucide-react'

export function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-blue-900/40 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950/70 text-blue-300 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  )
}
