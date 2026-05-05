export type UserRole = 'student' | 'admin'
export type AuthMode = 'login' | 'signup'
export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'question-bank'
  | 'question-detail'
  | 'admin'

export type Question = {
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

export type AuthForm = {
  fullName: string
  email: string
  password: string
  remember: boolean
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  university?: string
  department?: string
  created_at: string
}
