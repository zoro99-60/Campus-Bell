'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveLeave(leaveId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('leave_requests')
    .update({ status: 'approved', reviewed_by: user.id, updated_at: new Date().toISOString() })
    .eq('leave_id', leaveId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/approvals')
}

export async function rejectLeave(leaveId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('leave_requests')
    .update({ status: 'rejected', reviewed_by: user.id, updated_at: new Date().toISOString() })
    .eq('leave_id', leaveId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/approvals')
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('announcements').insert({
    title: formData.get('title') as string,
    message: formData.get('message') as string,
    target_role: formData.get('target_role') as string || 'all',
    created_by: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/announcements')
}
