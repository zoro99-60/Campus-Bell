import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ChatBoard } from '@/app/shared-messenger/ChatBoard'

export default async function StudentChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const conversationId = params.id

  // Verify participation & Get teacher info
  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      *,
      teacher:teacher_id (name, subject)
    `)
    .eq('conversation_id', conversationId)
    .single()

  if (!conv || conv.student_id !== user.id) {
    redirect('/student/messenger')
  }

  const teacher = Array.isArray(conv.teacher) ? conv.teacher[0] : conv.teacher

  return (
    <div className="h-screen flex flex-col">
       <ChatBoard 
         conversationId={conversationId}
         currentUserId={user.id}
         currentUserRole="student"
         otherUser={{
           name: teacher?.name || 'Professor',
           subtext: teacher?.subject || 'Faculty',
           avatarInitials: teacher?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'PR'
         }}
       />
    </div>
  )
}
