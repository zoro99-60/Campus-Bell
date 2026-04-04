'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Bell, User, Clock, Users, BarChart3, Settings } from 'lucide-react'

const studentLinks = [
  { name: 'Home',      href: '/student',            icon: Home },
  { name: 'Timetable', href: '/student/timetable',  icon: Calendar },
  { name: 'Alerts',    href: '/student/alerts',     icon: Bell },
  { name: 'Profile',   href: '/student/profile',    icon: User },
  { name: 'History',   href: '/student/attendance', icon: Clock },
]

const teacherLinks = [
  { name: 'Home',      href: '/teacher',            icon: Home },
  { name: 'Timetable', href: '/teacher/timetable',  icon: Calendar },
  { name: 'Alerts',    href: '/teacher/alerts',     icon: Bell },
  { name: 'Students',  href: '/teacher/students',   icon: Users },
  { name: 'History',   href: '/teacher/history',    icon: Clock },
]

const adminLinks = [
  { name: 'Home',      href: '/admin',              icon: Home },
  { name: 'Students',  href: '/admin/students',     icon: Users },
  { name: 'Alerts',    href: '/admin/announcements',icon: Bell },
  { name: 'Reports',   href: '/admin/reports',      icon: BarChart3 },
  { name: 'Manage',    href: '/admin/timetable',    icon: Settings },
]

const colorMap = {
  student: { active: 'text-blue-600', bg: 'bg-blue-600', dot: 'bg-blue-600' },
  teacher: { active: 'text-emerald-600', bg: 'bg-emerald-600', dot: 'bg-emerald-600' },
  admin:   { active: 'text-indigo-700', bg: 'bg-indigo-700', dot: 'bg-indigo-700' },
}

export function BottomNav({ role, unreadCount = 0 }: { role: 'student' | 'teacher' | 'admin', unreadCount?: number }) {
  const pathname = usePathname()
  const links = role === 'student' ? studentLinks : role === 'teacher' ? teacherLinks : adminLinks
  const colors = colorMap[role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 px-2 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {links.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/student' && item.href !== '/teacher' && item.href !== '/admin' && pathname.startsWith(item.href))
          const isAlerts = item.name === 'Alerts'
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[52px] py-1 rounded-xl transition-all ${isActive ? colors.active : 'text-slate-400'}`}
            >
              <div className="relative">
                {isActive ? (
                  <div className={`absolute -inset-2 ${colors.bg} rounded-full opacity-10`} />
                ) : null}
                <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {isAlerts && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white z-20">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
