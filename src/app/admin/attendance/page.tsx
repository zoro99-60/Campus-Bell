import { Users, FileSpreadsheet } from 'lucide-react'

export default function AdminAttendance() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attendance Records 📝
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Review detailed reports of student presence across all departments.
          </p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl h-64">
        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No records found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">Select a specific lecture from the timetable to view its attendance sheet.</p>
      </div>
    </div>
  )
}
