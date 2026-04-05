import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, User, ChevronRight, Search, Inbox, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function TeacherMessengerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch conversations where this user is the teacher
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      conversation_id,
      updated_at,
      student:student_id (name, department, semester, division)
    `)
    .eq('teacher_id', user?.id)
    .order('updated_at', { ascending: false })

  // 2. Fetch last messages
  const lastMessages = await supabase
    .from('messages')
    .select('conversation_id, content, created_at, sender_id')
    .in('conversation_id', conversations?.map(c => c.conversation_id) || [])
    .order('created_at', { ascending: false })

  // 3. Unread counts
  const unreadMessages = await supabase
    .from('messages')
    .select('conversation_id')
    .eq('read_status', false)
    .neq('sender_id', user?.id)
    .in('conversation_id', conversations?.map(c => c.conversation_id) || [])

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Inquiries</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your student chats</p>
        </div>
        <Link 
          href="/teacher/messenger/students"
          className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search students..." 
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium"
        />
      </div>

      <div className="space-y-3">
        {(!conversations || conversations.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageSquare className="h-8 w-8" />
            </div>
            <p className="text-slate-400 font-medium">No active inquiries</p>
            <Link 
               href="/teacher/messenger/students"
               className="mt-4 text-sm font-bold text-emerald-600 flex items-center justify-center gap-1.5 mx-auto hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
            >
               <Plus className="h-4 w-4" /> Message a student
            </Link>
          </div>
        ) : (
          conversations.map(conv => {
            const last = lastMessages.data?.find(m => m.conversation_id === conv.conversation_id)
            const count = unreadMessages.data?.filter(m => m.conversation_id === conv.conversation_id).length || 0
            const student = Array.isArray(conv.student) ? conv.student[0] : conv.student

            return (
              <Link 
                key={conv.conversation_id}
                href={`/teacher/messenger/${conv.conversation_id}`}
                className="block bg-white rounded-3xl p-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all hover:border-emerald-100"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg relative">
                    {student?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{student?.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {conv.updated_at ? formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mb-1.5">{student?.department} · Sem {student?.semester} · Div {student?.division}</p>
                    <p className={`text-xs truncate ${count > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {last?.sender_id === user?.id ? 'You: ' : ''}{last?.content || 'Sent a message'}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
