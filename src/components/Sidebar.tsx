import Link from 'next/link'
import { BellRing, CalendarDays, Users, LogOut, Settings } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export function Sidebar({ role }: { role: 'admin' | 'student' }) {
  const links = role === 'admin' 
    ? [
        { name: 'Overview', href: '/admin', icon: CalendarDays },
        { name: 'Manage Timetable', href: '/admin/timetable', icon: Settings },
        { name: 'Attendance', href: '/admin/attendance', icon: Users },
      ]
    : [
        { name: 'My Schedule', href: '/student', icon: CalendarDays },
        { name: 'Attendance', href: '/student/attendance', icon: Users },
      ]

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <BellRing className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-4 px-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex justify-center items-center text-indigo-600 dark:text-indigo-400 font-bold uppercase">
            {role[0]}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{role}</div>
        </div>
        <form action={logout}>
          <button type="submit" className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
