'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const TEACHERS = [
  { name: 'Priya Gupta', subject: 'MPMC', email: 'priya@pvppcoe.ac.in', teacher_id: 'FAC-MPMC-01' },
  { name: 'Tina Sawant', subject: 'Design Thinking', email: 'tina@pvppcoe.ac.in', teacher_id: 'FAC-DT-02' },
  { name: 'Faina Khan', subject: 'Open Elective', email: 'faina@pvppcoe.ac.in', teacher_id: 'FAC-OE-03' },
  { name: 'Priyanka Rane', subject: 'Computational Theory', email: 'priyanka@pvppcoe.ac.in', teacher_id: 'FAC-CT-04' },
  { name: 'Asharani Shinde', subject: 'Business Model Development', email: 'asharani@pvppcoe.ac.in', teacher_id: 'FAC-BMD-05' }
]

/**
 * Seeds teachers and students.
 * Note: In a real environment, we'd use service_role for Auth.
 * Here, we'll try to use the public users table for seeding metadata 
 * and rely on the UI to handle Auth if needed, or use a workaround.
 */
export async function seedUsersAction() {
  const supabase = await createClient()
  
  // 1. Seed Teachers
  const teacherResults = []
  for (const t of TEACHERS) {
    // Generate a consistent UUID for seeding if needed, or let DB handle
    const { data: newUser, error: uErr } = await supabase.from('users').insert({
      name: t.name,
      email: t.email,
      role: 'teacher',
      department: 'Computer Science',
      active: true
    }).select('user_id').single()

    if (newUser) {
      await supabase.from('teacher_profiles').insert({
        user_id: newUser.user_id,
        teacher_id: t.teacher_id,
        department: 'Computer Science',
        designation: 'Asst. Professor',
        subject: t.subject
      })
      teacherResults.push(t.name)
    }
  }

  // 2. Seed Students (80 students)
  // 10 students per Year (1-4) per Division (A, B) = 8 * 10 = 80
  let studentCounter = 1
  for (let year = 1; year <= 4; year++) {
    for (const div of ['A', 'B']) {
      for (let i = 1; i <= 10; i++) {
        const email = `student${studentCounter}@pvppcoe.ac.in`
        const name = `Student ${studentCounter}`
        
        const { data: sUser } = await supabase.from('users').insert({
          name, email, role: 'student', department: 'Computer Science', active: true
        }).select('user_id').single()

        if (sUser) {
          await supabase.from('student_profiles').insert({
            user_id: sUser.user_id,
            roll_number: `ROLL-${studentCounter.toString().padStart(3, '0')}`,
            department: 'Computer Science',
            year,
            semester: (year * 2) - 1, // Rough estimate
            division: div
          })
        }
        studentCounter++
      }
    }
  }
  
  revalidatePath('/admin/teachers')
  revalidatePath('/admin/students')
  return { success: true, message: `Seeded ${teacherResults.length} teachers and ${studentCounter - 1} students.` }
}
