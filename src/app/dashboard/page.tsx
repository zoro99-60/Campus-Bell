import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    redirect('/login')
  }

  // Role-based redirection
  switch (profile.role) {
    case 'admin':
      redirect('/admin')
    case 'teacher':
      redirect('/teacher')
    case 'student':
      redirect('/student')
    default:
      redirect('/login')
  }
}
