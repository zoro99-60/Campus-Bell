import { createClient } from '@/utils/supabase/server'
import { Users, FileStack, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Overview ⚡
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage university schedules, track attendance, and dispatch live alerts.
          </p>
        </div>
        <Link 
          href="/admin/timetable" 
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          Manage Timetable
        </Link>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-32 h-32" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">Active Students</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 relative z-10">1,248</p>
        </div>
        
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:scale-110 transition-transform duration-500">
            <FileStack className="w-32 h-32" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">Classes Scheduled Today</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 relative z-10">42</p>
        </div>
        
        <div className="rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/10 p-6 flex flex-col justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10%] top-[-10%] text-orange-600 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="w-32 h-32" />
          </div>
          <p className="text-sm font-medium text-orange-800 dark:text-orange-400 relative z-10">Recent Adjustments</p>
          <p className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 mt-2 relative z-10">3</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 cursor-pointer transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Cancel a Lecture</h3>
            <p className="text-xs text-slate-500 mt-1">Immediately dispatches SMS/App push to affected students.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 cursor-pointer transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Reschedule Class</h3>
            <p className="text-xs text-slate-500 mt-1">Move a session to a vacant slot and update timelines.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 cursor-pointer transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Mark Absenteeism</h3>
            <p className="text-xs text-slate-500 mt-1">Log bulk attendance records via CSV or manual entry.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 cursor-pointer transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Publish Announcement</h3>
            <p className="text-xs text-slate-500 mt-1">Broadcast global notices across all departments.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
