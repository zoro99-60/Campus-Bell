'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getOrCreateConversation, sendMessage } from '@/app/messages/actions'

/**
 * Handles the 'Mark as Read' and optional 'Reply' action from a notification.
 */
export async function handleNotificationAction(notificationId: string, replyContent?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 1. Mark notification as read
  await supabase.from('notifications')
    .update({ read_status: true })
    .eq('notification_id', notificationId)

  // 2. If it's a message reply, handle conversation
  if (replyContent) {
    // We need to find who sent this notification to reply back
    const { data: note } = await supabase
      .from('notifications')
      .select('sender_id, type')
      .eq('notification_id', notificationId)
      .single()

    if (note?.sender_id) {
       const convId = await getOrCreateConversation(note.sender_id)
       await sendMessage(convId, replyContent)
       revalidatePath(`/student/messenger/${convId}`)
    }
  }

  revalidatePath('/student/alerts')
  revalidatePath('/student')
}

/**
 * Redirects to the conversation with a teacher.
 */
export async function startTeacherChat(teacherId: string) {
  const convId = await getOrCreateConversation(teacherId)
  redirect(`/student/messenger/${convId}`)
}
