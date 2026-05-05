import { Question, User } from '../types'
import { PencilLine, Plus, Search, Trash2, Upload, FileJson, Users } from 'lucide-react'
import { Field } from '../components/Field'
import { useState, useMemo, useDeferredValue, memo } from 'react'
import { createQuestion } from '../services/questions'
import { getSubjectColor } from '../utils/theme'

type AdminPageProps = {
  onSubmit: (question: Question, editingId: string | null) => Promise<void>
  onBulkUpload: (questions: Question[]) => void
  onDelete: (id: string) => void
  questions: Question[]
  users: User[]
}

export function AdminPage({
  questions,
  onDelete,
  onSubmit,
  onBulkUpload,
  users,
}: AdminPageProps) {
  const [adminSearch, setAdminSearch] = useState('')
  const deferredAdminSearch = useDeferredValue(adminSearch)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkData, setBulkData] = useState('')
  const [bulkError, setBulkError] = useState('')

  const [adminForm, setAdminForm] = useState<Question>({
    id: `UNI-${Math.floor(Math.random() * 900 + 100)}`,
    subject: '',
    topic: '',
    examType: '',
    difficulty: 'Medium',
    truthScore: 80,
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    tags: [],
    attempts: 0,
    successRate: 0,
    practiced: false,
  })
  const [adminMessage, setAdminMessage] = useState('')
  const [adminError, setAdminError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adminPreview, setAdminPreview] = useState(false)

  const resetAdminForm = () => {
    setAdminForm({
      id: `UNI-${Math.floor(Math.random() * 900 + 100)}`,
      subject: '',
      topic: '',
      examType: '',
      difficulty: 'Medium',
      truthScore: 80,
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      tags: [],
      attempts: 0,
      successRate: 0,
      practiced: false,
    })
    setEditingId(null)
    setAdminError('')
    setAdminMessage('')
  }

  const handleEdit = (question: Question) => {
    setAdminForm(question)
    setEditingId(question.id)
    setAdminPreview(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await onSubmit(adminForm, editingId)
      setAdminMessage(editingId ? 'Question updated successfully!' : 'Question uploaded successfully!')
      if (!editingId) resetAdminForm()
    } catch (err: any) {
      setAdminError(err.message)
    }
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      q.id.toLowerCase().includes(deferredAdminSearch.toLowerCase()) ||
      q.question.toLowerCase().includes(deferredAdminSearch.toLowerCase()) ||
      q.subject.toLowerCase().includes(deferredAdminSearch.toLowerCase())
    )
  }, [questions, deferredAdminSearch])

  const handleBulkSubmit = () => {
    try {
      const parsed = JSON.parse(bulkData)
      if (!Array.isArray(parsed)) throw new Error('Data must be an array of questions')
      onBulkUpload(parsed)
      setShowBulkModal(false)
      setBulkData('')
      setBulkError('')
    } catch (e: any) {
      setBulkError(e.message)
    }
  }

  const [activeTab, setActiveTab] = useState<'questions' | 'users'>('questions')

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Admin management</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Upload and manage local university mock questions.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Create new mock questions, preview them before publishing, and edit or delete existing entries from the locally managed campus content set.
            </p>
            
            <div className="mt-6 flex gap-2 rounded-2xl bg-slate-950 p-1 w-fit border border-blue-900/30">
              <button 
                onClick={() => setActiveTab('questions')}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
              >
                Questions
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
              >
                Platform Users ({users.length})
              </button>
            </div>
          </div>
          {activeTab === 'questions' && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="rounded-full border border-blue-900/50 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 flex items-center gap-2"
              >
                <FileJson className="h-4 w-4" />
                Bulk upload
              </button>
              <button
                type="button"
                onClick={() => setAdminPreview(!adminPreview)}
                className="rounded-full border border-blue-900/50 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                {adminPreview ? 'Hide preview' : 'Preview draft'}
              </button>
              <button
                type="button"
                onClick={resetAdminForm}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                New question
              </button>
            </div>
          )}
        </div>
      </section>

      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-blue-900/50 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-semibold text-white">Bulk Upload Questions</h2>
            <p className="mt-2 text-sm text-slate-400">Paste an array of question objects in JSON format.</p>
            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              className="mt-6 h-64 w-full rounded-2xl border border-blue-900/50 bg-slate-950 p-4 text-xs font-mono text-blue-300 outline-none focus:border-blue-500"
              placeholder='[{"id": "...", "subject": "...", ...}]'
            />
            {bulkError && <p className="mt-3 text-sm text-rose-400">{bulkError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowBulkModal(false)} className="rounded-full px-6 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleBulkSubmit} className="rounded-full bg-blue-600 px-8 py-2 text-sm font-semibold text-white hover:bg-blue-500">Upload All</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'questions' ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <form onSubmit={handleFormSubmit} className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-300">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">{editingId ? 'Edit question' : 'Upload question'}</h2>
                <p className="text-sm text-slate-400">All changes are stored locally in this production-ready campus demo.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Question ID" htmlFor="questionId" dark>
                <input id="questionId" value={adminForm.id} onChange={(event) => setAdminForm((current) => ({ ...current, id: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
              <Field label="Subject" htmlFor="subject" dark>
                <input id="subject" value={adminForm.subject} onChange={(event) => setAdminForm((current) => ({ ...current, subject: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
              <Field label="Topic" htmlFor="topic" dark>
                <input id="topic" value={adminForm.topic} onChange={(event) => setAdminForm((current) => ({ ...current, topic: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
              <Field label="Exam type" htmlFor="examType" dark>
                <input id="examType" value={adminForm.examType} onChange={(event) => setAdminForm((current) => ({ ...current, examType: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-300">Difficulty</span>
                <select value={adminForm.difficulty} onChange={(event) => setAdminForm((current) => ({ ...current, difficulty: event.target.value as Question['difficulty'] }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Truth Score" htmlFor="truthScore" dark>
                <input id="truthScore" type="number" min={0} max={100} value={adminForm.truthScore} onChange={(event) => setAdminForm((current) => ({ ...current, truthScore: Number(event.target.value) }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Question prompt" htmlFor="questionPrompt" dark>
                <textarea id="questionPrompt" value={adminForm.question} onChange={(event) => setAdminForm((current) => ({ ...current, question: event.target.value }))} rows={4} className="w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                {adminForm.options.map((option, index) => (
                  <Field key={index} label={`Option ${index + 1}`} htmlFor={`option-${index}`} dark>
                    <input
                      id={`option-${index}`}
                      value={option}
                      onChange={(event) =>
                        setAdminForm((current) => ({
                          ...current,
                          options: current.options.map((item, optionIndex) => (optionIndex === index ? event.target.value : item)),
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </Field>
                ))}
              </div>

              <Field label="Correct answer" htmlFor="correctAnswer" dark>
                <input id="correctAnswer" value={adminForm.answer} onChange={(event) => setAdminForm((current) => ({ ...current, answer: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>

              <Field label="Explanation" htmlFor="explanation" dark>
                <textarea id="explanation" value={adminForm.explanation} onChange={(event) => setAdminForm((current) => ({ ...current, explanation: event.target.value }))} rows={4} className="w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
              </Field>
            </div>

            {adminError ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{adminError}</p> : null}
            {adminMessage ? <p className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{adminMessage}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500">
                <Plus className="h-4 w-4" />
                {editingId ? 'Save changes' : 'Upload question'}
              </button>
              <button type="button" onClick={resetAdminForm} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-900/50 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900">
                <PencilLine className="h-4 w-4" />
                Reset form
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold tracking-tight text-white">Draft preview</h2>
              {adminPreview ? (
                <div className="mt-4 rounded-[28px] bg-slate-950/70 p-5">
                  <div className="flex flex-wrap gap-2">
                    {adminForm.subject ? (
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm ${getSubjectColor(adminForm.subject)}`}>
                        {adminForm.subject}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 shadow-sm">—</span>
                    )}
                    {[adminForm.topic, adminForm.examType].map((item, i) => (
                      <span key={item || i} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 shadow-sm">
                        {item || '—'}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{adminForm.question || 'Your draft question will appear here.'}</h3>
                  <div className="mt-4 space-y-2">
                    {adminForm.options.map((option, index) => (
                      <div key={index} className="rounded-2xl border border-blue-900/50 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                        {option || `Option ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[28px] border border-dashed border-blue-900/50 bg-slate-950/70 p-5 text-sm text-slate-500">
                  Toggle preview to inspect your draft question before saving it.
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-white">Managed questions</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="rounded-full border border-blue-900/50 bg-slate-950 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{filteredQuestions.length} visible</span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">{questions.length} total</span>
              </div>
              <div className="mt-4 space-y-3">
                <QuestionList questions={filteredQuestions} onEdit={handleEdit} onDelete={onDelete} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">Registered Users</h2>
              <p className="text-sm text-slate-400">View and manage all students and administrators registered on the platform.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-blue-900/30">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">Email</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">Role</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">University / Dept</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20 bg-slate-900/40">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {user.university ? `${user.university} / ${user.department}` : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  )
}

const QuestionList = memo(({ questions, onEdit, onDelete }: { questions: Question[], onEdit: (q: Question) => void, onDelete: (id: string) => void }) => {
  if (questions.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-blue-900/50 bg-slate-950/70 p-4 text-sm text-slate-500">
        No matches found.
      </div>
    )
  }

  return (
    <>
      {questions.map((question) => (
        <div key={question.id} className="rounded-[24px] border border-blue-900/50 bg-slate-950/70 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{question.id}</p>
              <p className="mt-1 text-sm text-slate-400">{question.subject} • {question.topic}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onEdit(question)} className="rounded-full border border-blue-900/50 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800" aria-label={`Edit ${question.id}`}>
                <PencilLine className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onDelete(question.id)} className="rounded-full border border-rose-500/30 bg-slate-900 p-2 text-rose-300 transition hover:bg-rose-500/10" aria-label={`Delete ${question.id}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
})
