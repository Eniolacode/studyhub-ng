import { Outlet } from 'react-router-dom'
import { TopNavigation } from './TopNavigation'
import { Sidebar } from './Sidebar'
import { UserRole } from '../types'
import { useState } from 'react'

type LayoutProps = {
  currentUser: { name: string; email: string; role: UserRole } | null
  onLogout: () => void
}

export function Layout({ currentUser, onLogout }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]" />
      
      <TopNavigation
        currentUser={currentUser}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onLogout={onLogout}
      />

      <main className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {currentUser ? (
          <Sidebar userRole={currentUser.role} />
        ) : null}

        <div className="flex-1">
          {/* React Router will inject the current page component here */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
