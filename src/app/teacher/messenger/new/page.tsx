import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TeacherNewConversationPage({ searchParams }: { searchParams: { studentId?: string } }) {
  const studentId = searchParams.studentId
  if (!studentId) redirect('/teacher/messenger')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('conversation_id')
    .eq('student_id', studentId)
    .eq('teacher_id', user.id)
    .single()

  if (existing) {
    redirect(`/teacher/messenger/${existing.conversation_id}`)
  }

  // Create new
  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      student_id: studentId,
      teacher_id: user.id
    })
    .select('conversation_id')
    .single()

  if (error) {
    console.error('Failed to create:', error)
    redirect('/teacher/messenger')
  }

  redirect(`/teacher/messenger/${created.conversation_id}`)
}
