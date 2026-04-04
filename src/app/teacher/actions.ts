'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitAttendance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const timetable_id = formData.get('timetable_id') as string
  const date = formData.get('date') as string
  const entries = JSON.parse(formData.get('entries') as string) as { user_id: string; status: 'present' | 'absent' }[]

  // Create or find session
  let { data: session } = await supabase
    .from('attendance_sessions')
    .select('session_id, is_locked')
    .eq('timetable_id', timetable_id)
    .eq('session_date', date)
    .single()

  if (!session) {
    const { data: newSession } = await supabase
      .from('attendance_sessions')
      .insert({ timetable_id, teacher_id: user.id, session_date: date, is_locked: false })
      .select().single()
    session = newSession
  }

  if (session?.is_locked) {
    return { error: 'Attendance is locked for this session.' }
  }

  // Upsert attendance records
  const records = entries.map(e => ({
    timetable_id,
    user_id: e.user_id,
    date,
    status: e.status,
    marked_by: user.id,
  }))

  await supabase.from('attendance').upsert(records, { onConflict: 'timetable_id,user_id,date' })

  // Lock the session
  if (session?.session_id) {
    await supabase.from('attendance_sessions')
      .update({ is_locked: true })
      .eq('session_id', session.session_id)
  }

  // Notify students below 75%
  for (const e of entries) {
    const { data: allAtt } = await supabase
      .from('attendance').select('status')
      .eq('user_id', e.user_id)

    if (allAtt && allAtt.length > 0) {
      const pct = Math.round((allAtt.filter(a => a.status === 'present').length / allAtt.length) * 100)
      if (pct < 75) {
        const { data: tInfo } = await supabase.from('timetable').select('subject').eq('timetable_id', timetable_id).single()
        await supabase.from('notifications').insert({
          user_id: e.user_id,
          message: `Low attendance warning: ${tInfo?.subject || 'Subject'} — currently at ${pct}%. You need 75% to avoid detention.`,
          type: 'change_alert',
        })
      }
    }
  }

  revalidatePath('/teacher')
  return { success: true }
}

export async function submitLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('leave_requests').insert({
    teacher_id: user.id,
    from_date: formData.get('from_date') as string,
    to_date: formData.get('to_date') as string,
    reason: formData.get('reason') as string,
    substitute_name: formData.get('substitute_name') as string || null,
    status: 'pending',
  })

  if (error) return { error: error.message }

  revalidatePath('/teacher/leave')
  return { success: true }
}
