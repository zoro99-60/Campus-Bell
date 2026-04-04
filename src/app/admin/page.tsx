import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  Users, 
  GraduationCap, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Megaphone,
  Plus,
  Calendar,
  FileBarChart,
  Settings
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Total Counts
  const { count: studentCount } = await supabase.from('v_users').select('*', { count: 'exact', head: true }).eq('role', 'student')
  const { count: teacherCount } = await supabase.from('v_users').select('*', { count: 'exact', head: true }).eq('role', 'teacher')
  const { count: pendingLeave } = await supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')

  // 2. Pending Approvals
  const { data: leaves } = await supabase
    .from('leave_requests')
    .select(`
      leave_id,
      from_date,
      to_date,
      reason,
      substitute_name,
      teacher:teacher_id (name, department)
    `)
    .eq('status', 'pending')
    .limit(3)

  // 3. Dept Attendance (Mocked logic but based on real depts)
  const depts = ['Computer Science', 'Electronics', 'Mechanical', 'IT']
  const deptAttendance = [
    { name: 'Computer Science', pct: 91, color: 'bg-emerald-500' },
    { name: 'Electronics',      pct: 83, color: 'bg-blue-500' },
    { name: 'Mechanical',       pct: 74, color: 'bg-amber-500' },
  ]

  // 4. System Alerts (Low attendance students)
  const { data: allAtt } = await supabase.from('attendance').select('user_id, status')
  const studentAttMap: Record<string, { present: number; total: number }> = {}
  allAtt?.forEach(a => {
    if (!studentAttMap[a.user_id]) studentAttMap[a.user_id] = { present: 0, total: 0 }
    studentAttMap[a.user_id].total++
    if (a.status === 'present') studentAttMap[a.user_id].present++
  })
  const lowAttCount = Object.values(studentAttMap).filter(v => v.total > 0 && Math.round((v.present / v.total) * 100) < 75).length

  // 5. Recent Announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2)

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-slate-500 font-medium">Admin Panel</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dr. Anand Kulkarni</h1>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">AK</div>
      </div>

      {/* Institute Overview Hero */}
      <div className="mb-6 mt-4">
        <div className="bg-[#1e293b] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200">
           <div className="absolute right-6 top-6 bg-slate-700/50 rounded-2xl p-3 text-center border border-slate-600/50">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Depts</p>
              <p className="text-2xl font-bold">{depts.length}</p>
           </div>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Institute Overview</p>
           <h2 className="text-3xl font-bold mb-1">Sem 4 · 2025</h2>
           <p className="text-slate-300 font-medium">VIT Engineering College</p>
           <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>Today · Friday, Apr 4</span>
           </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-4 text-center">
           <p className="text-2xl font-bold text-indigo-700">{studentCount || 0}</p>
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-1">Students</p>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 text-center">
           <p className="text-2xl font-bold text-emerald-700">{teacherCount || 0}</p>
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-1">Teachers</p>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-4 text-center relative overflow-hidden">
           {pendingLeave !== null && pendingLeave > 0 && (
             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
           )}
           <p className="text-2xl font-bold text-amber-700">{pendingLeave || 0}</p>
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-1">Pending</p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-bold text-slate-900">Pending approvals</h2>
           <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingLeave || 0} new</span>
        </div>
        <div className="space-y-3">
          {leaves && leaves.map((leave: any) => (
            <div key={leave.leave_id} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm relative overflow-hidden group">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
               <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
                        {Array.isArray(leave.teacher) ? leave.teacher[0]?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : leave.teacher?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Leave – {Array.isArray(leave.teacher) ? leave.teacher[0]?.name : leave.teacher?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{leave.from_date}–{leave.to_date} · {Array.isArray(leave.teacher) ? leave.teacher[0]?.department : leave.teacher?.department} Dept · Substitute needed</p>
                     </div>
                  </div>
                  <div className="flex gap-1.5">
                     <button className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                        <CheckCircle2 className="h-4 w-4" />
                     </button>
                     <button className="h-8 w-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <XCircle className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>
          ))}
          <Link href="/admin/approvals" className="block text-center text-sm font-bold text-indigo-600 mt-2 py-2">View all pending requests →</Link>
        </div>
      </div>

      {/* Dept Attendance Overviews */}
      <div className="mb-8">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Dept. attendance today</h2>
            <Link href="/admin/reports" className="text-sm font-bold text-indigo-600">Full report</Link>
         </div>
         <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-5">
            {deptAttendance.map(dept => (
              <div key={dept.name}>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">{dept.name}</span>
                    <span className="text-sm font-bold text-slate-900">{dept.pct}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${dept.pct}%` }} />
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* System Alerts */}
      <div className="mb-8">
         <h2 className="text-lg font-bold text-slate-900 mb-4">System alerts</h2>
         <div className="space-y-3">
            {lowAttCount > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-4 flex gap-4">
                <div className="h-10 w-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-red-900">Low attendance: {lowAttCount} students</p>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">Now</span>
                   </div>
                   <p className="text-xs text-red-700 mt-0.5">CS Dept · Below 75% threshold</p>
                </div>
              </div>
            )}
            
            {announcements && announcements.map((ann: any) => (
              <div key={ann.announcement_id} className="bg-white border border-slate-100 rounded-3xl p-4 flex gap-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{ann.title}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {formatDistanceToNow(new Date(ann.created_at), { addSuffix: true })}
                      </span>
                   </div>
                   <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ann.message}</p>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3 pb-4">
         <Link href="/admin/students" className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
               <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-blue-900">Add student</span>
         </Link>
         <Link href="/admin/teachers" className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
               <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-emerald-900">Add teacher</span>
         </Link>
         <Link href="/admin/timetable" className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
               <Settings className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-indigo-900">Timetable</span>
         </Link>
         <Link href="/admin/reports" className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-10 w-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
               <FileBarChart className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-amber-900">Reports</span>
         </Link>
      </div>
    </div>
  )
}
