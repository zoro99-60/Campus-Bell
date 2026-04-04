import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default async function TeacherHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('attendance_sessions')
    .select(`
      session_id,
      session_date,
      is_locked,
      timetable:timetable_id (
        subject,
        classroom,
        start_time,
        department,
        year,
        division
      )
    `)
    .eq('teacher_id', user?.id)
    .order('session_date', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Attendance History</h1>
      <p className="text-sm text-slate-500 mb-6">View and manage past attendance records</p>

      {(!sessions || sessions.length === 0) ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
           <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
           <p>No history found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: any) => (
            <div key={session.session_id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{session.timetable?.subject}</h3>
                  {session.is_locked ? (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Locked</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Open</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {format(new Date(session.session_date), 'PPP')} · {session.timetable?.department} Y{session.timetable?.year} {session.timetable?.division}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">{session.timetable?.classroom}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{session.timetable?.start_time.substring(0, 5)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
