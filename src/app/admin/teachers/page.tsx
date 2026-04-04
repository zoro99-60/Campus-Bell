import { createClient } from '@/utils/supabase/server'
import { Plus, Search, UserMinus, ShieldAlert, BookOpen } from 'lucide-react'

export default async function AdminTeachersPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from('users')
    .select(`
      user_id,
      name,
      email,
      department,
      active,
      timetable:timetable (subject)
    `)
    .eq('role', 'teacher')
    .order('name')

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{teachers?.length || 0} total faculty</p>
        </div>
        <button className="h-10 w-10 flex items-center justify-center bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
           <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mb-6">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
         <input 
           placeholder="Search teachers by name..." 
           className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 ring-emerald-500/20 outline-none"
         />
      </div>

      <div className="space-y-3">
        {(!teachers || teachers.length === 0) ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>No teachers found</p>
          </div>
        ) : (
          teachers.map(teacher => (
            <div key={teacher.user_id} className="bg-white rounded-3xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
               <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {teacher.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
               </div>
               <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{teacher.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{teacher.department} Dept · {teacher.email}</p>
               </div>
               <div className="flex gap-2">
                  <button className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                     <UserMinus className="h-4 w-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
