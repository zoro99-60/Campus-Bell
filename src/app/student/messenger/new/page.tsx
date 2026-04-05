import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewConversationPage({ searchParams }: { searchParams: { teacherId?: string } }) {
  const teacherId = searchParams.teacherId
  if (!teacherId) redirect('/student/messenger')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('conversation_id')
    .eq('student_id', user.id)
    .eq('teacher_id', teacherId)
    .single()

  if (existing) {
    redirect(`/student/messenger/${existing.conversation_id}`)
  }

  // Create new
  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      student_id: user.id,
      teacher_id: teacherId
    })
    .select('conversation_id')
    .single()

  if (error) {
    console.error('Failed to create:', error)
    redirect('/student/messenger')
  }

  redirect(`/student/messenger/${created.conversation_id}`)
}
