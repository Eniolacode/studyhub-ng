import { motion } from 'framer-motion'
import { Target, CheckCircle, XCircle, Activity, LayoutDashboard } from 'lucide-react'
import { MetricPill } from '../components/MetricPill'
import { EmptyStateCard } from '../components/EmptyStateCard'

export function PerformancePage({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
          <div className="h-24 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
          <div className="h-24 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
        </div>
        <div className="h-96 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
      </div>
    )
  }

  if (data.totalAttempts === 0) {
    return (
      <EmptyStateCard
        title="No performance data yet"
        description="Start practicing questions in the Question Bank to see your performance metrics and recommendations here."
        actionLabel="Go to Question Bank"
        onAction={() => window.location.href = '/questions'}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Performance Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Track your mastery journey.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Review your past attempts, analyze your success rates across different courses, and watch your average Truth Score improve over time.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-900/40 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
            Total attempts: <span className="font-semibold text-white">{data.totalAttempts}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricPill label="Average Score" value={`${data.avgScore}%`} tone="emerald" />
        <MetricPill label="Questions Attempted" value={String(data.uniqueQuestionsAttempted)} tone="indigo" />
        <MetricPill label="Questions Mastered" value={String(data.questionsMastered)} tone="slate" />
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" /> Recent Attempts
        </h2>
        <div className="mt-6 overflow-hidden rounded-[24px] border border-blue-900/50 bg-slate-950/70">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-blue-900/50 text-slate-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Topic</th>
                <th className="px-5 py-4 font-semibold">Question ID</th>
                <th className="px-5 py-4 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/30">
              {data.recentAttempts.map((attempt: any) => (
                <tr key={attempt.id} className="transition hover:bg-white/5">
                  <td className="px-5 py-4">{attempt.date}</td>
                  <td className="px-5 py-4 font-medium text-white">{attempt.topic}</td>
                  <td className="px-5 py-4 text-slate-500">{attempt.questionId}</td>
                  <td className="px-5 py-4">
                    {attempt.passed ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        <CheckCircle className="h-3.5 w-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                        <XCircle className="h-3.5 w-3.5" /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" /> Topic Mastery Breakdown
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data?.topicStats && Object.entries(data.topicStats).map(([name, stats]: [string, any]) => {
            const successRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0
            return (
              <div key={name} className="rounded-3xl border border-blue-900/30 bg-slate-950/40 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-200">{name}</span>
                  <span className={`text-sm font-bold ${successRate >= 70 ? 'text-emerald-400' : successRate >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {successRate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    className={`h-full rounded-full ${successRate >= 70 ? 'bg-emerald-500' : successRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {stats.passed} mastered out of {stats.total} attempted
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-400" /> Recommendations
        </h2>
        <p className="mt-2 text-sm text-slate-400">Based on your recent performance, prioritize these topics:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.recommendations.map((rec: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-blue-600/10 border border-blue-600/20 px-5 py-4"
            >
              <p className="text-sm font-semibold text-blue-200">{rec}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
