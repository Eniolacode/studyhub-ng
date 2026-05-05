import { AppView, UserRole } from '../types'
import { ChevronRight, LayoutDashboard, FileQuestion, ShieldCheck, Activity, User, AlertTriangle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const navItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'question-bank', path: '/questions', label: 'Question Bank', icon: FileQuestion },
  { id: 'performance', path: '/performance', label: 'Performance', icon: Activity },
  { id: 'profile', path: '/profile', label: 'Profile', icon: User },
  { id: 'admin', path: '/admin', label: 'Admin', icon: ShieldCheck },
  { id: 'report', path: '/report', label: 'Report Issue', icon: AlertTriangle },
] as const

type SidebarProps = {
  userRole: 'student' | 'admin'
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation()
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
            const isActive = location.pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.path}
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
              </Link>
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
