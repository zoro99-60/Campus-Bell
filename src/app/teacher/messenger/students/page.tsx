import { createClient } from '@/utils/supabase/server'
import { StudentFilter } from './StudentFilter'

export default async function TeacherStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('v_users')
    .select('user_id, name, profile_year, profile_division, department, roll_number')
    .eq('role', 'student')
    .eq('active', true)
    .order('name')

  return (
    <StudentFilter students={students || []} />
  )
}
