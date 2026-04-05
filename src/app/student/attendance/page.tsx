import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

export default async function StudentAttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users').select('*').eq('user_id', user?.id).single()

  const { data: studentProfile } = await supabase
    .from('student_profiles').select('*').eq('user_id', user?.id).single()

  const { data: allTimetable } = await supabase
    .from('v_timetable').select('entry_id, subject')
    .eq('department', studentProfile?.department || '')
    .eq('semester', studentProfile?.semester || 0)
    .eq('division', studentProfile?.division || '')

  const { data: allAttendance } = await supabase
    .from('attendance').select('*').eq('user_id', user?.id)

  // Group by subject
  const subjectMap: Record<string, { present: number; total: number; entries: string[] }> = {}
  
  // Initialize from timetable
  allTimetable?.forEach(t => {
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { present: 0, total: 0, entries: [] }
    subjectMap[t.subject].entries.push(t.entry_id)
  })

  // Aggregate attendance
  allAttendance?.forEach(a => {
    const t = allTimetable?.find(tt => tt.entry_id === a.timetable_entry_id)
    if (t && subjectMap[t.subject]) {
      subjectMap[t.subject].total++
      if (a.status === 'present') subjectMap[t.subject].present++
    }
  })

  const subjects = Object.entries(subjectMap)

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Attendance History</h1>
      <p className="text-sm text-slate-500 mb-6">{profile?.department} · Sem {profile?.semester} · Div {profile?.division}</p>

      {subjects.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No attendance records yet.</div>
      ) : (
        <div className="space-y-3">
          {subjects.map(([subject, data]) => {
            const pct = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
            const isLow = pct < 75
            const classesNeeded = isLow ? Math.ceil((0.75 * data.total - data.present) / 0.25) : 0
            return (
              <div key={subject} className={`bg-white rounded-2xl p-4 border ${isLow ? 'border-red-200' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{subject}</h3>
                    {isLow && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                  <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>{pct}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? 'bg-red-400' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{data.present} present / {data.total} total</span>
                  {isLow && (
                    <span className="text-red-500 font-medium">Need {classesNeeded} more to reach 75%</span>
                  )}
                </div>
                {/* Divider line */}
                <div className="border-t border-slate-100 mt-3 pt-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {data.present} present
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="h-3.5 w-3.5" /> {data.total - data.present} absent
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
