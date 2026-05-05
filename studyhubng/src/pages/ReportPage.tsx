import { Mail, MessageSquareWarning, ArrowRight } from 'lucide-react'

export function ReportPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-rose-500/10 p-4 text-rose-400 border border-rose-500/20">
              <MessageSquareWarning className="h-8 w-8" />
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Report an Issue</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Found a bug, an incorrect question, or have a suggestion to improve StudyHub NG? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-8 shadow-xl shadow-black/20 text-center">
        <div className="mx-auto max-w-lg space-y-6">
          <p className="text-lg text-slate-300">
            Please send all your reports, feedback, and inquiries directly to our support email. We aim to respond to all emails within 24-48 hours.
          </p>

          <a 
            href="mailto:eniolaoyebamiji100@gmail.com" 
            className="group inline-flex w-full items-center justify-center gap-3 rounded-[24px] bg-blue-600 p-6 font-semibold text-white shadow-xl shadow-blue-950/50 transition hover:bg-blue-500 hover:-translate-y-1"
          >
            <Mail className="h-6 w-6" />
            <span className="text-xl tracking-wide">eniolaoyebamiji100@gmail.com</span>
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </a>

          <div className="mt-8 rounded-2xl bg-slate-950/50 p-6 text-left border border-slate-800">
            <h3 className="font-semibold text-white mb-2">When reporting a question issue, please include:</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
              <li>The Subject and Topic of the question</li>
              <li>A brief snippet of the question text</li>
              <li>Why you believe the answer is incorrect</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
