import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ListTodo } from 'lucide-react'

export default async function TodosPage() {
  const supabase = await createClient()

  // Note: This matches the table name in the guide. 
  // If the 'todos' table doesn't exist yet, it will return an empty array or error.
  const { data: todos, error } = await supabase.from('todos').select()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4 py-12">
      <div className="z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <ListTodo className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Supabase Connection</h1>
          </div>

          <div className="space-y-4">
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
                <p className="font-semibold">Connection Error:</p>
                <p className="mt-1 opacity-80">{error.message}</p>
                {error.message.includes('relation "todos" does not exist') && (
                   <p className="mt-2 text-xs italic">Note: The "todos" table hasn't been created in your database yet, but the connection attempt was made using your new keys.</p>
                )}
              </div>
            ) : !todos || todos.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Connected Successfully!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">No items found in the 'todos' table.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{todo.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
