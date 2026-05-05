import { AuthForm, AuthMode, UserRole } from '../types'
import { CheckCircle2 } from 'lucide-react'
import { Field } from '../components/Field'
import { Link } from 'react-router-dom'

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

export function AuthPage({ authForm, authMode, authRole, authLoading, authError, onChange, onRoleChange, onSubmit, onSwitchMode }: AuthPageProps) {
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

            <div>
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
              {authMode === 'login' && (
                <div className="mt-2 flex justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

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
