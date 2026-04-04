'use client'

import { useActionState, useTransition } from 'react'
import { submitLeaveRequest } from '@/app/teacher/actions'
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

const initialState = {
  success: false,
  error: null,
}

export default function TeacherLeavePage() {
  const [state, action, isPending] = useActionState(submitLeaveRequest, initialState)

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Leave Application</h1>
      <p className="text-sm text-slate-500 mb-6">Request leave and assign a substitute</p>

      {state?.success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">Leave request submitted for review.</p>
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-700">{state.error}</p>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">From Date</label>
              <input type="date" name="from_date" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">To Date</label>
              <input type="date" name="to_date" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-500/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Substitute Name (Optional)</label>
            <input name="substitute_name" placeholder="Prof. Sinha" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-500/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Reason for Leave</label>
            <textarea name="reason" rows={4} required placeholder="State your reason for leave" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-500/20 blur:ring-none resize-none" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-700 text-white rounded-2xl py-3.5 text-sm font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? 'Submitting Request...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
