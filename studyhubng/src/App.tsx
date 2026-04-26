import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileQuestion,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  UserCircle2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type UserRole = 'student' | 'admin'
type AuthMode = 'login' | 'signup'
type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'question-bank'
  | 'question-detail'
  | 'admin'

type Question = {
  id: string
  subject: string
  topic: string
  examType: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  truthScore: number
  question: string
  options: string[]
  answer: string
  explanation: string
  tags: string[]
  attempts: number
  successRate: number
  practiced: boolean
}

type AuthForm = {
  fullName: string
  email: string
  password: string
  remember: boolean
}

const defaultQuestions: Question[] = [
  {
    id: 'UNI-201',
    subject: 'Engineering Mathematics',
    topic: 'Matrices and Determinants',
    examType: 'University CBT',
    difficulty: 'Medium',
    truthScore: 86,
    question: 'If A is a 2×2 matrix with determinant 5 and B is a 2×2 matrix with determinant 3, what is det(AB)?',
    options: ['8', '15', '2', '30'],
    answer: '15',
    explanation: 'For square matrices, det(AB) = det(A) × det(B). Therefore 5 × 3 = 15.',
    tags: ['200 Level', 'GST Support', 'Semester Prep'],
    attempts: 1240,
    successRate: 68,
    practiced: true,
  },
  {
    id: 'UNI-202',
    subject: 'Use of English',
    topic: 'Academic Reading',
    examType: 'University CBT',
    difficulty: 'Easy',
    truthScore: 92,
    question: 'Which reading strategy is most effective when identifying the main idea of a long academic passage?',
    options: ['Skimming for topic sentences', 'Memorising every sentence', 'Reading only the conclusion', 'Ignoring headings and subheadings'],
    answer: 'Skimming for topic sentences',
    explanation: 'Skimming helps a student quickly identify topic sentences, headings, and central arguments in academic texts.',
    tags: ['100 Level', 'General Studies'],
    attempts: 980,
    successRate: 82,
    practiced: false,
  },
  {
    id: 'UNI-203',
    subject: 'Microeconomics',
    topic: 'Demand and Supply',
    examType: 'University Exam',
    difficulty: 'Hard',
    truthScore: 77,
    question: 'A rightward shift in demand with supply held constant will most likely lead to which outcome?',
    options: ['Lower equilibrium price and quantity', 'Higher equilibrium price and quantity', 'Higher quantity but lower price', 'No change in equilibrium'],
    answer: 'Higher equilibrium price and quantity',
    explanation: 'When demand increases while supply remains constant, both equilibrium price and equilibrium quantity rise.',
    tags: ['Economics', '200 Level'],
    attempts: 620,
    successRate: 57,
    practiced: false,
  },
  {
    id: 'UNI-204',
    subject: 'Computer Science',
    topic: 'Data Structures',
    examType: 'University CBT',
    difficulty: 'Medium',
    truthScore: 89,
    question: 'Which data structure follows the Last In, First Out (LIFO) principle?',
    options: ['Queue', 'Array', 'Stack', 'Linked List'],
    answer: 'Stack',
    explanation: 'A stack removes the most recently added item first, which is the LIFO principle.',
    tags: ['STEM', 'Algorithms'],
    attempts: 860,
    successRate: 79,
    practiced: true,
  },
]

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'question-bank', label: 'Question Bank', icon: FileQuestion },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
] as const

const chartBars = [72, 81, 76, 89, 84, 93, 88]
const topicBreakdown = [
  { name: 'GST', value: 28, color: 'bg-blue-500' },
  { name: 'Engineering', value: 24, color: 'bg-indigo-500' },
  { name: 'Sciences', value: 18, color: 'bg-cyan-500' },
  { name: 'Social Sciences', value: 14, color: 'bg-sky-500' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authRole, setAuthRole] = useState<UserRole>('student')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authForm, setAuthForm] = useState<AuthForm>({
    fullName: '',
    email: '',
    password: '',
    remember: true,
  })
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole } | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [questionLoading, setQuestionLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [truthScore, setTruthScore] = useState(60)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(defaultQuestions[0].id)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [adminForm, setAdminForm] = useState<Question>({
    id: 'UNI-205',
    subject: 'Mass Communication',
    topic: 'Media Ethics',
    examType: 'University Exam',
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

  useEffect(() => {
    const dashboardTimer = window.setTimeout(() => setDashboardLoading(false), 1200)
    const questionTimer = window.setTimeout(() => setQuestionLoading(false), 1400)
    return () => {
      window.clearTimeout(dashboardTimer)
      window.clearTimeout(questionTimer)
    }
  }, [])

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  )

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(search.toLowerCase()) ||
        question.subject.toLowerCase().includes(search.toLowerCase()) ||
        question.topic.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = subjectFilter === 'All' || question.subject === subjectFilter
      const matchesDifficulty = difficultyFilter === 'All' || question.difficulty === difficultyFilter
      const matchesTruthScore = question.truthScore >= truthScore
      return matchesSearch && matchesSubject && matchesDifficulty && matchesTruthScore
    })
  }, [difficultyFilter, questions, search, subjectFilter, truthScore])

  const stats = useMemo(
    () => [
      { label: 'Semester Streak', value: '11 weeks', delta: '+8%', icon: TrendingUp },
      { label: 'Questions Mastered', value: '248', delta: '+34 this month', icon: CheckCircle2 },
      { label: 'Average Truth Score', value: '89%', delta: 'Top 12%', icon: Sparkles },
      { label: 'Courses Covered', value: '14', delta: '+2 this session', icon: BookOpen },
    ],
    [],
  )

  const subjects = ['All', ...Array.from(new Set(questions.map((question) => question.subject)))]

  const switchAuthView = (mode: AuthMode) => {
    setAuthMode(mode)
    setView(mode)
    setAuthError('')
  }

  const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError('')

    if (authMode === 'signup' && authForm.fullName.trim().length < 3) {
      setAuthError('Enter your full name to continue.')
      return
    }

    if (!authForm.email.includes('@')) {
      setAuthError('Please enter a valid email address.')
      return
    }

    if (authForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters long.')
      return
    }

    setAuthLoading(true)

    window.setTimeout(() => {
      const role = authRole
      setCurrentUser({
        name: authMode === 'signup' ? authForm.fullName : role === 'admin' ? 'Faculty Admin' : 'Chinedu Scholar',
        email: authForm.email,
        role,
      })
      setAuthLoading(false)
      setView(role === 'admin' ? 'admin' : 'dashboard')
    }, 1100)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setView('landing')
    setMenuOpen(false)
    setRevealAnswer(false)
  }

  const openQuestion = (id: string) => {
    setSelectedQuestionId(id)
    setRevealAnswer(false)
    setView('question-detail')
  }

  const togglePracticed = (id: string) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id ? { ...question, practiced: !question.practiced } : question,
      ),
    )
  }

  const resetAdminForm = () => {
    setEditingId(null)
    setAdminPreview(false)
    setAdminForm({
      id: `UNI-${Math.floor(Math.random() * 900 + 100)}`,
      subject: 'Political Science',
      topic: 'Public Administration',
      examType: 'University Exam',
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
  }

  const handleAdminSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAdminError('')
    setAdminMessage('')

    if (!adminForm.question.trim() || adminForm.options.some((option) => !option.trim()) || !adminForm.answer.trim()) {
      setAdminError('Complete the question, all options, and the correct answer before saving.')
      return
    }

    if (editingId) {
      setQuestions((current) => current.map((question) => (question.id === editingId ? adminForm : question)))
      setAdminMessage('Question updated successfully.')
    } else {
      setQuestions((current) => [adminForm, ...current])
      setAdminMessage('Mock question uploaded successfully.')
    }

    setSelectedQuestionId(adminForm.id)
    resetAdminForm()
  }

  const handleEdit = (question: Question) => {
    setEditingId(question.id)
    setAdminPreview(false)
    setAdminForm(question)
    setAdminMessage('')
    setAdminError('')
  }

  const handleDelete = (id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id))
    setAdminMessage('Question deleted.')
    if (selectedQuestionId === id && questions.length > 1) {
      const nextQuestion = questions.find((question) => question.id !== id)
      if (nextQuestion) {
        setSelectedQuestionId(nextQuestion.id)
      }
    }
  }

  const protectedView = currentUser ? view : 'landing'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
      <TopNavigation
        currentUser={currentUser}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onNavigate={setView}
        onLogout={handleLogout}
      />

      <main className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {currentUser ? (
          <Sidebar currentView={protectedView} onNavigate={setView} userRole={currentUser.role} />
        ) : null}

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {protectedView === 'landing' && (
              <motion.div
                key="landing"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.35 }}
              >
                <LandingPage onGetStarted={() => switchAuthView('signup')} onSignIn={() => switchAuthView('login')} />
              </motion.div>
            )}

            {(protectedView === 'login' || protectedView === 'signup') && (
              <motion.div
                key={protectedView}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.35 }}
              >
                <AuthPage
                  authForm={authForm}
                  authMode={authMode}
                  authRole={authRole}
                  authLoading={authLoading}
                  authError={authError}
                  onChange={setAuthForm}
                  onRoleChange={setAuthRole}
                  onSubmit={handleAuthSubmit}
                  onSwitchMode={switchAuthView}
                />
              </motion.div>
            )}

            {protectedView === 'dashboard' && currentUser && (
              <motion.div key="dashboard" variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
                <DashboardPage
                  currentUser={currentUser}
                  loading={dashboardLoading}
                  stats={stats}
                  onNavigate={setView}
                />
              </motion.div>
            )}

            {protectedView === 'question-bank' && currentUser && (
              <motion.div key="question-bank" variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
                <QuestionBankPage
                  loading={questionLoading}
                  questions={filteredQuestions}
                  search={search}
                  subjectFilter={subjectFilter}
                  difficultyFilter={difficultyFilter}
                  truthScore={truthScore}
                  subjects={subjects}
                  onSearchChange={setSearch}
                  onSubjectChange={setSubjectFilter}
                  onDifficultyChange={setDifficultyFilter}
                  onTruthScoreChange={setTruthScore}
                  onOpenQuestion={openQuestion}
                />
              </motion.div>
            )}

            {protectedView === 'question-detail' && currentUser && selectedQuestion && (
              <motion.div key="question-detail" variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
                <QuestionDetailPage
                  question={selectedQuestion}
                  revealAnswer={revealAnswer}
                  onRevealAnswer={() => setRevealAnswer((current) => !current)}
                  onMarkPracticed={() => togglePracticed(selectedQuestion.id)}
                  onBack={() => setView('question-bank')}
                />
              </motion.div>
            )}

            {protectedView === 'admin' && currentUser && currentUser.role === 'admin' && (
              <motion.div key="admin" variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
                <AdminPage
                  adminError={adminError}
                  adminForm={adminForm}
                  adminMessage={adminMessage}
                  adminPreview={adminPreview}
                  editingId={editingId}
                  questions={questions}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onFormChange={setAdminForm}
                  onPreviewToggle={() => setAdminPreview((current) => !current)}
                  onReset={resetAdminForm}
                  onSubmit={handleAdminSubmit}
                />
              </motion.div>
            )}

            {protectedView === 'admin' && currentUser?.role !== 'admin' && (
              <motion.div key="admin-locked" variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
                <EmptyStateCard
                  title="Admin access required"
                  description="Only StudyHub.ng university administrators can manage uploads and edit local mock content."
                  actionLabel="Return to dashboard"
                  onAction={() => setView('dashboard')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

type TopNavigationProps = {
  currentUser: { name: string; email: string; role: UserRole } | null
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  onNavigate: (view: AppView) => void
  onLogout: () => void
}

function TopNavigation({ currentUser, menuOpen, setMenuOpen, onNavigate, onLogout }: TopNavigationProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-blue-900/60 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/40">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold tracking-tight text-white">StudyHub.ng</p>
            <p className="text-xs text-slate-400">Built for university students in Nigeria</p>
          </div>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="rounded-full border border-blue-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-600 hover:bg-blue-950/40 hover:text-white"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Create account
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-blue-900/60 bg-slate-900/90 px-3 py-2 shadow-sm shadow-black/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950/70 text-blue-200">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs capitalize text-slate-400">{currentUser.role} workspace</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-full border border-blue-900/60 p-2 text-slate-300 transition hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-blue-900/60 bg-slate-950 px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {!currentUser ? (
                <>
                  <button type="button" onClick={() => onNavigate('login')} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Sign in</button>
                  <button type="button" onClick={() => onNavigate('signup')} className="rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white">Create account</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => onNavigate('dashboard')} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Dashboard</button>
                  <button type="button" onClick={() => onNavigate('question-bank')} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Question Bank</button>
                  {currentUser.role === 'admin' ? (
                    <button type="button" onClick={() => onNavigate('admin')} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Admin Panel</button>
                  ) : null}
                  <button type="button" onClick={onLogout} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950">Log out</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

type SidebarProps = {
  currentView: AppView
  onNavigate: (view: AppView) => void
  userRole: UserRole
}

function Sidebar({ currentView, onNavigate, userRole }: SidebarProps) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-72 shrink-0 flex-col rounded-[28px] border border-blue-900/50 bg-slate-900/80 p-4 shadow-xl shadow-black/20 lg:flex">
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-700 to-slate-900 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Campus learning cockpit</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Stay ahead in every semester.</h2>
        <p className="mt-2 text-sm text-blue-100/80">Track course mastery, practice smarter, and manage trusted university question sets.</p>
      </div>

      <nav className="space-y-2">
        {navItems
          .filter((item) => (item.id === 'admin' ? userRole === 'admin' : true))
          .map((item) => {
            const isActive = currentView === item.id || (currentView === 'question-detail' && item.id === 'question-bank')
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id as AppView)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-200 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )
          })}
      </nav>

      <div className="mt-auto rounded-3xl border border-blue-900/50 bg-blue-950/40 p-4">
        <p className="text-sm font-semibold text-white">Truth Score insights</p>
        <p className="mt-1 text-sm text-slate-300">Use the slider to focus on highly trusted university-level practice questions.</p>
      </div>
    </aside>
  )
}

type LandingPageProps = {
  onGetStarted: () => void
  onSignIn: () => void
}

function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
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

function FeatureCard({ icon: Icon, title, description }: { icon: typeof BookOpen; title: string; description: string }) {
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

type AuthPageProps = {
  authForm: AuthForm
  authMode: AuthMode
  authRole: UserRole
  authLoading: boolean
  authError: string
  onChange: React.Dispatch<React.SetStateAction<AuthForm>>
  onRoleChange: React.Dispatch<React.SetStateAction<UserRole>>
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onSwitchMode: (mode: AuthMode) => void
}

function AuthPage({ authForm, authMode, authRole, authLoading, authError, onChange, onRoleChange, onSubmit, onSwitchMode }: AuthPageProps) {
  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-blue-900/50 bg-slate-900/85 shadow-2xl shadow-black/20">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-gradient-to-br from-blue-700 to-slate-950 px-8 py-10 text-white sm:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Secure access</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{authMode === 'login' ? 'Welcome back to your campus learning cockpit.' : 'Create your StudyHub.ng university account.'}</h2>
          <p className="mt-4 text-sm leading-7 text-blue-100/85">
            Sign in as a student to access the protected dashboard and question bank, or use admin mode to manage university mock questions locally.
          </p>
          <div className="mt-8 space-y-3">
            {['Accessible validated forms', 'Protected student and admin routes', 'Clear loading, error, and empty states'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-50">
                <CheckCircle2 className="h-4 w-4 text-blue-200" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-6 flex rounded-full bg-slate-950 p-1 border border-blue-900/50">
            {(['login', 'signup'] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onSwitchMode(mode)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold capitalize transition ${
                  authMode === mode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            {authMode === 'signup' ? (
              <Field label="Full name" htmlFor="fullName" dark>
                <input
                  id="fullName"
                  value={authForm.fullName}
                  onChange={(event) => onChange((current) => ({ ...current, fullName: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  placeholder="Adaeze Okafor"
                  aria-invalid={Boolean(authError && authForm.fullName.trim().length < 3)}
                />
              </Field>
            ) : null}

            <Field label="University email address" htmlFor="email" dark>
              <input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                placeholder="student@university.edu.ng"
                aria-invalid={Boolean(authError && !authForm.email.includes('@'))}
              />
            </Field>

            <Field label="Password" htmlFor="password" dark>
              <input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                placeholder="Minimum 8 characters"
                aria-invalid={Boolean(authError && authForm.password.length < 8)}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">Workspace role</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['student', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onRoleChange(role)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium capitalize transition ${
                      authRole === role
                        ? 'border-blue-600 bg-blue-600/15 text-blue-200'
                        : 'border-blue-900/50 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={authForm.remember}
                onChange={(event) => onChange((current) => ({ ...current, remember: event.target.checked }))}
                className="h-4 w-4 rounded border-blue-900/50 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              Keep me signed in on this device
            </label>

            {authError ? <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{authError}</p> : null}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign in securely' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ label, htmlFor, children, dark = false }: { label: string; htmlFor: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={`mb-2 block text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </label>
      {children}
    </div>
  )
}

type DashboardPageProps = {
  currentUser: { name: string; email: string; role: UserRole }
  loading: boolean
  stats: { label: string; value: string; delta: string; icon: typeof TrendingUp }[]
  onNavigate: (view: AppView) => void
}

function DashboardPage({ currentUser, loading, stats, onNavigate }: DashboardPageProps) {
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
              {topicBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-300">{item.name}</span>
                    <span className="text-slate-500">{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-950/80">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold tracking-tight text-white">Next best actions</h2>
            <div className="mt-4 space-y-3">
              {['Revise matrix operations', 'Complete 10 GST reading drills', 'Review missed microeconomics concepts'].map((task) => (
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

type QuestionBankPageProps = {
  loading: boolean
  questions: Question[]
  search: string
  subjectFilter: string
  difficultyFilter: string
  truthScore: number
  subjects: string[]
  onSearchChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onTruthScoreChange: (value: number) => void
  onOpenQuestion: (id: string) => void
}

function QuestionBankPage({
  loading,
  questions,
  search,
  subjectFilter,
  difficultyFilter,
  truthScore,
  subjects,
  onSearchChange,
  onSubjectChange,
  onDifficultyChange,
  onTruthScoreChange,
  onOpenQuestion,
}: QuestionBankPageProps) {
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
          <div className="rounded-2xl border border-blue-900/40 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
            Showing <span className="font-semibold text-white">{questions.length}</span> question{questions.length === 1 ? '' : 's'}
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
              onChange={(event) => onSearchChange(event.target.value)}
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

      {questions.length === 0 ? (
        <EmptyStateCard
          title="No questions match your filters"
          description="Try lowering the Truth Score threshold or broadening your search terms to reveal more university questions."
          actionLabel="Reset filters"
          onAction={() => {
            onSearchChange('')
            onSubjectChange('All')
            onDifficultyChange('All')
            onTruthScoreChange(0)
          }}
        />
      ) : (
        <section className="grid gap-4">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => onOpenQuestion(question.id)}
              className="rounded-[28px] border border-blue-900/50 bg-slate-900/80 p-5 text-left shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-blue-950/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{question.subject}</span>
                    <span>•</span>
                    <span>{question.topic}</span>
                    <span>•</span>
                    <span>{question.examType}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{question.question}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:min-w-60 sm:grid-cols-3 lg:grid-cols-1">
                  <MetricPill label="Truth Score" value={`${question.truthScore}%`} tone="indigo" />
                  <MetricPill label="Success Rate" value={`${question.successRate}%`} tone="emerald" />
                  <MetricPill label="Difficulty" value={question.difficulty} tone="slate" />
                </div>
              </div>
            </button>
          ))}
        </section>
      )}
    </div>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="relative">
        <Filter className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-blue-900/50 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
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

type QuestionDetailPageProps = {
  question: Question
  revealAnswer: boolean
  onRevealAnswer: () => void
  onMarkPracticed: () => void
  onBack: () => void
}

function QuestionDetailPage({ question, revealAnswer, onRevealAnswer, onMarkPracticed, onBack }: QuestionDetailPageProps) {
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
              {[question.subject, question.topic, question.examType].map((item) => (
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
              const isCorrect = revealAnswer && option === question.answer
              return (
                <div
                  key={option}
                  className={`rounded-[24px] border px-5 py-4 text-sm leading-7 transition ${
                    isCorrect
                      ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100'
                      : 'border-blue-900/50 bg-slate-950/70 text-slate-300'
                  }`}
                >
                  {option}
                </div>
              )
            })}
          </div>

          <div className="space-y-4 rounded-[28px] bg-slate-950/70 p-5">
            <h2 className="text-lg font-semibold tracking-tight text-white">Answer panel</h2>
            <p className="text-sm leading-7 text-slate-400">
              Reveal the answer when you are ready, then mark the question as practiced to save your progress locally.
            </p>
            <button
              type="button"
              onClick={onRevealAnswer}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500"
            >
              {revealAnswer ? 'Hide answer' : 'Reveal answer'}
            </button>
            <button
              type="button"
              onClick={onMarkPracticed}
              className="w-full rounded-2xl border border-blue-900/50 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Toggle practiced state
            </button>

            {revealAnswer ? (
              <div className="rounded-[24px] border border-cyan-400/30 bg-slate-900 p-4">
                <p className="text-sm font-semibold text-cyan-300">Correct answer</p>
                <p className="mt-2 text-base font-semibold text-white">{question.answer}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{question.explanation}</p>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-blue-900/50 bg-slate-900 p-4 text-sm text-slate-500">
                Answer remains hidden until you choose to reveal it.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: 'indigo' | 'emerald' | 'slate' }) {
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

type AdminPageProps = {
  adminError: string
  adminForm: Question
  adminMessage: string
  adminPreview: boolean
  editingId: string | null
  questions: Question[]
  onDelete: (id: string) => void
  onEdit: (question: Question) => void
  onFormChange: React.Dispatch<React.SetStateAction<Question>>
  onPreviewToggle: () => void
  onReset: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function AdminPage({
  adminError,
  adminForm,
  adminMessage,
  adminPreview,
  editingId,
  questions,
  onDelete,
  onEdit,
  onFormChange,
  onPreviewToggle,
  onReset,
  onSubmit,
}: AdminPageProps) {
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
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onPreviewToggle}
              className="rounded-full border border-blue-900/50 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >
              {adminPreview ? 'Hide preview' : 'Preview draft'}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              New question
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <form onSubmit={onSubmit} className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
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
              <input id="questionId" value={adminForm.id} onChange={(event) => onFormChange((current) => ({ ...current, id: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
            <Field label="Subject" htmlFor="subject" dark>
              <input id="subject" value={adminForm.subject} onChange={(event) => onFormChange((current) => ({ ...current, subject: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
            <Field label="Topic" htmlFor="topic" dark>
              <input id="topic" value={adminForm.topic} onChange={(event) => onFormChange((current) => ({ ...current, topic: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
            <Field label="Exam type" htmlFor="examType" dark>
              <input id="examType" value={adminForm.examType} onChange={(event) => onFormChange((current) => ({ ...current, examType: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-300">Difficulty</span>
              <select value={adminForm.difficulty} onChange={(event) => onFormChange((current) => ({ ...current, difficulty: event.target.value as Question['difficulty'] }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Truth Score" htmlFor="truthScore" dark>
              <input id="truthScore" type="number" min={0} max={100} value={adminForm.truthScore} onChange={(event) => onFormChange((current) => ({ ...current, truthScore: Number(event.target.value) }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Question prompt" htmlFor="questionPrompt" dark>
              <textarea id="questionPrompt" value={adminForm.question} onChange={(event) => onFormChange((current) => ({ ...current, question: event.target.value }))} rows={4} className="w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              {adminForm.options.map((option, index) => (
                <Field key={index} label={`Option ${index + 1}`} htmlFor={`option-${index}`} dark>
                  <input
                    id={`option-${index}`}
                    value={option}
                    onChange={(event) =>
                      onFormChange((current) => ({
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
              <input id="correctAnswer" value={adminForm.answer} onChange={(event) => onFormChange((current) => ({ ...current, answer: event.target.value }))} className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>

            <Field label="Explanation" htmlFor="explanation" dark>
              <textarea id="explanation" value={adminForm.explanation} onChange={(event) => onFormChange((current) => ({ ...current, explanation: event.target.value }))} rows={4} className="w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15" />
            </Field>
          </div>

          {adminError ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{adminError}</p> : null}
          {adminMessage ? <p className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{adminMessage}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500">
              <Plus className="h-4 w-4" />
              {editingId ? 'Save changes' : 'Upload question'}
            </button>
            <button type="button" onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-900/50 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900">
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
                  {[adminForm.subject, adminForm.topic, adminForm.examType].map((item) => (
                    <span key={item} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 shadow-sm">
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-white">Managed questions</h2>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">{questions.length} total</span>
            </div>
            <div className="mt-4 space-y-3">
              {questions.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-blue-900/50 bg-slate-950/70 p-4 text-sm text-slate-500">No questions available yet.</div>
              ) : (
                questions.map((question) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function EmptyStateCard({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel: string; onAction: () => void }) {
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

export default App
