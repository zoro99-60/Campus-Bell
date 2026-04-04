import { createClient } from '@/utils/supabase/server'
import { User, BookOpen, Hash, Building2, GraduationCap } from 'lucide-react'
import { logout } from '@/app/auth/actions'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default async function StudentProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users').select('*').eq('user_id', user?.id).single()

  const { data: attendance } = await supabase
    .from('attendance').select('*').eq('user_id', user?.id)

  const total = attendance?.length || 0
  const present = attendance?.filter(a => a.status === 'present').length || 0
  const overallPct = total > 0 ? Math.round((present / total) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold mb-3">
          {getInitials(profile?.name || 'S')}
        </div>
        <h1 className="text-xl font-bold text-slate-900">{profile?.name}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{profile?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className={`text-xl font-bold ${overallPct < 75 ? 'text-red-600' : 'text-green-700'}`}>{overallPct}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Attendance</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-purple-700">{present}</p>
          <p className="text-xs text-slate-500 mt-0.5">Present</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-red-600">{total - present}</p>
          <p className="text-xs text-slate-500 mt-0.5">Absent</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 mb-5">
        {[
          { icon: Hash, label: 'Roll Number', value: profile?.roll_number || 'Not assigned' },
          { icon: Building2, label: 'Department', value: profile?.department || '—' },
          { icon: GraduationCap, label: 'Year & Division', value: `Year ${profile?.year} · Division ${profile?.division}` },
          { icon: BookOpen, label: 'Semester', value: `Semester ${profile?.semester || 1}` },
          { icon: User, label: 'Role', value: 'Student' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3.5">
            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{item.label}</p>
              <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <form action={logout}>
        <button type="submit" className="w-full rounded-2xl bg-red-50 border border-red-100 text-red-600 font-semibold text-sm py-3.5 hover:bg-red-100 transition-all">
          Sign Out
        </button>
      </form>
    </div>
  )
}
