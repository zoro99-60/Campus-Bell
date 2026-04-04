import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users').select('role').eq('user_id', user.id).single()

  if (profile?.role !== 'student') redirect('/dashboard')

  const { count: unread } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read_status', false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar role="student" />
      </div>
      {/* Main content — padded bottom for mobile nav */}
      <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-0">
        {children}
      </main>
      {/* Mobile Bottom Nav */}
      <BottomNav role="student" unreadCount={unread ?? 0} />
    </div>
  )
}
