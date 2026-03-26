import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { BellRing, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4 py-12">
      <div className="absolute inset-0 z-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      
      <div className="z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group transition-all hover:-translate-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50">
            <BellRing className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>
        
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Join Campus Bell with your college email</p>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="name">Full Name</label>
                <input id="name" name="name" required className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="role">Role</label>
                <select id="role" name="role" required className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white appearance-none">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="email">College Email</label>
              <input id="email" name="email" type="email" placeholder="you@college.ac.in" required className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="year">Year</label>
                <input id="year" name="year" type="number" min="1" max="4" required defaultValue="1" className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="division">Division</label>
                <input id="division" name="division" type="text" maxLength={1} required defaultValue="A" className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white uppercase" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="department">Dept</label>
                <input id="department" name="department" type="text" required placeholder="CS" className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white uppercase" />
              </div>
            </div>
            
            <button 
              formAction={signup} 
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold shadow-sm hover:bg-indigo-500 hover:shadow-indigo-500/25 transition-all mt-6"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account? <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
