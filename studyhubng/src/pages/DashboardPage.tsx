import { AppView, UserRole } from '../types'
import { TrendingUp, Star } from 'lucide-react'
import { motion } from 'framer-motion'

type DashboardPageProps = {
  currentUser: { name: string; email: string; role: UserRole }
  loading: boolean
  stats: { label: string; value: string; delta: string; icon: typeof TrendingUp }[]
  data: any
  onNavigate: (view: AppView) => void
}

const chartBars = [72, 81, 76, 89, 84, 93, 88]

export function DashboardPage({ currentUser, loading, stats, data, onNavigate }: DashboardPageProps) {
  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Welcome back, {currentUser.name.split(' ')[0]}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your semester momentum looks strong.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Review your latest academic performance, jump into trusted university practice questions, and stay prepared for upcoming CBTs and semester exams.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('question-bank')}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Continue practicing
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[28px] border border-blue-900/50 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-blue-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-cyan-300">{stat.delta}</p>
            </motion.div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">Weekly mastery trend</h2>
              <p className="mt-1 text-sm text-slate-400">Interactive-ready chart for your study consistency and course performance.</p>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">+9.4% this week</span>
          </div>
          <div className="flex h-72 items-end gap-3 rounded-[28px] bg-slate-950/70 p-5">
            {chartBars.map((bar, index) => (
              <div key={bar + index} className="flex flex-1 flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar}%` }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="w-full rounded-t-2xl bg-gradient-to-t from-blue-700 to-cyan-400"
                />
                <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold tracking-tight text-white">Topic coverage</h2>
            <div className="mt-6 space-y-4">
              {data?.topicStats && Object.keys(data.topicStats).length > 0 ? (
                Object.entries(data.topicStats).map(([name, stats]: [string, any], index) => (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">{name}</span>
                      <span className="text-slate-500">{stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-950/80">
                      <div className={`h-3 rounded-full bg-blue-500`} style={{ width: `${stats.total > 0 ? (stats.passed / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                ['GST', 'Engineering', 'Sciences'].map((name) => (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between text-sm opacity-30">
                      <span className="font-medium text-slate-300">{name}</span>
                      <span className="text-slate-500">0%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-950/80 opacity-30" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold tracking-tight text-white">Next best actions</h2>
            <div className="mt-4 space-y-3">
              {(data?.recommendations || ['Complete 10 GST reading drills', 'Review missed concepts']).map((task: string) => (
                <div key={task} className="flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                  <Star className="h-4 w-4 text-blue-300" />
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-[28px] bg-slate-900/80 shadow-xl shadow-black/20" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="h-96 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
        <div className="space-y-6">
          <div className="h-48 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
          <div className="h-48 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
        </div>
      </div>
    </div>
  )
}
