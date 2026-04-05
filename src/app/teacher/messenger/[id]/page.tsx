import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ChatBoard } from '@/app/shared-messenger/ChatBoard'

export default async function TeacherChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const conversationId = params.id

  // Verify participation & Get student info
  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      *,
      student:student_id (name, profile_year, profile_division)
    `)
    .eq('conversation_id', conversationId)
    .single()

  if (!conv || conv.teacher_id !== user.id) {
    redirect('/teacher/messenger')
  }

  const student = Array.isArray(conv.student) ? conv.student[0] : conv.student

  return (
    <div className="h-screen flex flex-col">
       <ChatBoard 
         conversationId={conversationId}
         currentUserId={user.id}
         currentUserRole="teacher"
         otherUser={{
           name: student?.name || 'Student',
           subtext: `Year ${student?.profile_year} · Division ${student?.profile_division}`,
           avatarInitials: student?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'ST'
         }}
       />
    </div>
  )
}
