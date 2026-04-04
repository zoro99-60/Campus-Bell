import { createClient } from '@/utils/supabase/server'
import { Plus, Search, UserMinus, UserCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { toggleUserActive, deleteUser } from '@/app/auth/actions'
import { ActionButton } from '@/components/admin/ActionButton'

export default async function AdminStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('v_users')
    .select('*')
    .eq('role', 'student')
    .order('name')

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{students?.length || 0} total enrolled</p>
        </div>
        <button className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
           <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
         <input 
           placeholder="Search students by name or roll..." 
           className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 ring-indigo-500/20 outline-none"
         />
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {(!students || students.length === 0) ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>No students found</p>
          </div>
        ) : (
          students.map(student => (
            <div key={student.user_id} className="bg-white rounded-3xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm group transition-all">
               <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
                  {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-900 truncate">{student.name}</p>
                    {!student.active && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tight">Deactivated</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{student.roll_number || 'No Roll #'} · {student.department} Sem {student.semester}</p>
               </div>
               
               <div className="flex gap-2">
                  <ActionButton 
                    action={toggleUserActive} 
                    userId={student.user_id} 
                    active={student.active} 
                    type="toggle" 
                    variant="student"
                  />

                  <ActionButton 
                    action={deleteUser} 
                    userId={student.user_id} 
                    type="delete" 
                    confirmMessage="Delete student record permanently?"
                  />
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

