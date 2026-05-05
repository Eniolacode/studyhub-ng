import { Question } from '../types'
import { ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import { MetricPill } from '../components/MetricPill'
import { getSubjectColor } from '../utils/theme'
import { useState } from 'react'

type QuestionDetailPageProps = {
  question: Question
  onMarkPracticed: (passed: boolean) => void
  onBack: () => void
}

export function QuestionDetailPage({ question, onMarkPracticed, onBack }: QuestionDetailPageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isCorrect = selectedOption === question.answer

  const handleSubmit = () => {
    if (!selectedOption) return
    setIsSubmitted(true)
    onMarkPracticed(isCorrect)
  }
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-blue-900/50 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm transition hover:bg-slate-900"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to Question Bank
      </button>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getSubjectColor(question.subject)}`}>
                {question.subject}
              </span>
              {[question.topic, question.examType].filter(Boolean).map((item) => (
                <span key={item} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {item}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{question.question}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricPill label="Truth Score" value={`${question.truthScore}%`} tone="indigo" />
            <MetricPill label="Attempts" value={question.attempts.toLocaleString()} tone="slate" />
            <MetricPill label="Practiced" value={question.practiced ? 'Yes' : 'No'} tone="emerald" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {question.options.map((option) => {
              const isOptionSelected = selectedOption === option
              const isOptionCorrect = option === question.answer
              
              let variantClasses = 'border-blue-900/50 bg-slate-950/70 text-slate-300 hover:border-blue-700/50'
              
              if (isSubmitted) {
                if (isOptionCorrect) {
                  variantClasses = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                } else if (isOptionSelected) {
                  variantClasses = 'border-rose-500/50 bg-rose-500/10 text-rose-100'
                } else {
                  variantClasses = 'border-blue-900/30 bg-slate-950/40 text-slate-500 opacity-50'
                }
              } else if (isOptionSelected) {
                variantClasses = 'border-blue-500 bg-blue-600/10 text-white ring-2 ring-blue-500/20'
              }

              return (
                <button
                  key={option}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left rounded-[24px] border px-5 py-4 text-sm leading-7 transition ${variantClasses}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSubmitted && isOptionCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    {isSubmitted && isOptionSelected && !isOptionCorrect && <XCircle className="h-5 w-5 text-rose-400" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="space-y-4 rounded-[28px] bg-slate-950/70 p-5">
            <h2 className="text-lg font-semibold tracking-tight text-white">Quiz panel</h2>
            <p className="text-sm leading-7 text-slate-400">
              {isSubmitted 
                ? "Attempt recorded. Review the explanation below to strengthen your understanding."
                : "Select an option and submit to test your knowledge. Your performance will be tracked."}
            </p>
            
            {!isSubmitted ? (
              <button
                type="button"
                disabled={!selectedOption}
                onClick={handleSubmit}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="w-full rounded-2xl border border-blue-900/50 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Next Question
              </button>
            )}

            {isSubmitted ? (
              <div className={`rounded-[24px] border p-4 ${isCorrect ? 'border-emerald-400/30 bg-emerald-500/5' : 'border-rose-400/30 bg-rose-500/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm font-semibold text-emerald-300">Correct!</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-400" />
                      <p className="text-sm font-semibold text-rose-300">Not quite.</p>
                    </>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-200">The correct answer is: {question.answer}</p>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Explanation</p>
                  <p className="text-sm leading-7 text-slate-400">{question.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-blue-900/50 bg-slate-900 p-4 text-sm text-slate-500">
                Correct answer and explanation will be revealed after submission.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
