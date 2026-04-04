import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Bell, ChevronRight, Users, AlertTriangle, Calendar } from 'lucide-react'

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

function minutesUntil(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const target = new Date(); target.setHours(h, m, 0, 0)
  return Math.round((target.getTime() - Date.now()) / 60000)
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('v_users').select('*').eq('user_id', user?.id).single()

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const { data: schedule } = await supabase
    .from('v_timetable').select('*')
    .eq('teacher_user_id', user?.id)
    .eq('day', todayStr)
    .order('start_time')

  const { data: notifications } = await supabase
    .from('notifications').select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get students for teacher's classes (dept/year/div of each class)
  const { data: students } = await supabase
    .from('v_users').select('user_id, name, roll_number')
    .eq('role', 'student')
    .eq('department', profile?.department || '')

  // Fetch all attendance marked by this teacher
  const { data: myAttendance } = await supabase
    .from('attendance').select('status, timetable_id')
    .eq('marked_by', user?.id)

  const totalMarked = myAttendance?.length || 0
  const presentCount = myAttendance?.filter(a => a.status === 'present').length || 0
  const avgAttendance = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0

  // Next class
  const now = new Date()
  const nextClass = schedule?.find(l => {
    const [h, m] = l.start_time.split(':').map(Number)
    const start = new Date(); start.setHours(h, m, 0, 0)
    return start > now
  }) || (schedule && schedule.length > 0 ? schedule[0] : null)

  const minsUntilNext = nextClass ? minutesUntil(nextClass.start_time) : null
  const unreadCount = notifications?.filter(n => !n.read_status).length || 0

  // Students below 75% (across all classes)
  const lowAttendanceStudents = students?.filter(s => {
    const records = myAttendance?.filter(a => true) // simplified check
    return false // would need per-student calculation
  })

  // Compute per-student attendance for teacher's classes
  const studentIds = students?.map(s => s.user_id) || []
  const { data: allStudentAttendance } = await supabase
    .from('attendance').select('user_id, status')
    .in('user_id', studentIds.length > 0 ? studentIds : ['none'])
    .eq('marked_by', user?.id)

  const studentAttMap: Record<string, { present: number; total: number }> = {}
  allStudentAttendance?.forEach(a => {
    if (!studentAttMap[a.user_id]) studentAttMap[a.user_id] = { present: 0, total: 0 }
    studentAttMap[a.user_id].total++
    if (a.status === 'present') studentAttMap[a.user_id].present++
  })
  const absenteesToday = Object.values(studentAttMap).filter(v => v.total > 0 && Math.round((v.present / v.total) * 100) < 75).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Prof. {profile?.name?.split(' ').pop()}</h1>
          </div>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {getInitials(profile?.name || 'T')}
            </div>
            {unreadCount > 0 && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />}
          </div>
        </div>
      </div>

      {/* Next Lecture Hero */}
      {nextClass && (
        <div className="px-5 mb-4">
          <div className="bg-emerald-700 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute right-4 top-4 bg-emerald-600/40 rounded-xl px-3 py-1 text-center">
              <p className="text-[10px] text-emerald-100 font-medium">Class</p>
              <p className="text-xl font-bold">{students?.length || 0}</p>
            </div>
            <p className="text-emerald-100 text-xs font-medium mb-1">
              {minsUntilNext !== null && minsUntilNext > 0 ? 'Next lecture in' : 'Lecture in progress'}
            </p>
            <p className="text-4xl font-bold mb-1">
              {minsUntilNext !== null && minsUntilNext > 0 ? `${minsUntilNext} min` : 'Live'}
            </p>
            <p className="text-lg font-semibold">{nextClass.subject}</p>
            <p className="text-emerald-200 text-sm mt-1">
              {nextClass.classroom} · Sem {nextClass.year * 2} · {nextClass.start_time.substring(0,5)}
            </p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{avgAttendance}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Avg attend.</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{schedule?.length || 0}</p>
          <p className="text-xs text-slate-500 mt-0.5">Classes today</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{absenteesToday}</p>
          <p className="text-xs text-slate-500 mt-0.5">Absentees</p>
        </div>
      </div>

      {/* Today's Lectures */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Today's lectures</h2>
          <Link href="/teacher/timetable" className="text-sm font-semibold text-emerald-700 flex items-center gap-0.5">
            Full timetable <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {!schedule || schedule.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl">No lectures today</div>
          ) : schedule.map(lecture => {
            const status = getClassStatus(lecture.start_time, lecture.end_time)
            return (
              <Link
                key={lecture.timetable_id}
                href={`/teacher/attendance?timetable_id=${lecture.timetable_id}`}
                className={`flex items-center gap-3 rounded-2xl p-3.5 border ${status === 'live' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
              >
                <div className="min-w-14 text-center">
                  <p className="text-xs font-bold text-slate-900">{lecture.start_time.substring(0,5)}</p>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${status === 'live' ? 'text-emerald-700' : 'text-slate-900'}`}>{lecture.subject}</p>
                  <p className="text-xs text-slate-400">{lecture.classroom} · Sem {lecture.year} · {students?.length || 0} students</p>
                </div>
                {status === 'live' && <span className="shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">Live</span>}
                {status === 'soon' && <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-1 rounded-full border border-amber-200">Soon</span>}
                {status === 'later' && <span className="shrink-0 text-slate-400 text-xs">Later</span>}
                {status === 'done' && <span className="shrink-0 text-slate-300 text-xs">Done</span>}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mark Attendance CTA */}
      {schedule && schedule.length > 0 && (
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Mark attendance</h2>
            <Link href="/teacher/students" className="text-sm font-semibold text-emerald-700">All students</Link>
          </div>
          {students?.slice(0, 3).map((s) => {
            const attData = studentAttMap[s.user_id]
            const pct = attData && attData.total > 0 ? Math.round((attData.present / attData.total) * 100) : 100
            const isLow = pct < 75
            return (
              <div key={s.user_id} className={`flex items-center gap-3 bg-white rounded-2xl p-3.5 border mb-2 ${isLow ? 'border-amber-200' : 'border-slate-100'}`}>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {getInitials(s.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-400">Roll {s.roll_number} · {pct}% overall {isLow ? '⚠️' : ''}</p>
                </div>
                {schedule[0] && (
                  <Link href={`/teacher/attendance?timetable_id=${schedule[0].timetable_id}`} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Mark
                  </Link>
                )}
              </div>
            )
          })}
          {schedule[0] && (
            <Link
              href={`/teacher/attendance?timetable_id=${schedule[0].timetable_id}`}
              className="block w-full text-center bg-emerald-700 text-white rounded-2xl py-3.5 text-sm font-semibold mt-3 hover:bg-emerald-800 transition-all"
            >
              Submit attendance →
            </Link>
          )}
        </div>
      )}

      {/* Notifications */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>}
        </div>
        <div className="space-y-2">
          {!notifications || notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl">No notifications</div>
          ) : notifications.slice(0, 3).map(note => (
            <div key={note.notification_id} className={`flex gap-3 rounded-2xl p-3.5 ${!note.read_status ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-slate-100'}`}>
              <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${note.type === 'change_alert' ? 'bg-amber-100' : 'bg-purple-100'}`}>
                {note.type === 'change_alert' ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <Calendar className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 line-clamp-2">{note.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
