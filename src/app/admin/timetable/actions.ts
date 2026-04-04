'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addLecture(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const department = (formData.get('department') as string).toUpperCase()
  const semester = parseInt(formData.get('year') as string, 10) // Mapped from legacy 'year'
  const division = (formData.get('division') as string).toUpperCase()
  const subjectName = formData.get('subject') as string
  const roomNumber = formData.get('classroom') as string

  // 1. Ensure Subject exists
  let { data: subject } = await supabase.from('subjects').select('id').eq('name', subjectName).eq('department', department).eq('semester', semester).single()
  if (!subject) {
    const { data: newSub, error: subErr } = await supabase.from('subjects').insert({ name: subjectName, department, semester }).select('id').single()
    if (subErr || !newSub) throw new Error('Failed to create or find subject')
    subject = newSub
  }

  // 2. Ensure Classroom exists
  let { data: classroom } = await supabase.from('classrooms').select('id').eq('room_number', roomNumber).single()
  if (!classroom) {
    const { data: newRoom, error: roomErr } = await supabase.from('classrooms').insert({ room_number: roomNumber }).select('id').single()
    if (roomErr || !newRoom) throw new Error('Failed to create or find classroom')
    classroom = newRoom
  }

  // 3. Ensure Timetable (Parent) exists
  let { data: parentTt } = await supabase.from('timetables').select('id').eq('department', department).eq('semester', semester).eq('division', division).single()
  if (!parentTt) {
    const { data: newParent, error: parentErr } = await supabase.from('timetables').insert({ department, semester, division, created_by: user.id }).select('id').single()
    if (parentErr || !newParent) throw new Error('Failed to create or find timetable parent')
    parentTt = newParent
  }

  // 4. Resolve Teacher ID
  const facultyName = formData.get('faculty') as string
  let { data: teacher } = await supabase.from('users').select('user_id').eq('name', facultyName).eq('role', 'teacher').single()

  // 5. Create Timetable Entry
  const { data: newEntry, error } = await supabase.from('timetable_entries').insert({
    timetable_id: parentTt.id,
    day_of_week: formData.get('day') as string,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    subject_id: subject.id,
    classroom_id: classroom.id,
    teacher_user_id: teacher?.user_id || user.id,
    notes: facultyName
  }).select('id').single()

  if (error || !newEntry) throw new Error(error?.message || 'Failed to create entry')

  // LOG CHANGE
  await supabase.from('timetable_change_logs').insert({
    timetable_entry_id: newEntry.id,
    changed_by_user_id: user.id,
    change_type: 'CREATE',
    new_value: { 
      subject: subjectName, 
      room: roomNumber, 
      day: formData.get('day'), 
      start: formData.get('start_time') 
    }
  })

  revalidatePath('/admin/timetable')
}

export async function deleteLecture(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const entry_id = formData.get('timetable_id') as string

  const { data: oldData } = await supabase
    .from('timetable_entries')
    .select('day_of_week, start_time, timetables(department, semester, division), subjects(name), classroom_id, teacher_user_id')
    .eq('id', entry_id)
    .single()
  
  if (oldData && oldData.timetables && oldData.subjects) {
    const tt = oldData.timetables as any
    const sub = oldData.subjects as any
    
    // Notify students
    const { data: students } = await supabase.from('student_profiles')
      .select('user_id')
      .eq('department', tt.department)
      .eq('semester', tt.semester)
      .eq('division', tt.division)

    if (students && students.length > 0) {
      const msgs = students.map((s) => ({
        user_id: s.user_id,
        message: `Alert: Your ${sub.name} lecture on ${oldData.day_of_week} (${oldData.start_time}) has been canceled.`,
        type: 'change_alert'
      }))
      await supabase.from('notifications').insert(msgs)
    }

    // LOG CHANGE
    await supabase.from('timetable_change_logs').insert({
      timetable_entry_id: entry_id,
      changed_by_user_id: user.id,
      change_type: 'DELETE',
      old_value: oldData
    })
  }

  const { error } = await supabase.from('timetable_entries').delete().eq('id', entry_id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/timetable')
}
