import { createClient } from '@/utils/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { Bell, AlertTriangle, Calendar } from 'lucide-react'

export default async function StudentAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from('notifications').select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  // Mark all as read after viewing
  await supabase.from('notifications')
    .update({ read_status: true })
    .eq('user_id', user?.id)
    .eq('read_status', false)

  const unread = notifications?.filter(n => !n.read_status).length || 0

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">All notifications & updates</p>
        </div>
        {unread > 0 && (
          <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(note => (
            <div
              key={note.notification_id}
              className={`flex gap-3 rounded-2xl p-4 border ${!note.read_status ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'}`}
            >
              <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center
                ${note.type === 'change_alert' ? 'bg-red-100' :
                  note.type === 'lecture_reminder' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                {note.type === 'change_alert' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : note.type === 'lecture_reminder' ? (
                  <Bell className="h-4 w-4 text-blue-600" />
                ) : (
                  <Calendar className="h-4 w-4 text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium leading-snug ${!note.read_status ? 'text-slate-900' : 'text-slate-600'}`}>
                    {note.message}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                    ${note.type === 'change_alert' ? 'bg-red-50 text-red-600' :
                      note.type === 'lecture_reminder' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {note.type === 'change_alert' ? 'Alert' : note.type === 'lecture_reminder' ? 'Reminder' : 'Announcement'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
