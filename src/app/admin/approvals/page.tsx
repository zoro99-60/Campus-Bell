import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { approveLeave, rejectLeave } from '@/app/admin/actions'

export default async function AdminApprovalsPage() {
  const supabase = await createClient()

  const { data: leaves } = await supabase
    .from('leave_requests')
    .select(`
      leave_id,
      from_date,
      to_date,
      reason,
      status,
      substitute_name,
      teacher:teacher_id (name, department)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Approvals</h1>
      <p className="text-sm text-slate-500 mb-6">Review teacher leave requests & substitutions</p>

      <div className="space-y-4">
        {(!leaves || leaves.length === 0) ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>All caught up!</p>
          </div>
        ) : (
          leaves.map(leave => (
            <div key={leave.leave_id} className={`bg-white rounded-3xl border ${leave.status === 'pending' ? 'border-amber-200 shadow-lg shadow-amber-500/5' : 'border-slate-100'} p-5 relative overflow-hidden group transition-all`}>
               {leave.status === 'pending' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />}
               
               <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold shrink-0">
                        {Array.isArray(leave.teacher) ? (leave.teacher[0] as any)?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : (leave.teacher as any)?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">{Array.isArray(leave.teacher) ? (leave.teacher[0] as any)?.name : (leave.teacher as any)?.name}</p>
                        <p className="text-xs text-slate-500">{Array.isArray(leave.teacher) ? (leave.teacher[0] as any)?.department : (leave.teacher as any)?.department} Department</p>
                     </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight
                    ${leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {leave.status}
                  </div>
               </div>

               <div className="bg-slate-50 rounded-2xl p-3 mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{leave.from_date} to {leave.to_date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{leave.reason}"</p>
                  {leave.substitute_name && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg w-fit">
                       Substitute: {leave.substitute_name}
                    </div>
                  )}
               </div>

               {leave.status === 'pending' && (
                 <div className="grid grid-cols-2 gap-3 pt-1">
                    <form action={async () => { 'use server'; await approveLeave(leave.leave_id) }}>
                       <button className="w-full h-11 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Approve
                       </button>
                    </form>
                    <form action={async () => { 'use server'; await rejectLeave(leave.leave_id) }}>
                       <button className="w-full h-11 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                          <XCircle className="h-4 w-4" /> Reject
                       </button>
                    </form>
                 </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
