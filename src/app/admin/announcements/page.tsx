import { createClient } from '@/utils/supabase/server'
import { Megaphone, Plus, Send, Clock, User } from 'lucide-react'
import { createAnnouncement } from '@/app/admin/actions'
import { formatDistanceToNow } from 'date-fns'

import { AdminAnnouncementForm } from './AdminAnnouncementForm'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      *,
      author:created_by (name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Announcements</h1>
           <p className="text-sm text-slate-500 mt-0.5">Push updates to students & faculty</p>
        </div>
        <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
           <Megaphone className="h-5 w-5" />
        </div>
      </div>

      {/* Interactive Announcement Form */}
      <AdminAnnouncementForm />

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Past Announcements</h2>
        {(!announcements || announcements.length === 0) ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>No announcements yet</p>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.announcement_id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3 group transition-all">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight 
                    ${ann.target_role === 'student' ? 'bg-blue-100 text-blue-700' : 
                      ann.target_role === 'teacher' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {ann.target_role}
                  </span>
               </div>
               <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>
               <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                     <User className="h-3 w-3" />
                     <span>{ann.author?.name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                     <Clock className="h-3 w-3" />
                     <span>{formatDistanceToNow(new Date(ann.created_at), { addSuffix: true })}</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
