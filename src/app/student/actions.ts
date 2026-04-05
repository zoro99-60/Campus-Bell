'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Checks for upcoming lectures in the current student's division starting in 10-15 minutes.
 * If found, creates a 'lecture_reminder' notification if not already notified.
 */
export async function checkAndPushReminders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 1. Get student profile for division context
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('department, semester, division')
    .eq('user_id', user.id)
    .single()

  if (!profile) return

  // 2. Fetch today's schedule for this division
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const { data: schedule } = await supabase
    .from('v_timetable')
    .select('*')
    .eq('department', profile.department)
    .eq('semester', profile.semester)
    .eq('division', profile.division)
    .eq('day', todayStr)

  if (!schedule || schedule.length === 0) return

  const now = new Date()
  const reminders = []

  for (const lecture of schedule) {
    const [h, m] = lecture.start_time.split(':').map(Number)
    const start = new Date(); start.setHours(h, m, 0, 0)
    
    // Check if starts in 10-15 minutes
    const diffMin = (start.getTime() - now.getTime()) / 60000
    
    if (diffMin > 0 && diffMin <= 15) {
      // 3. Check if already notified for THIS lecture ID TODAY
      const dateStr = now.toISOString().split('T')[0]
      const { data: existing } = await supabase
        .from('notifications')
        .select('notification_id')
        .eq('user_id', user.id)
        .eq('type', 'lecture_reminder')
        .ilike('message', `%${lecture.subject}%`)
        .gte('created_at', dateStr)
        .single()

      if (!existing) {
        reminders.push({
          user_id: user.id,
          type: 'lecture_reminder',
          message: `Reminder: ${lecture.subject} by prof. ${lecture.faculty.split(' ').pop()} starts in ${Math.round(diffMin)} minutes at ${lecture.classroom}.`,
          read_status: false
        })
      }
    }
  }

  if (reminders.length > 0) {
    await supabase.from('notifications').insert(reminders)
    revalidatePath('/student')
    revalidatePath('/student/alerts')
  }
}
