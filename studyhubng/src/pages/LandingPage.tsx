import { BarChart3, BookOpen, Briefcase, FileQuestion, LayoutDashboard, Sparkles } from 'lucide-react'
import { FeatureCard } from '../components/FeatureCard'

type LandingPageProps = {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-blue-900/50 bg-slate-900/80 shadow-2xl shadow-black/20">
        <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-800/60 bg-blue-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Production-ready campus learning platform
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Built for university students in Nigeria.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              StudyHub.ng helps undergraduates prepare for CBTs, semester exams, GST courses, and departmental assessments with a polished dark-blue SaaS experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Start learning now
              </button>
              <button
                type="button"
                onClick={onSignIn}
                className="rounded-full border border-blue-900/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-600 hover:bg-blue-950/40 hover:text-white"
              >
                I already have an account
              </button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['36 federal & state campuses', 'Aligned with common university learning patterns'],
                ['89%', 'Average trusted-question completion rate'],
                ['4.9/5', 'Student-rated campus study experience'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-blue-900/40 bg-slate-950/70 p-4">
                  <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <FeatureCard icon={LayoutDashboard} title="Student dashboard" description="Animated metrics, recent academic activity, and quick study actions for campus life." />
            <FeatureCard icon={FileQuestion} title="Question bank" description="Search, filter, and sort by course area, difficulty, and Truth Score confidence." />
            <FeatureCard icon={BarChart3} title="Analytics charts" description="Interactive-ready visual summaries of mastery, progress, and topic coverage." />
            <FeatureCard icon={Briefcase} title="Admin management" description="Upload, preview, edit, and delete department-level mock questions locally." />
          </div>
        </div>
      </section>
    </div>
  )
}
