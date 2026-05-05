import { FileQuestion } from 'lucide-react'

export function EmptyStateCard({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel: string; onAction: () => void }) {
  return (
    <section className="rounded-[32px] border border-dashed border-blue-900/50 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-slate-400">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500"
      >
        {actionLabel}
      </button>
    </section>
  )
}
