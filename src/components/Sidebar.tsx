'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellRing, CalendarDays, Users, LogOut, Settings, Clock, LayoutDashboard, FileText, Send, MessageCircle, CheckCircle2 } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export function Sidebar({ role }: { role: 'admin' | 'student' | 'teacher' }) {
  const pathname = usePathname()

  const links = role === 'admin' 
    ? [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Timetable', href: '/admin/timetable', icon: Settings },
        { name: 'Students',  href: '/admin/students', icon: Users },
        { name: 'Teachers',  href: '/admin/teachers', icon: Users },
        { name: 'Approvals', href: '/admin/approvals', icon: CheckCircle2 },
        { name: 'Announcements', href: '/admin/announcements', icon: Send },
        { name: 'Reports',   href: '/admin/reports', icon: FileText },
      ]
    : role === 'teacher'
    ? [
        { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
        { name: 'Attendance', href: '/teacher/timetable', icon: CalendarDays },
        { name: 'Messages',   href: '/teacher/messenger', icon: MessageCircle },
        { name: 'History',     href: '/teacher/history', icon: Clock },
        { name: 'Leave',       href: '/teacher/leave', icon: FileText },
      ]
    : [
        { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
        { name: 'Timetable', href: '/student/timetable', icon: CalendarDays },
        { name: 'Messages',   href: '/student/messenger', icon: MessageCircle },
        { name: 'Attendance', href: '/student/attendance', icon: Users },
        { name: 'Alerts',      href: '/student/alerts', icon: BellRing },
      ]

  const colorClasses = role === 'admin' 
    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 shadow-indigo-500/20' 
    : role === 'teacher'
    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 shadow-emerald-500/20'
    : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-blue-200 shadow-blue-500/20'

  const activeLinkClass = role === 'admin' 
    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
    : role === 'teacher'
    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${role === 'admin' ? 'bg-indigo-600' : role === 'teacher' ? 'bg-emerald-700' : 'bg-blue-600'} text-white shadow-lg`}>
            <BellRing className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {links.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive 
                ? activeLinkClass
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-4 px-3 flex items-center gap-3">
          <div className={`h-8 w-8 rounded-full flex justify-center items-center font-bold uppercase ${
            role === 'admin' ? 'bg-indigo-100 text-indigo-700' : role === 'teacher' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {role[0]}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {role} Portal
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all">
            <LogOut className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}

