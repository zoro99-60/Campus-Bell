import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const DAYS_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default async function TeacherTimetablePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const { data: timetable } = await supabase
    .from('timetable').select('*')
    .eq('teacher_user_id', user?.id)
    .order('start_time')

  const grouped: Record<string, any[]> = {}
  DAYS_ORDER.forEach(d => { grouped[d] = [] })
  timetable?.forEach(t => { if (grouped[t.day]) grouped[t.day].push(t) })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Teaching Schedule</h1>
      <p className="text-sm text-slate-500 mb-6">Tap a class to mark attendance</p>

      <div className="space-y-5">
        {DAYS_ORDER.map(day => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${day === todayStr ? 'text-emerald-700' : 'text-slate-400'}`}>{day}</h2>
              {day === todayStr && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Today</span>}
            </div>
            {grouped[day].length === 0 ? (
              <div className="bg-white rounded-2xl p-3 border border-dashed border-slate-200 text-center text-xs text-slate-400">No classes</div>
            ) : (
              <div className="space-y-2">
                {grouped[day].map(lecture => (
                  <Link
                    key={lecture.timetable_id}
                    href={day === todayStr ? `/teacher/attendance?timetable_id=${lecture.timetable_id}` : '#'}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 flex items-center gap-3 hover:border-emerald-300 transition-all"
                  >
                    <div className="min-w-20 text-center">
                      <p className="text-xs font-bold text-slate-900">{lecture.start_time.substring(0,5)}</p>
                      <p className="text-[10px] text-slate-400">–{lecture.end_time.substring(0,5)}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{lecture.subject}</p>
                      <p className="text-xs text-slate-400">{lecture.classroom} · {lecture.department} Y{lecture.year} {lecture.division}</p>
                    </div>
                    {day === todayStr && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">Mark</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
