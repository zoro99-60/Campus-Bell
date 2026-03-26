import { createClient } from '@/utils/supabase/server'
import { CalendarDays, Clock, MapPin, CheckCircle2, BellRing } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  // Fetch contextual schedule
  const { data: schedule } = await supabase
    .from('timetable')
    .select('*')
    .eq('department', profile?.department || '')
    .eq('year', profile?.year || 1)
    .eq('division', profile?.division || '')
    .eq('day', todayStr)
    .order('start_time')
    
  // Fetch real-time alerts
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {profile?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {profile?.department} Engineering • Year {profile?.year} • Division {profile?.division}
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Attendance</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">88<span className="text-xl text-slate-500">%</span></p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's Classes</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{schedule?.length || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Next Lecture In</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {schedule && schedule?.length > 0 ? schedule[0].start_time.substring(0, 5) : '--:--'}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Today's Schedule</h2>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">{todayStr}</span>
          </div>
          
          <div className="space-y-3">
            {!schedule || schedule.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed bg-white/50 dark:bg-slate-900/30">
                  <span className="text-slate-400 mb-2"><CalendarDays className="h-8 w-8" /></span>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No classes scheduled for today.</p>
               </div>
            ) : (
              schedule.map((lecture) => (
                <div key={lecture.timetable_id} className="group flex gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all">
                  <div className="flex flex-col items-center justify-center min-w-16 border-r border-slate-100 dark:border-slate-800 pr-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{lecture.start_time.substring(0,5)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lecture.subject}</h3>
                    <p className="text-sm text-slate-500 mt-1">Prof. {lecture.faculty}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 self-start px-2 py-1.5 rounded-lg">
                    <MapPin className="h-3.5 w-3.5" />
                    {lecture.classroom}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notifications / Pending */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Updates</h2>
             {notifications && notifications.length > 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm">
            {!notifications || notifications.length === 0 ? (
               <div className="p-8 text-center flex flex-col items-center">
                  <BellRing className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500">You're all caught up!</p>
               </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.map((note) => (
                  <div key={note.notification_id} className={`p-4 flex gap-4 items-start ${!note.read_status ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'opacity-70'}`}>
                    <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${!note.read_status ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{note.type === 'change_alert' ? 'Timetable Update' : 'Announcement'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{note.message}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mt-2">
                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
