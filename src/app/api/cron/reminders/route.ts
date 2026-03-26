import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const now = new Date()
  const todayStr = now.toLocaleDateString('en-US', { weekday: 'long' })
  
  const { data: lectures, error: lecError } = await supabase
    .from('timetable')
    .select('*')
    .eq('day', todayStr)
  
  if (lecError || !lectures) {
    return NextResponse.json({ error: lecError?.message }, { status: 500 })
  }

  // Filter lectures starting within the next 15 minutes
  const upcomingLectures = lectures.filter((l) => {
    const [lHr, lMin] = l.start_time.split(':').map(Number)
    const lecTime = new Date()
    lecTime.setHours(lHr, lMin, 0, 0)
    
    // Calculate difference in absolute minutes
    const diffMins = (lecTime.getTime() - now.getTime()) / 60000
    // If it's starting between 0-15 minutes from right now
    return diffMins > 0 && diffMins <= 15
  })

  if (upcomingLectures.length === 0) {
    return NextResponse.json({ success: true, message: 'No classes in the 15m window.' })
  }

  let notificationsCreated = 0

  for (const lecture of upcomingLectures) {
    const { data: students } = await supabase
      .from('users')
      .select('user_id')
      .eq('role', 'student')
      .eq('department', lecture.department)
      .eq('year', lecture.year)
      .eq('division', lecture.division)

    if (students && students.length > 0) {
      const msgs = students.map((s) => ({
        user_id: s.user_id,
        message: `Reminder: ${lecture.subject} lecture by ${lecture.faculty} starts shortly in ${lecture.classroom}.`,
        type: 'lecture_reminder'
      }))
      await supabase.from('notifications').insert(msgs)
      notificationsCreated += msgs.length
    }
  }

  return NextResponse.json({ 
    success: true, 
    lecturesProcessed: upcomingLectures.length, 
    notificationsCreated 
  })
}
