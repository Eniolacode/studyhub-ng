import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, School, Book, Save, CheckCircle2 } from 'lucide-react'
import { UserRole } from '../types'
import { fetchApi } from '../services/api'

type ProfilePageProps = {
  currentUser: { 
    name: string; 
    email: string; 
    role: UserRole;
    university?: string;
    department?: string;
  }
  onUpdateUser: (user: any) => void
}

export function ProfilePage({ currentUser, onUpdateUser }: ProfilePageProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    university: currentUser.university || '',
    department: currentUser.department || '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const updated = await fetchApi('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      })
      onUpdateUser(updated)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Your Profile</h1>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-blue-900/40 bg-slate-950/70 py-3 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">University</label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full rounded-2xl border border-blue-900/40 bg-slate-950/70 py-3 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. University of Lagos"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Department</label>
            <div className="relative">
              <Book className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-2xl border border-blue-900/40 bg-slate-950/70 py-3 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Computer Engineering"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Update Profile
              </>
            )}
          </button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400"
            >
              <CheckCircle2 className="h-5 w-5" />
              {message}
            </motion.div>
          )}
        </form>
      </section>

      <section className="rounded-[32px] border border-blue-900/50 bg-slate-900/80 p-6 shadow-xl shadow-black/20 text-center">
        <p className="text-sm text-slate-500">
          Account Role: <span className="font-semibold text-blue-400 uppercase tracking-widest ml-1">{currentUser.role}</span>
        </p>
      </section>
    </div>
  )
}
