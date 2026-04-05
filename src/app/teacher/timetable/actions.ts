'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Updates a lecture's time or room.
 * Enforcement: Only if the teacher is the assigned faculty for that entry.
 */
export async function updateLectureByTeacher(entry_id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Verify Ownership
  const { data: entry, error: fetchErr } = await supabase
    .from('timetable_entries')
    .select('teacher_user_id, start_time, end_time, classroom_id, subjects(name)')
    .eq('id', entry_id)
    .single()

  if (fetchErr || !entry) throw new Error('Entry not found')
  if (entry.teacher_user_id !== user.id) throw new Error('Permission Denied: You are not assigned to this lecture.')

  const newRoom = formData.get('classroom') as string
  const newStart = formData.get('start_time') as string
  const newEnd = formData.get('end_time') as string

  // 2. Resolve Classroom
  let { data: classroom } = await supabase.from('classrooms').select('id').eq('room_number', newRoom).single()
  if (!classroom) {
    const { data: nc } = await supabase.from('classrooms').insert({ room_number: newRoom }).select('id').single()
    classroom = nc
  }

  // 3. Update & Log
  const { error: updateErr } = await supabase
    .from('timetable_entries')
    .update({
      start_time: newStart,
      end_time: newEnd,
      classroom_id: classroom?.id
    })
    .eq('id', entry_id)

  if (updateErr) throw new Error(updateErr.message)

  await supabase.from('timetable_change_logs').insert({
    timetable_entry_id: entry_id,
    changed_by_user_id: user.id,
    change_type: 'UPDATE',
    old_value: { start: entry.start_time, end: entry.end_time, room_id: entry.classroom_id },
    new_value: { start: newStart, end: newEnd, room_number: newRoom }
  })

  revalidatePath('/teacher/timetable')
}

/**
 * Allows teachers to add an 'Extra' lecture.
 * This still requires linking to an existing timetable (dept/sem/div).
 */
export async function addExtraLectureByTeacher(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const subjectName = formData.get('subject') as string
  const roomNumber = formData.get('classroom') as string
  const day = formData.get('day') as string
  const start = formData.get('start_time') as string
  const end = formData.get('end_time') as string

  // 1. Get teacher's primary dept/sem/div from their profile for context
  const { data: profile } = await supabase.from('teacher_profiles').select('*').eq('user_id', user.id).single()
  if (!profile) throw new Error('Teacher profile not found')

  // 2. Ensure Timetable exists for this context
  let { data: timetable } = await supabase.from('timetables')
    .select('id')
    .eq('department', profile.department)
    .eq('semester', profile.year) // normalized sem
    .eq('division', profile.division)
    .single()

  if (!timetable) {
     const { data: nt } = await supabase.from('timetables').insert({
        department: profile.department,
        semester: profile.year,
        division: profile.division,
        created_by: user.id
     }).select('id').single()
     timetable = nt
  }

  // 3. Ensure Subject exists
  let { data: subject } = await supabase.from('subjects').select('id').eq('name', subjectName).eq('department', profile.department).single()
  if (!subject) {
     const { data: ns } = await supabase.from('subjects').insert({ name: subjectName, department: profile.department, semester: profile.year }).select('id').single()
     subject = ns
  }

  // 4. Ensure Classroom exists
  let { data: classroom } = await supabase.from('classrooms').select('id').eq('room_number', roomNumber).single()
  if (!classroom) {
     const { data: nc } = await supabase.from('classrooms').insert({ room_number: roomNumber }).select('id').single()
     classroom = nc
  }

  // 5. Insert Entry
  const { data: entry, error } = await supabase.from('timetable_entries').insert({
     timetable_id: timetable?.id,
     subject_id: subject?.id,
     classroom_id: classroom?.id,
     teacher_user_id: user.id,
     day_of_week: day,
     start_time: start,
     end_time: end,
     notes: 'Extra Class'
  }).select('id').single()

  if (error || !entry) throw new Error(error?.message || 'Failed to add extra class')

  // 6. Log & Notify
  await supabase.from('timetable_change_logs').insert({
    timetable_entry_id: entry.id,
    changed_by_user_id: user.id,
    change_type: 'CREATE',
    new_value: { subject: subjectName, type: 'EXTRA' }
  })

  revalidatePath('/teacher/timetable')
}

/**
 * Sends a notification to all students in a specific division.
 */
export async function sendClassAlert(timetableEntryId: string, message: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Get the division context from the timetable entry
  const { data: entry, error: entryErr } = await supabase
    .from('timetable_entries')
    .select(`
      timetable_id,
      timetables (department, semester, division)
    `)
    .eq('id', timetableEntryId)
    .single()

  if (entryErr || !entry) throw new Error('Timetable entry not found')
  const tt = entry.timetables as any

  // 2. Find all students in that division
  const { data: students, error: studentErr } = await supabase
    .from('student_profiles')
    .select('user_id')
    .eq('department', tt.department)
    .eq('semester', tt.semester)
    .eq('division', tt.division)

  if (studentErr || !students) throw new Error('Could not find students for this division')

  // 3. Batch insert notifications
  const notifyRecords = students.map(s => ({
    user_id: s.user_id,
    message: message,
    type: 'change_alert',
    sender_id: user.id
  }))

  const { error: notifyErr } = await supabase.from('notifications').insert(notifyRecords)
  if (notifyErr) throw new Error(notifyErr.message)

  revalidatePath('/student')
}
