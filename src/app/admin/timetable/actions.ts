'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addLecture(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const lecture = {
    day: formData.get('day') as string,
    subject: formData.get('subject') as string,
    faculty: formData.get('faculty') as string,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    classroom: formData.get('classroom') as string,
    department: (formData.get('department') as string).toUpperCase(),
    year: parseInt(formData.get('year') as string, 10),
    division: (formData.get('division') as string).toUpperCase()
  }

  const { error } = await supabase.from('timetable').insert(lecture)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/timetable')
}

export async function deleteLecture(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const timetable_id = formData.get('timetable_id') as string

  // Fetch before deleting to capture context for Notifications
  const { data: oldData } = await supabase.from('timetable').select('*').eq('timetable_id', timetable_id).single()
  
  if (oldData) {
    // Notify affected students immediately
    const { data: students } = await supabase.from('users')
      .select('user_id')
      .eq('role', 'student')
      .eq('department', oldData.department)
      .eq('year', oldData.year)
      .eq('division', oldData.division)

    if (students && students.length > 0) {
      const msgs = students.map((s) => ({
        user_id: s.user_id,
        message: `Alert: Your ${oldData.subject} lecture on ${oldData.day} (${oldData.start_time}) has been canceled.`,
        type: 'change_alert'
      }))
      await supabase.from('notifications').insert(msgs)
    }
  }

  const { error } = await supabase.from('timetable').delete().eq('timetable_id', timetable_id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/timetable')
}
