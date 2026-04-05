'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Gets or creates a conversation between a student and a teacher.
 * Students usually initiate this, but teachers can too if they have the student ID.
 */
export async function getOrCreateConversation(targetUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get roles to identify who is who
  const { data: currentUser } = await supabase.from('users').select('role').eq('user_id', user.id).single()
  const { data: targetUser } = await supabase.from('users').select('role').eq('user_id', targetUserId).single()

  if (!currentUser || !targetUser) throw new Error('User not found')

  let studentId, teacherId;
  if (currentUser.role === 'student' && targetUser.role === 'teacher') {
    studentId = user.id;
    teacherId = targetUserId;
  } else if (currentUser.role === 'teacher' && targetUser.role === 'student') {
    studentId = targetUserId;
    teacherId = user.id;
  } else {
    throw new Error('Conversations must be between one Student and one Teacher.')
  }

  // Check for existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('student_id', studentId)
    .eq('teacher_id', teacherId)
    .single()

  if (existing) return existing.id

  // Create new conversation
  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ student_id: studentId, teacher_id: teacherId })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return created.id
}

/**
 * Sends a message in a conversation.
 */
export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Verify membership
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, student_id, teacher_id')
    .eq('id', conversationId)
    .single()

  if (!conv || (conv.student_id !== user.id && conv.teacher_id !== user.id)) {
    throw new Error('Permission denied: You are not a member of this conversation.')
  }

  // 2. Insert message
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: content.trim()
  })

  if (error) throw new Error(error.message)

  // 3. Update conversation timestamp for sorting
  await supabase.from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  revalidatePath('/messages')
  revalidatePath(`/messages/${conversationId}`)
}

/**
 * Fetches all conversations for the current user.
 */
export async function getConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users').select('role').eq('user_id', user.id).single()
  if (!profile) throw new Error('Profile not found')

  let query = supabase.from('conversations').select(`
    id,
    updated_at,
    student_profiles!conversations_student_id_fkey (user_id, users(name)),
    teacher_profiles!conversations_teacher_id_fkey (user_id, users(name, department)),
    messages(content, created_at, is_read, sender_id)
  `)

  if (profile.role === 'student') {
    query = query.eq('student_id', user.id)
  } else {
    query = query.eq('teacher_id', user.id)
  }

  // Note: Ordering messages in query is complex; we'll handle sorting in the component
  const { data, error } = await query.order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

/**
 * Fetches message history for a conversation.
 */
export async function getMessages(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Fetch messages
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  // 2. Mark as read (messages not sent by current user)
  await supabase.from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  return data
}
