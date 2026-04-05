import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, User, ChevronRight, Search, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function StudentMessengerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      conversation_id,
      updated_at,
      teacher:teacher_id (name, department)
    `)
    .eq('student_id', user?.id)
    .order('updated_at', { ascending: false })

  // 2. Fetch last messages for each
  const { data: lastMessages } = await supabase
    .from('messages')
    .select('conversation_id, content, created_at, sender_id')
    .in('conversation_id', conversations?.map(c => c.conversation_id) || [])
    .order('created_at', { ascending: false })

  // 3. Unread counts
  const { data: unreadCounts } = await supabase
    .from('messages')
    .select('conversation_id', { count: 'exact' })
    .eq('read_status', false)
    .neq('sender_id', user?.id)
    .in('conversation_id', conversations?.map(c => c.conversation_id) || [])

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-500 mt-0.5">Chat with your teachers</p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <MessageSquare className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search conversations..." 
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
        />
      </div>

      <div className="space-y-3">
        {(!conversations || conversations.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="h-16 w-16 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageSquare className="h-8 w-8" />
            </div>
            <p className="text-slate-400 font-medium">No messages yet</p>
            <Link 
               href="/student/messenger/teachers"
               className="mt-4 text-sm font-bold text-blue-600 flex items-center justify-center gap-1.5 mx-auto hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
            >
               <Plus className="h-4 w-4" /> Start a new chat
            </Link>
          </div>
        ) : (
          conversations.map(conv => {
            const last = lastMessages?.find(m => m.conversation_id === conv.conversation_id)
            const count = unreadCounts?.filter(m => m.conversation_id === conv.conversation_id).length || 0
            const teacher = Array.isArray(conv.teacher) ? conv.teacher[0] : conv.teacher

            return (
              <Link 
                key={conv.conversation_id}
                href={`/student/messenger/${conv.conversation_id}`}
                className="block bg-white rounded-3xl p-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all hover:border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg relative">
                    {teacher?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{teacher?.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {conv.updated_at ? formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mb-1.5">{teacher?.department} Faculty</p>
                    <p className={`text-xs truncate ${count > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {last?.sender_id === user?.id ? 'You: ' : ''}{last?.content || 'Started a conversation'}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </div>
              </Link>
            )
          })
        )}
      </div>

      <Link 
        href="/student/messenger/teachers"
        className="fixed bottom-24 right-6 h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 active:scale-90 transition-all z-10"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
