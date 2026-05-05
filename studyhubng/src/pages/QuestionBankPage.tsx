import { Question } from '../types'
import { Search, Loader2, CheckCircle2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { SelectField } from '../components/SelectField'
import { EmptyStateCard } from '../components/EmptyStateCard'
import { MetricPill } from '../components/MetricPill'
import { getSubjectColor } from '../utils/theme'

type QuestionBankPageProps = {
  loading: boolean
  questions: Question[]
  subjectFilter: string
  difficultyFilter: string
  truthScore: number
  subjects: string[]
  onSubjectChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onTruthScoreChange: (value: number) => void
  onOpenQuestion: (id: string) => void
}

export function QuestionBankPage({
  loading,
  questions,
  subjectFilter,
  difficultyFilter,
  truthScore,
  subjects,
  onSubjectChange,
  onDifficultyChange,
  onTruthScoreChange,
  onOpenQuestion,
}: QuestionBankPageProps) {
  // Search is fully local — no parent sync to avoid cut/reset bug
  const [search, setSearch] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  // Derived: split into active and practiced
  const { active, practiced } = useMemo(() => {
    const q = search.trim().toLowerCase()
    const matches = (question: Question) => {
      if (!q) return true
      return (
        question.question.toLowerCase().includes(q) ||
        question.subject.toLowerCase().includes(q) ||
        question.topic.toLowerCase().includes(q) ||
        question.examType.toLowerCase().includes(q)
      )
    }

    const filtered = questions.filter(matches)
    return {
      active: filtered.filter((q) => !q.practiced),
      practiced: filtered.filter((q) => q.practiced),
    }
  }, [questions, search])

  if (loading) {
    return <QuestionBankSkeleton />
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Question Bank</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Practice with trusted university-level questions.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Search by keyword, narrow by course area and difficulty, and use the Truth Score slider to focus on the most reliable campus-ready practice items.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-blue-900/40 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
              <span className="font-semibold text-white">{active.length}</span> to practice
            </div>
            {practiced.length > 0 && (
              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/30 px-4 py-3 text-sm text-slate-400">
                <span className="font-semibold text-emerald-300">{practiced.length}</span> completed
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="relative block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Search questions</span>
            <Search className="pointer-events-none absolute left-4 top-[3.2rem] h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course, topic, or phrase"
              className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            />
          </label>

          <SelectField label="Subject" value={subjectFilter} onChange={onSubjectChange} options={subjects} />
          <SelectField label="Difficulty" value={difficultyFilter} onChange={onDifficultyChange} options={['All', 'Easy', 'Medium', 'Hard']} />
        </div>

        <div className="mt-6 rounded-[28px] bg-slate-950/70 p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">Truth Score threshold</span>
            <span className="rounded-full bg-blue-600/15 px-3 py-1 font-semibold text-blue-200 shadow-sm">{truthScore}% and above</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={truthScore}
            onChange={(event) => onTruthScoreChange(Number(event.target.value))}
            className="w-full accent-blue-500"
            aria-label="Filter by Truth Score"
          />
        </div>
      </section>

      {/* Active Questions */}
      {active.length === 0 && practiced.length === 0 ? (
        <EmptyStateCard
          title="No questions match your filters"
          description="Try lowering the Truth Score threshold or broadening your search terms to reveal more university questions."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch('')
            onSubjectChange('All')
            onDifficultyChange('All')
            onTruthScoreChange(0)
          }}
        />
      ) : (
        <>
          {active.length > 0 && (
            <section className="grid gap-4">
              {active.map((question) => (
                <QuestionCard key={question.id} question={question} onOpen={onOpenQuestion} />
              ))}
            </section>
          )}

          {/* Completed Questions Section */}
          {practiced.length > 0 && (
            <section className="rounded-[32px] border border-emerald-900/30 bg-emerald-950/10 shadow-xl shadow-black/10">
              <button
                type="button"
                onClick={() => setShowCompleted((v) => !v)}
                className="flex w-full items-center justify-between p-6 text-left sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">Completed Questions</h2>
                    <p className="text-sm text-slate-400">{practiced.length} question{practiced.length === 1 ? '' : 's'} already practiced</p>
                  </div>
                </div>
                {showCompleted ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {showCompleted && (
                <div className="grid gap-4 px-6 pb-8 sm:px-8">
                  {practiced.map((question) => (
                    <QuestionCard key={question.id} question={question} onOpen={onOpenQuestion} completed />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}

function QuestionCard({ question, onOpen, completed = false }: { question: Question; onOpen: (id: string) => void; completed?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(question.id)}
      className={`rounded-[28px] border p-5 text-left shadow-xl transition hover:-translate-y-0.5 ${
        completed
          ? 'border-emerald-900/30 bg-slate-900/60 opacity-75 hover:opacity-100 shadow-black/10 hover:shadow-emerald-950/20'
          : 'border-blue-900/50 bg-slate-900/80 shadow-black/10 hover:shadow-blue-950/20'
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span className={`px-2.5 py-1 rounded-full border ${getSubjectColor(question.subject)}`}>
              {question.subject}
            </span>
            <span>•</span>
            <span className="text-slate-300">{question.topic}</span>
            <span>•</span>
            <span>{question.examType}</span>
            {completed && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Practiced
                </span>
              </>
            )}
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{question.question}</h3>
          {question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:min-w-60 sm:grid-cols-3 lg:grid-cols-1">
          <MetricPill label="Truth Score" value={`${question.truthScore}%`} tone="indigo" />
          <MetricPill label="Success Rate" value={`${question.successRate}%`} tone="emerald" />
          <MetricPill label="Difficulty" value={question.difficulty} tone="slate" />
        </div>
      </div>
    </button>
  )
}

function QuestionBankSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
      <div className="h-56 rounded-[32px] bg-slate-900/80 shadow-xl shadow-black/20" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-40 rounded-[28px] bg-slate-900/80 shadow-xl shadow-black/20" />
      ))}
    </div>
  )
}
