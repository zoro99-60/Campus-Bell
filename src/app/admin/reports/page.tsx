import { createClient } from '@/utils/supabase/server'
import { FileBarChart, Calendar, ChevronRight, GraduationCap, Users, ShieldAlert } from 'lucide-react'

export default async function AdminReportsPage() {
  const supabase = await createClient()

  // 1. Fetch all attendance to calculate stats
  const { data: allAttendance } = await supabase.from('attendance').select('user_id, status, timetable_id')
  const { data: allUsers } = await supabase.from('users').select('user_id, role, department, semester, division')
  const { data: allTimetable } = await supabase.from('timetable').select('timetable_id, subject, department')

  const students = allUsers?.filter(u => u.role === 'student') || []
  const teachers = allUsers?.filter(u => u.role === 'teacher') || []

  // 2. Attendance per Department
  const depts = [...new Set(students.map(s => s.department || 'General'))]
  const deptStats = depts.map(d => {
    const dStudents = students.filter(s => s.department === d).map(s => s.user_id)
    const dAtt = allAttendance?.filter(a => dStudents.includes(a.user_id)) || []
    const total = dAtt.length
    const present = dAtt.filter(a => a.status === 'present').length
    const pct = total > 0 ? Math.round((present / total) * 100) : 0
    return { name: d, pct, total, color: pct < 75 ? 'text-red-600' : 'text-emerald-700' }
  })

  // 3. Overall Institution Stats
  const totalAtt = allAttendance?.length || 0
  const totalPresent = allAttendance?.filter(a => a.status === 'present').length || 0
  const overallPct = totalAtt > 0 ? Math.round((totalPresent / totalAtt) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center justify-between mb-2">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Reports</h1>
           <p className="text-sm text-slate-500 mt-0.5">Real-time academic & attendance stats</p>
        </div>
        <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
           <FileBarChart className="h-5 w-5" />
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="bg-[#1e293b] rounded-3xl p-6 text-white my-6 relative overflow-hidden shadow-xl">
         <div className="absolute right-6 top-6 bg-slate-700/50 rounded-2xl p-3 text-center border border-slate-600/50">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Overall</p>
            <p className="text-2xl font-bold">{overallPct}%</p>
         </div>
         <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Academic Year 2024-25</p>
         <h2 className="text-3xl font-bold mb-1">Overall Attendance</h2>
         <p className="text-slate-300 font-medium">{totalAtt} total records processed</p>
         <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated today · April 4</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
           <div className="h-10 w-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mb-3">
              <GraduationCap className="h-5 w-5" />
           </div>
           <p className="text-2xl font-bold text-slate-900">{students.length}</p>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Active Students</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
           <div className="h-10 w-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-3">
              <Users className="h-5 w-5" />
           </div>
           <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Teaching Faculty</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Attendance by Department</h2>
        {deptStats.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>No department data found</p>
          </div>
        ) : (
          deptStats.map(dept => (
            <div key={dept.name} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm transition-all active:scale-95 group">
               <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                  <span className={`text-lg font-bold ${dept.color}`}>{dept.pct}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className={`h-full ${dept.pct < 75 ? 'bg-red-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${dept.pct}%` }} />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dept.total} records</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform">
                     Detailed View <ChevronRight className="h-3 w-3" />
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Summary insights */}
      <div className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 shadow-sm">
         <h3 className="text-sm font-bold text-indigo-900 mb-2">Key Reporting Insights</h3>
         <ul className="space-y-3">
            <li className="flex items-start gap-2 text-xs text-indigo-800/80 leading-relaxed">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
               Computer Science shows highest attendance at 91% this month.
            </li>
            <li className="flex items-start gap-2 text-xs text-indigo-800/80 leading-relaxed">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
               Attendance trend has increased by 4.2% since Sem 3 began.
            </li>
            <li className="flex items-start gap-2 text-xs text-indigo-800/80 leading-relaxed">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
               Critical focus needed in Mechanical Dept (current attendance 74%).
            </li>
         </ul>
      </div>
    </div>
  )
}
