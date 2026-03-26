import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { BellRing, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4">
      <div className="absolute inset-0 z-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      
      <div className="z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group transition-all hover:-translate-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50">
            <BellRing className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>
        
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Sign in to your Campus Bell account</p>
          </div>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="email">College Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@college.ac.in"
                required 
                className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all dark:text-white"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200" htmlFor="password">Password</label>
                <Link href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                required 
                className="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all dark:text-white"
              />
            </div>
            
            <button 
              formAction={login} 
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-3.5 font-semibold shadow-sm hover:bg-indigo-500 hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
