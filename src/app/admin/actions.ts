'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveLeave(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const leaveId = formData.get('leave_id') as string

  const { error } = await supabase
    .from('leave_requests')
    .update({ 
      status: 'approved', 
      reviewed_by: user.id, 
      updated_at: new Date().toISOString() 
    })
    .eq('leave_id', leaveId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/approvals')
}

export async function rejectLeave(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const leaveId = formData.get('leave_id') as string

  const { error } = await supabase
    .from('leave_requests')
    .update({ 
      status: 'rejected', 
      reviewed_by: user.id, 
      updated_at: new Date().toISOString() 
    })
    .eq('leave_id', leaveId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/approvals')
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const targetRole = formData.get('target_role') as string || 'all'
  const targetDept = formData.get('department') as string || 'all'
  const targetYear = formData.get('year') as string || 'all'
  const targetDiv = formData.get('division') as string || 'all'

  // 1. Create central announcement record
  const { data: announcement, error } = await supabase.from('announcements').insert({
    title,
    message,
    target_role: targetRole,
    created_by: user.id,
  }).select().single()

  if (error) throw new Error(error.message)

  // 2. Identify target users for individual notifications (Fan-out)
  let userQuery = supabase.from('users').select('user_id')
  
  if (targetRole !== 'all') {
    userQuery = userQuery.eq('role', targetRole)
  }
  
  if (targetRole === 'student') {
    if (targetDept !== 'all') userQuery = userQuery.eq('department', targetDept)
    if (targetYear !== 'all') userQuery = userQuery.eq('semester', parseInt(targetYear))
    if (targetDiv !== 'all') userQuery = userQuery.eq('division', targetDiv)
  }

  const { data: targetUsers, error: queryErr } = await userQuery
  if (queryErr) throw new Error(queryErr.message)

  if (targetUsers && targetUsers.length > 0) {
    const notifyRecords = targetUsers.map(u => ({
      user_id: u.user_id,
      message: `[Announcement]: ${title} - ${message}`,
      type: 'announcement',
      read_status: false
    }))
    
    // Insert in batches of 100 to avoid request heavy overhead
    for (let i = 0; i < notifyRecords.length; i += 100) {
      await supabase.from('notifications').insert(notifyRecords.slice(i, i + 100))
    }
  }

  revalidatePath('/student')
  revalidatePath('/teacher')
  revalidatePath('/admin')
}
