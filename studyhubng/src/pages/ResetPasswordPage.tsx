import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'
import { fetchApi } from '../services/api'

export function ResetPasswordPage() {
  const { id, token } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetchApi(`/auth/reset-password/${id}/${token}`, { 
        method: 'POST',
        body: JSON.stringify({ password })
      })
      setMessage(response.message || 'Password successfully reset!')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Invalid or expired reset link. Please request a new one.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/20 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">New Password</h1>
          <p className="mt-2 text-sm text-slate-400">Please enter your new password below.</p>
        </div>

        {message ? (
          <div className="mb-6 flex flex-col items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-200">{message}</p>
            <p className="mt-2 text-xs text-emerald-400/80">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="pass" className="mb-2 block text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded-2xl border border-blue-900/50 bg-slate-950 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Save Password
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
