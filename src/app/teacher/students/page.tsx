import { createClient } from '@/utils/supabase/server'
import { Users, Search, Mail, Phone, MapPin } from 'lucide-react'

export default async function TeacherStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('v_users').select('department, year, division').eq('user_id', user?.id).single()

  const { data: students } = await supabase
    .from('v_users')
    .select('*')
    .eq('role', 'student')
    .eq('department', profile?.department || '')
    .eq('year', profile?.year || 1)
    .eq('division', profile?.division || '')
    .order('name')

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Students</h1>
          <p className="text-sm text-slate-500">Managing {students?.length || 0} students in {profile?.department} {profile?.year}-{profile?.division}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Users className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search students..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
        />
      </div>

      <div className="space-y-3">
        {(!students || students.length === 0) ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
             <p>No students found in your batch</p>
          </div>
        ) : students.map((student: any) => (
          <div key={student.user_id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{student.name}</h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{student.roll_number || 'No Roll No'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Mail className="h-3 w-3 text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Div {student.division}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
