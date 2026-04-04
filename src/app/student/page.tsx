import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Bell, ChevronRight, CheckCircle2, XCircle, Minus } from 'lucide-react'

function getClassStatus(startTime: string, endTime: string) {
  const now = new Date()
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const start = new Date(); start.setHours(sh, sm, 0, 0)
  const end = new Date(); end.setHours(eh, em, 0, 0)
  const diffMin = (start.getTime() - now.getTime()) / 60000
  if (now >= start && now <= end) return 'live'
  if (diffMin > 0 && diffMin <= 30) return 'soon'
  if (diffMin > 30) return 'later'
  return 'done'
}

function getNextClass(schedule: any[]) {
  const now = new Date()
  return schedule.find(l => {
    const [h, m] = l.start_time.split(':').map(Number)
    const start = new Date(); start.setHours(h, m, 0, 0)
    return start > now
  }) || (schedule.length > 0 ? schedule[0] : null)
}

function minutesUntil(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const target = new Date(); target.setHours(h, m, 0, 0)
  const diff = Math.round((target.getTime() - Date.now()) / 60000)
  return diff
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('v_users').select('*').eq('user_id', user?.id).single()

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayIndex = new Date().getDay()

  const { data: schedule } = await supabase
    .from('v_timetable').select('*')
    .eq('department', profile?.department || '')
    .eq('year', profile?.year || 1)
    .eq('division', profile?.division || '')
    .eq('day', todayStr)
    .order('start_time')

  const { data: notifications } = await supabase
    .from('notifications').select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: allAttendance } = await supabase
    .from('attendance').select('*')
    .eq('user_id', user?.id)

  // Attendance per subject
  const subjectMap: Record<string, { present: number; total: number }> = {}
  const { data: allTimetable } = await supabase
    .from('v_timetable').select('timetable_id,subject')
    .eq('department', profile?.department || '')
    .eq('year', profile?.year || 1)
    .eq('division', profile?.division || '')

  allTimetable?.forEach(t => {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { present: 0, total: 0 }
  })
  allAttendance?.forEach(a => {
    const t = allTimetable?.find(tt => tt.timetable_id === a.timetable_id)
    if (t) {
      if (!subjectMap[t.subject]) subjectMap[t.subject] = { present: 0, total: 0 }
      subjectMap[t.subject].total++
      if (a.status === 'present') subjectMap[t.subject].present++
    }
  })
  const totalPresent = allAttendance?.filter(a => a.status === 'present').length || 0
  const totalClasses = allAttendance?.length || 1
  const overallPct = Math.round((totalPresent / totalClasses) * 100)

  const unreadCount = notifications?.filter(n => !n.read_status).length || 0
  const nextClass = getNextClass(schedule || [])
  const minsUntilNext = nextClass ? minutesUntil(nextClass.start_time) : null

  // Week strip: Mon to Sat attendance
  const weekDays = [1,2,3,4,5,6]
  const weekAttendance: ('present'|'absent'|'today'|'future'|'none')[] = weekDays.map(d => {
    const dayDate = new Date()
    const diff = d - todayIndex
    const target = new Date(dayDate); target.setDate(dayDate.getDate() + diff)
    const dateStr = target.toISOString().split('T')[0]
    if (d === todayIndex) return 'today'
    if (d > todayIndex) return 'future'
    const records = allAttendance?.filter(a => a.date === dateStr) || []
    if (records.length === 0) return 'none'
    const ps = records.filter(r => r.status === 'present').length
    return ps >= records.length / 2 ? 'present' : 'absent'
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Section */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              {profile?.name?.split(' ')[0] || 'Student'}
            </h1>
          </div>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {getInitials(profile?.name || 'S')}
            </div>
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Next Class Hero Card */}
      {nextClass && (
        <div className="px-5 mb-4">
          <div className="bg-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute right-4 top-4 bg-blue-500/40 rounded-xl px-3 py-1 text-center">
              <p className="text-[10px] text-blue-100 font-medium">Sem</p>
              <p className="text-xl font-bold">{profile?.semester || 4}</p>
            </div>
            <p className="text-blue-100 text-xs font-medium mb-1">
              {minsUntilNext !== null && minsUntilNext > 0 ? 'Next class in' : 'Now in progress'}
            </p>
            <p className="text-4xl font-bold mb-1">
              {minsUntilNext !== null && minsUntilNext > 0 ? `${minsUntilNext} min` : 'Live'}
            </p>
            <p className="text-lg font-semibold">{nextClass.subject}</p>
            <p className="text-blue-200 text-sm mt-1">
              {nextClass.classroom} · Prof. {nextClass.faculty.split(' ').pop()} · {nextClass.start_time.substring(0,5)}
            </p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className={`text-2xl font-bold ${overallPct < 75 ? 'text-red-600' : 'text-green-700'}`}>{overallPct}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Attendance</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{schedule?.length || 0}</p>
          <p className="text-xs text-slate-500 mt-0.5">Classes today</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{unreadCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Alerts</p>
        </div>
      </div>

      {/* Today's Lectures */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Today's lectures</h2>
          <Link href="/student/timetable" className="text-sm font-semibold text-blue-600 flex items-center gap-0.5">
            Full timetable <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {!schedule || schedule.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl">No classes today</div>
          ) : schedule.map((lecture) => {
            const status = getClassStatus(lecture.start_time, lecture.end_time)
            return (
              <div
                key={lecture.timetable_id}
                className={`flex items-center gap-3 rounded-2xl p-3.5 border ${status === 'live' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}
              >
                <div className="min-w-14 text-center">
                  <p className="text-xs font-bold text-slate-900">{lecture.start_time.substring(0,5)}</p>
                  <p className="text-[10px] text-slate-400">{parseInt(lecture.start_time) >= 12 ? 'PM' : 'AM'}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${status === 'live' ? 'text-blue-700' : 'text-slate-900'}`}>
                    {lecture.subject}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{lecture.classroom} · Prof. {lecture.faculty.split(' ').pop()}</p>
                </div>
                {status === 'live' && (
                  <span className="shrink-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">Live</span>
                )}
                {status === 'soon' && (
                  <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-1 rounded-full border border-amber-200">Soon</span>
                )}
                {status === 'later' && (
                  <span className="shrink-0 text-slate-400 text-xs font-medium">Later</span>
                )}
                {status === 'done' && (
                  <span className="shrink-0 text-slate-300 text-xs">Done</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="space-y-2">
          {!notifications || notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl">You're all caught up!</div>
          ) : notifications.slice(0, 3).map((note) => (
            <div key={note.notification_id} className={`flex gap-3 rounded-2xl p-3.5 ${!note.read_status ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-slate-100'}`}>
              <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${note.type === 'change_alert' ? 'bg-amber-100 text-amber-600' : note.type === 'lecture_reminder' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${!note.read_status ? 'text-slate-900' : 'text-slate-600'}`}>
                  {note.message}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {notifications && notifications.length > 3 && (
            <Link href="/student/alerts" className="block text-center text-sm font-semibold text-blue-600 py-2">
              View all notifications →
            </Link>
          )}
        </div>
      </div>

      {/* Attendance This Week */}
      <div className="px-5 mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3">Attendance this week</h2>
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <div className="grid grid-cols-6 gap-2">
            {weekDays.map((d, i) => {
              const status = weekAttendance[i]
              const dayName = DAYS[d]
              const isToday = d === todayIndex
              return (
                <div key={d} className="flex flex-col items-center gap-1.5">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all
                    ${status === 'present' ? 'bg-green-100 border-green-200' :
                      status === 'absent' ? 'bg-red-100 border-red-200' :
                      status === 'today' ? 'bg-blue-100 border-blue-400' :
                      'bg-slate-50 border-slate-200'}`}>
                    {status === 'present' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {status === 'absent' && <XCircle className="h-4 w-4 text-red-500" />}
                    {status === 'today' && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                    {(status === 'future' || status === 'none') && <Minus className="h-3 w-3 text-slate-300" />}
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                    {dayName}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Low attendance warning */}
        {overallPct < 75 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">Low Attendance Warning</p>
              <p className="text-xs text-red-500 mt-0.5">Your attendance is below 75%. Risk of detention.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
