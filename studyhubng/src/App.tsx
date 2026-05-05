import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { AuthForm, AuthMode, Question, User, UserRole } from './types'

import { BookOpen, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion, bulkUploadQuestions } from './services/questions'
import { fetchDashboardStats, recordAttempt } from './services/performance'
import { loginUser, registerUser } from './services/auth'
import { fetchUsers } from './services/users'
import { getAuthToken, setAuthToken } from './services/api'

import { Layout } from './components/Layout'
import { EmptyStateCard } from './components/EmptyStateCard'


import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { QuestionBankPage } from './pages/QuestionBankPage'
import { QuestionDetailPage } from './pages/QuestionDetailPage'
import { AdminPage } from './pages/AdminPage'
import { PerformancePage } from './pages/PerformancePage'
import { ProfilePage } from './pages/ProfilePage'
import { ReportPage } from './pages/ReportPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

// Wrapper for animated routes
function AnimatedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function QuestionDetailWrapper({ questions, togglePracticed, navigate }: { questions: Question[], togglePracticed: (id: string, passed: boolean) => void, navigate: any }) {
  const { id } = useParams()
  const question = useMemo(() => questions.find(q => String(q.id) === String(id)), [questions, id])

  if (questions.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!question) {
    return <Navigate to="/questions" replace />
  }

  return (
    <QuestionDetailPage
      question={question}
      onMarkPracticed={(passed) => togglePracticed(question.id, passed)}
      onBack={() => navigate('/questions')}
    />
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  // --- Auth State ---
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

  // --- App Data State ---
  const [isInitializing, setIsInitializing] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [questionLoading, setQuestionLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  
  // Filters
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [truthScore, setTruthScore] = useState(60)

   // Practice state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])

  // Initialization
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          if (payload.exp * 1000 > Date.now()) {
            const savedUser = localStorage.getItem('studyhub_user')
            if (savedUser) {
              setCurrentUser(JSON.parse(savedUser))
            }
          } else {
            setAuthToken('')
            localStorage.removeItem('studyhub_user')
          }
        } catch (e) {
          setAuthToken('')
          localStorage.removeItem('studyhub_user')
        }
      }
      setIsInitializing(false)
    }

    initAuth()

    // Handle unauthorized events
    const handleUnauthorized = () => {
      setCurrentUser(null)
      setAuthToken('')
      localStorage.removeItem('studyhub_user')
      navigate('/login')
    }
    window.addEventListener('auth_unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized)
  }, [navigate])

  useEffect(() => {
    if (!currentUser) return;
    
    setQuestionLoading(true)
    fetchQuestions()
      .then((data) => {
        setQuestions(data)
        if (data.length > 0) setSelectedQuestionId(data[0].id)
      })
      .catch((err) => console.error(err))
      .finally(() => setQuestionLoading(false))

    setDashboardLoading(true)
    fetchDashboardStats()
      .then(setDashboardData)
      .catch((err) => console.error(err))
      .finally(() => setDashboardLoading(false))
    if (currentUser?.role === 'admin') {
      loadUsers()
    }
  }, [currentUser])

  const loadUsers = async () => {
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  // Derived Data
  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  )


  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSubject = subjectFilter === 'All' || question.subject === subjectFilter
      const matchesDifficulty = difficultyFilter === 'All' || question.difficulty === difficultyFilter
      const matchesTruthScore = question.truthScore >= truthScore
      return matchesSubject && matchesDifficulty && matchesTruthScore
    })
  }, [difficultyFilter, questions, subjectFilter, truthScore])

  const stats = useMemo(() => {
    if (!dashboardData) return []
    return [
      { label: 'Total Attempts', value: String(dashboardData.totalAttempts), delta: 'All time', icon: TrendingUp },
      { label: 'Questions Mastered', value: String(dashboardData.questionsMastered), delta: 'Passed', icon: CheckCircle2 },
      { label: 'Average Score', value: `${dashboardData.avgScore}%`, delta: 'Across attempts', icon: Sparkles },
      { label: 'Unique Questions', value: String(dashboardData.uniqueQuestionsAttempted), delta: 'Attempted', icon: BookOpen },
    ]
  }, [dashboardData])

  const subjects = ['All', ...Array.from(new Set(questions.map((question) => question.subject)))]

  // --- Handlers ---
  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>, mode: AuthMode) => {
    event.preventDefault()
    setAuthError('')

    if (mode === 'signup' && authForm.fullName.trim().length < 3) {
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

    try {
      let data
      if (mode === 'signup') {
        data = await registerUser(authForm.fullName, authForm.email, authForm.password, authRole)
      } else {
        data = await loginUser(authForm.email, authForm.password)
      }
      
      const userObj = {
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
      }
      setCurrentUser(userObj)
      localStorage.setItem('studyhub_user', JSON.stringify(userObj))
      
      navigate(data.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred during authentication.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAuthToken('')
    localStorage.removeItem('studyhub_user')
    navigate('/')
  }

  const openQuestion = (id: string) => {
    setSelectedQuestionId(id)
    navigate(`/questions/${id}`)
  }

  const togglePracticed = async (id: string, passed: boolean) => {
    try {
      await recordAttempt(id, passed)
      setQuestions((current) =>
        current.map((q) => (q.id === id ? { ...q, practiced: true } : q)),
      )
      // Refresh dashboard stats after attempt
      fetchDashboardStats().then(setDashboardData)
    } catch (e) {
      console.error('Failed to record attempt', e)
    }
  }

  const handleBulkUpload = async (questionsToUpload: Question[]) => {
    try {
      await bulkUploadQuestions(questionsToUpload)
      const freshQuestions = await fetchQuestions()
      setQuestions(freshQuestions)
    } catch (err: any) {
      throw new Error(err.message || 'Bulk upload failed')
    }
  }

  const handleAdminSubmit = async (formData: Question, editingId: string | null) => {
    if (!formData.question.trim() || formData.options.some((option) => !option.trim()) || !formData.answer.trim()) {
      throw new Error('Please fill in all required fields.')
    }

    try {
      if (editingId) {
        const updated = await updateQuestion(editingId, formData)
        setQuestions((current) => current.map((q) => (q.id === editingId ? updated : q)))
      } else {
        const created = await createQuestion(formData)
        setQuestions((current) => [created, ...current])
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save question.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id)
      setQuestions((current) => current.filter((question) => question.id !== id))
      setAdminMessage('Question deleted.')
    } catch (err: any) {
      setAdminError(err.message || 'Failed to delete question')
    }
  }

  // Route Guards
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children
  }

  const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    if (!currentUser) return <Navigate to="/login" replace />
    if (currentUser.role !== 'admin') {
      return (
        <AnimatedRoute>
          <EmptyStateCard
            title="Admin access required"
            description="Only StudyHub.ng university administrators can manage uploads and edit local mock content."
            actionLabel="Return to dashboard"
            onAction={() => navigate('/dashboard')}
          />
        </AnimatedRoute>
      )
    }
    return <AnimatedRoute>{children}</AnimatedRoute>
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Initializing StudyHub...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes without Layout */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-slate-950 text-slate-100 antialiased pt-24 px-4 pb-10 sm:px-6 lg:px-8">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
              <div className="mx-auto max-w-7xl">
                <AnimatedRoute>
                  <LandingPage onGetStarted={() => navigate('/signup')} onSignIn={() => navigate('/login')} />
                </AnimatedRoute>
              </div>
            </div>
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AnimatedRoute>
              <ForgotPasswordPage />
            </AnimatedRoute>
          )
        }
      />
      
      <Route
        path="/reset-password/:id/:token"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AnimatedRoute>
              <ResetPasswordPage />
            </AnimatedRoute>
          )
        }
      />

      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-slate-950 text-slate-100 antialiased pt-24 px-4 pb-10 sm:px-6 lg:px-8">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
              <AnimatedRoute>
                <AuthPage
                  authForm={authForm}
                  authMode="login"
                  authRole={authRole}
                  authLoading={authLoading}
                  authError={authError}
                  onChange={setAuthForm}
                  onRoleChange={setAuthRole}
                  onSubmit={(e) => handleAuthSubmit(e, 'login')}
                  onSwitchMode={(mode) => navigate(`/${mode}`)}
                />
              </AnimatedRoute>
            </div>
          )
        }
      />

      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-slate-950 text-slate-100 antialiased pt-24 px-4 pb-10 sm:px-6 lg:px-8">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
              <AnimatedRoute>
                <AuthPage
                  authForm={authForm}
                  authMode="signup"
                  authRole={authRole}
                  authLoading={authLoading}
                  authError={authError}
                  onChange={setAuthForm}
                  onRoleChange={setAuthRole}
                  onSubmit={(e) => handleAuthSubmit(e, 'signup')}
                  onSwitchMode={(mode) => navigate(`/${mode}`)}
                />
              </AnimatedRoute>
            </div>
          )
        }
      />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<RequireAuth><Layout currentUser={currentUser} onLogout={handleLogout} /></RequireAuth>}>
        <Route
          path="/dashboard"
          element={
            <AnimatedRoute>
              {currentUser && (
                <DashboardPage
                  currentUser={currentUser}
                  loading={dashboardLoading}
                  stats={stats}
                  data={dashboardData}
                  onNavigate={(view) => navigate(`/${view}`)}
                />
              )}
            </AnimatedRoute>
          }
        />

        <Route
          path="/questions"
          element={
            <AnimatedRoute>
              <QuestionBankPage
                loading={questionLoading}
                questions={filteredQuestions}
                subjectFilter={subjectFilter}
                difficultyFilter={difficultyFilter}
                truthScore={truthScore}
                subjects={subjects}
                onSubjectChange={setSubjectFilter}
                onDifficultyChange={setDifficultyFilter}
                onTruthScoreChange={setTruthScore}
                onOpenQuestion={openQuestion}
              />
            </AnimatedRoute>
          }
        />

          <Route
          path="/questions/:id"
          element={
            <AnimatedRoute>
              <QuestionDetailWrapper
                questions={questions}
                togglePracticed={togglePracticed}
                navigate={navigate}
              />
            </AnimatedRoute>
          }
        />

        <Route
          path="/performance"
          element={
            <AnimatedRoute>
              <PerformancePage data={dashboardData} />
            </AnimatedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <AnimatedRoute>
              {currentUser && (
                <ProfilePage
                  currentUser={currentUser}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated)
                    localStorage.setItem('studyhub_user', JSON.stringify(updated))
                  }}
                />
              )}
            </AnimatedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <AnimatedRoute>
              <ReportPage />
            </AnimatedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage
                questions={questions}
                onDelete={handleDelete}
                onSubmit={handleAdminSubmit}
                onBulkUpload={handleBulkUpload}
                users={users}
              />
            </RequireAdmin>
          }
        />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
