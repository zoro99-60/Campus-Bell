import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AttendanceMarker } from '@/components/AttendanceMarker'

export default async function TeacherAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ timetable_id?: string }>
}) {
  const params = await searchParams
  const timetable_id = params.timetable_id

  if (!timetable_id) redirect('/teacher')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: lecture } = await supabase
    .from('timetable').select('*')
    .eq('timetable_id', timetable_id).single()

  if (!lecture) redirect('/teacher')

  const { data: students } = await supabase
    .from('users').select('user_id, name, roll_number')
    .eq('role', 'student')
    .eq('department', lecture.department)
    .eq('year', lecture.year)
    .eq('division', lecture.division)

  const todayStr = new Date().toISOString().split('T')[0]

  // Check if already locked
  const { data: session } = await supabase
    .from('attendance_sessions')
    .select('is_locked')
    .eq('timetable_id', timetable_id)
    .eq('session_date', todayStr)
    .single()

  // Get existing attendance for today
  const { data: existingAtt } = await supabase
    .from('attendance').select('user_id, status')
    .eq('timetable_id', timetable_id)
    .eq('date', todayStr)

  // Get all attendance per student for percentage
  const studentIds = students?.map(s => s.user_id) || []
  const { data: allAtt } = await supabase
    .from('attendance').select('user_id, status')
    .in('user_id', studentIds.length > 0 ? studentIds : ['none'])

  const studentsWithData = (students || []).map(s => {
    const sAtt = allAtt?.filter(a => a.user_id === s.user_id) || []
    const pct = sAtt.length > 0 ? Math.round((sAtt.filter(a => a.status === 'present').length / sAtt.length) * 100) : 100
    const existing = existingAtt?.find(a => a.user_id === s.user_id)
    return {
      ...s,
      pct,
      existingStatus: (existing?.status || null) as 'present' | 'absent' | null,
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{lecture.subject}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {lecture.classroom} · {lecture.department} Sem {lecture.year} · {lecture.division} · {lecture.start_time.substring(0,5)}
        </p>
        <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <AttendanceMarker
        students={studentsWithData}
        timetableId={timetable_id}
        date={todayStr}
        isLocked={session?.is_locked || false}
      />
    </div>
  )
}
