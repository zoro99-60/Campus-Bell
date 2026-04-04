'use client'

import React, { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { BellRing, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft, Eye, EyeOff, GraduationCap, Presentation, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [message, setMessage] = useState<string | null>(null)
  
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const msg = params.get('message')
    if (msg) setMessage(msg)
  }, [])
  
  // Theme and text mappings based on role
  const roleConfig = {
    student: {
      title: 'Student Login',
      subtitle: 'Access your timetable, attendance, and alerts',
      idField: 'Email or Roll Number',
      icon: GraduationCap,
      accent: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25',
      textAccent: 'text-blue-600 dark:text-blue-400',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      ring: 'focus:ring-blue-500 dark:focus:ring-blue-400',
      borderFocus: 'focus:border-blue-500 dark:focus:border-blue-400'
    },
    teacher: {
      title: 'Teacher Login',
      subtitle: 'Manage lectures, attendance, and student records',
      idField: 'Email or Teacher ID',
      icon: Presentation,
      accent: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      ring: 'focus:ring-emerald-500 dark:focus:ring-emerald-400',
      borderFocus: 'focus:border-emerald-500 dark:focus:border-emerald-400'
    },
    admin: {
      title: 'Admin Login',
      subtitle: 'Manage institution operations and approvals',
      idField: 'Email or Admin ID',
      icon: ShieldCheck,
      accent: 'bg-indigo-700 hover:bg-indigo-600 shadow-indigo-600/25',
      textAccent: 'text-indigo-700 dark:text-indigo-400',
      lightBg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400',
      ring: 'focus:ring-indigo-500 dark:focus:ring-indigo-400',
      borderFocus: 'focus:border-indigo-500 dark:focus:border-indigo-400'
    }
  }

  const activeConfig = role ? roleConfig[role] : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4 py-12">
      <div className="absolute inset-0 z-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      
      <div className="z-10 w-full max-w-md relative">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50">
            <BellRing className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>

        {message && !role && (
           <div className="mb-6 flex gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}
        
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* STEP 1: ROLE SELECTION */}
          {!role && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Select your role to continue</p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setRole('student')}
                  className="w-full group flex items-center p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left shadow-sm hover:shadow"
                >
                  <div className="h-11 w-11 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Continue as Student</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Access your timetable & attendance</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </button>

                <button 
                  onClick={() => setRole('teacher')}
                  className="w-full group flex items-center p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left shadow-sm hover:shadow"
                >
                  <div className="h-11 w-11 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Presentation className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Continue as Teacher</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage lectures & attendance</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                </button>

                <button 
                  onClick={() => setRole('admin')}
                  className="w-full group flex items-center p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left shadow-sm hover:shadow"
                >
                  <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Continue as Admin</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage institution operations</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </button>
              </div>

               <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account? <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Register here</Link>
              </div>
            </div>
          )}

          {/* STEP 2: LOGIN FORM */}
          {role && activeConfig && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
              <button 
                onClick={() => { setRole(null); setShowPassword(false); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 py-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4 stroke-[3]" /> Back
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${activeConfig.lightBg}`}>
                  <activeConfig.icon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{activeConfig.title}</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{activeConfig.subtitle}</p>
                </div>
              </div>

              {state?.error && (
                <div className="mb-6 flex gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 items-start">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{state.error}</p>
                </div>
              )}

               {message && (
                <div className="mb-6 flex gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 items-start">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p>{message}</p>
                </div>
              )}
              
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="requested_role" value={role} />
                
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1.5" htmlFor="email">{activeConfig.idField}</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="text" 
                    placeholder="Enter your email or ID"
                    required 
                    className={`w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 ${activeConfig.ring} ${activeConfig.borderFocus}`}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="password">Password</label>
                    <Link href="#" className={`text-xs font-semibold hover:underline ${activeConfig.textAccent}`}>Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      required 
                      className={`w-full pl-4 pr-12 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 ${activeConfig.ring} ${activeConfig.borderFocus}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isPending}
                  className={`w-full flex items-center justify-center gap-2 text-white rounded-xl px-4 py-3.5 font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 mt-2 ${activeConfig.accent}`}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                       <div className="h-4 w-4 rounded-full border-[3px] border-white/30 border-t-white animate-spin"></div>
                       Authenticating...
                    </span>
                  ) : (
                    <>Sign In <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
