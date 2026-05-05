import { Link } from 'react-router-dom'
import { UserRole } from '../types'
import { GraduationCap, LogOut, Menu, UserCircle2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type TopNavigationProps = {
  currentUser: { name: string; email: string; role: UserRole } | null
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  onLogout: () => void
}

export function TopNavigation({ currentUser, menuOpen, setMenuOpen, onLogout }: TopNavigationProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-blue-900/60 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={currentUser ? '/dashboard' : '/'}
          className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/40">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold tracking-tight text-white">StudyHub.ng</p>
            <p className="text-xs text-slate-400">Built for university students in Nigeria</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="rounded-full border border-blue-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-600 hover:bg-blue-950/40 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Create account
              </Link>
            </>
          ) : (
            <Link to="/profile" className="flex items-center gap-3 rounded-full border border-blue-900/60 bg-slate-900/90 px-3 py-2 shadow-sm shadow-black/20 hover:border-blue-500 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950/70 text-blue-200">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs capitalize text-slate-400">{currentUser.role} workspace</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLogout(); }}
                className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </Link>
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
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Sign in</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white">Create account</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Dashboard</Link>
                  <Link to="/questions" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Question Bank</Link>
                  <Link to="/performance" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Performance</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Profile</Link>
                  {currentUser.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-blue-900/60 px-4 py-3 text-left text-sm font-medium text-slate-300">Admin Panel</Link>
                  ) : null}
                  <button type="button" onClick={() => { onLogout(); setMenuOpen(false); }} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950">Log out</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
