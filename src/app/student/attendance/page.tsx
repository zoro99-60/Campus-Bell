import { CheckCircle2, TrendingUp } from 'lucide-react'

export default function StudentAttendance() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Attendance Logs 📊
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track your presence across all enrolled subjects.
        </p>
      </header>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-6 flex flex-col justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10%] top-[-10%] text-emerald-600 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle2 className="w-32 h-32" />
          </div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 relative z-10">Overall Percentage</p>
          <div className="flex items-baseline gap-2 relative z-10 mt-2">
            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">88.4%</p>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2%
            </span>
          </div>
        </div>
      </div>
      
      {/* Subject list */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <h3 className="font-semibold text-slate-900 dark:text-white">Subject Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Database Management Systems</p>
              <p className="text-sm text-slate-500 mt-1">42 / 45 Lectures Attended</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                93.3%
              </span>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Operating Systems</p>
              <p className="text-sm text-slate-500 mt-1">35 / 40 Lectures Attended</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                87.5%
              </span>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between opacity-80 decoration-slate-400">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Computer Networks</p>
              <p className="text-sm text-slate-500 mt-1">28 / 40 Lectures Attended</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20">
                70.0%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
