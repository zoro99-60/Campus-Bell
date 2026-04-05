import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Search, ChevronLeft, MessageCircle, BookOpen } from 'lucide-react'

export default async function TeacherDirectoryPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from('v_users')
    .select('user_id, name, subject, department')
    .eq('role', 'teacher')
    .eq('active', true)
    .order('name')

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/student/messenger" className="h-10 w-10 flex items-center justify-center bg-white rounded-2xl border border-slate-100 text-slate-400">
           <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Faculty Directory</h1>
          <p className="text-xs text-slate-500">Select a teacher to start chatting</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search by name or subject..." 
          className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid gap-3">
        {(!teachers || teachers.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 text-sm">No teachers available</p>
          </div>
        ) : (
          teachers.map(t => (
            <div key={t.user_id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 group">
               <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                 {t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{t.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <BookOpen className="h-3 w-3 text-blue-500" />
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t.subject || 'Faculty'}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.department}</p>
               </div>
               <Link 
                 href={`/student/messenger/new?teacherId=${t.user_id}`}
                 className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
               >
                 <MessageCircle className="h-5 w-5" />
               </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
