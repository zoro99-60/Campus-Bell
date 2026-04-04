import { createClient } from '@/utils/supabase/server'
import { Bell, Clock, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function TeacherAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: alerts } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Alerts & Notifications</h1>
          <p className="text-sm text-slate-500">Stay updated on institutional changes</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
          <Bell className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-4">
        {(!alerts || alerts.length === 0) ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <Info className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No new alerts at the moment</p>
          </div>
        ) : alerts.map((note: any) => (
          <div key={note.notification_id} className={`bg-white rounded-2xl p-4 border ${!note.read_status ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                note.type === 'leave_approved' ? 'bg-green-100 text-green-600' : 
                note.type === 'leave_rejected' ? 'bg-red-100 text-red-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm leading-relaxed ${!note.read_status ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                  {note.message}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
