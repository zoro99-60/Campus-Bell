import { createClient } from '@/utils/supabase/server'
import { CalendarDays, PlusCircle, Trash2, Clock, MapPin } from 'lucide-react'
import { addLecture, deleteLecture } from './actions'

export default async function TimetableManagement() {
  const supabase = await createClient()
  // Fetch existing timetable records
  const { data: lectures } = await supabase.from('timetable').select('*').order('day').order('start_time')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Timetables 📅
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Add new lectures, edit timings, or restructure the weekly grids. Affected students are notified automatically.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 p-6 shadow-sm sticky top-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-500" /> New Lecture
          </h2>
          <form action={addLecture} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Subject</label>
              <input name="subject" required placeholder="e.g. Data Structures" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Faculty</label>
              <input name="faculty" required placeholder="Dr. Smith" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Day</label>
                <select name="day" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none">
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Room</label>
                <input name="classroom" required placeholder="Lab 3" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Start</label>
                <input type="time" name="start_time" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">End</label>
                <input type="time" name="end_time" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Dept</label>
                <input name="department" required placeholder="CS" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm uppercase" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Yr</label>
                <input type="number" name="year" required min={1} max={4} defaultValue={1} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5">Div</label>
                <input name="division" required placeholder="A" maxLength={1} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm uppercase" />
              </div>
            </div>

            <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-95">
              Add to Schedule
            </button>
          </form>
        </div>

        {/* Existing Lectures Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!lectures || lectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl h-64">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No classes scheduled yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">Use the panel on the left to start drafting new schedules.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lectures.map((lecture) => (
                <div key={lecture.timetable_id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all">
                  <div className="flex flex-col items-center justify-center min-w-20 sm:border-r border-slate-100 dark:border-slate-800 sm:pr-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md mb-1">{lecture.day.substring(0,3)}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{lecture.start_time.substring(0,5)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lecture.subject}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{lecture.faculty} • {lecture.department}-{lecture.year} ({lecture.division})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {lecture.classroom}
                    </div>
                    <form action={deleteLecture}>
                      <input type="hidden" name="timetable_id" value={lecture.timetable_id} />
                      <button type="submit" title="Cancel Lecture" className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-105 transition-all outline-none focus:ring-2 ring-red-500/50">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
