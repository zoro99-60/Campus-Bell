'use client'

import React, { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { BellRing, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft, GraduationCap, Presentation, ShieldCheck, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signup, null)
  
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState(false)

  // Validate password match
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    if (formData.get('password') !== formData.get('confirm_password')) {
      e.preventDefault()
      setPasswordMatchError(true)
    } else {
      setPasswordMatchError(false)
    }
  }

  const roleConfig = {
    student: {
      title: 'Student Registration',
      subtitle: 'Join to access your timetable and attendance',
      icon: GraduationCap,
      accent: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25',
      textAccent: 'text-blue-600 dark:text-blue-400',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      ring: 'focus:ring-blue-500 dark:focus:ring-blue-400',
      borderFocus: 'focus:border-blue-500 dark:focus:border-blue-400'
    },
    teacher: {
      title: 'Teacher Registration',
      subtitle: 'Join to manage your lectures and students',
      icon: Presentation,
      accent: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      ring: 'focus:ring-emerald-500 dark:focus:ring-emerald-400',
      borderFocus: 'focus:border-emerald-500 dark:focus:border-emerald-400'
    },
    admin: {
      title: 'Admin Registration',
      subtitle: 'Restricted access for institution administrators',
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

      <div className="z-10 w-full max-w-lg relative">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50">
            <BellRing className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Campus Bell</span>
        </Link>
        
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
          
          {/* STEP 1: ROLE SELECTION */}
          {!role && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Select your role to get started</p>
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
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Register as Student</h3>
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
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Register as Teacher</h3>
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
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">Register as Admin</h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account? <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTRATION FORMS */}
          {role && activeConfig && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
              <button 
                onClick={() => { setRole(null); setPasswordMatchError(false); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 py-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4 stroke-[3]" /> Back
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${activeConfig.lightBg}`}>
                  <activeConfig.icon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{activeConfig.title}</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{activeConfig.subtitle}</p>
                </div>
              </div>

              {state?.error && (
                <div className="mb-6 flex gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 items-start">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{state.error}</p>
                </div>
              )}

              {passwordMatchError && (
                <div className="mb-6 flex gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 items-start">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Passwords do not match.</p>
                </div>
              )}

               {state?.message && (
                <div className="mb-6 flex gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 items-start">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p>{state.message}</p>
                </div>
              )}

              <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="role" value={role} />

                {/* --- Shared Fields --- */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" required placeholder="John Doe" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="email">College Email</label>
                  <input id="email" name="email" type="email" required placeholder={role === 'admin' ? "admin@college.ac.in" : "you@college.ac.in"} className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="password">Password</label>
                    <div className="relative">
                      <input id="password" name="password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="••••••••" className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="confirm_password">Confirm Password</label>
                    <div className="relative">
                      <input id="confirm_password" name="confirm_password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="••••••••" className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      <button 
                        type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- Role Specific Fields --- */}
                {role === 'student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="roll_number">Roll Number</label>
                        <input id="roll_number" name="roll_number" required placeholder="e.g. 21CS001" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="department">Department</label>
                        <input id="department" name="department" required placeholder="Computer Science" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm uppercase ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="year">Year (1-4)</label>
                        <input id="year" name="year" type="number" min="1" max="4" required defaultValue="1" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="semester">Sem (1-8)</label>
                        <input id="semester" name="semester" type="number" min="1" max="8" required defaultValue="1" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="division">Division</label>
                        <input id="division" name="division" type="text" maxLength={1} required defaultValue="A" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm uppercase ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                  </>
                )}

                {role === 'teacher' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="teacher_id">Teacher ID</label>
                        <input id="teacher_id" name="teacher_id" required placeholder="e.g. FAC-200" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="department">Department</label>
                        <input id="department" name="department" required placeholder="Computer Science" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm uppercase ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="designation">Designation</label>
                        <input id="designation" name="designation" required placeholder="e.g. Asst. Professor" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="phone_number">Phone Number (Optional)</label>
                        <input id="phone_number" name="phone_number" type="tel" placeholder="+91 9999999999" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <div className="p-3 mb-4 rounded-xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800/30 text-xs text-indigo-700 dark:text-indigo-400">
                      <strong>Note:</strong> Admin registration requires a valid invitation code. Unauthorized access attempts are logged.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="admin_id">Admin ID</label>
                        <input id="admin_id" name="admin_id" required placeholder="e.g. ADM-001" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="department_or_office">Office Section</label>
                        <input id="department_or_office" name="department_or_office" required placeholder="e.g. Exam Section" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm uppercase ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="designation">Designation</label>
                        <input id="designation" name="designation" required placeholder="e.g. Dean" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1.5" htmlFor="invite_code">Secret Code</label>
                        <input id="invite_code" name="invite_code" type="password" required placeholder="Enter code" className={`w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-indigo-200 dark:border-indigo-800 focus:outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-slate-900 text-sm ${activeConfig.ring} ${activeConfig.borderFocus}`} />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full flex items-center justify-center gap-2 text-white rounded-xl px-4 py-3.5 font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 ${activeConfig.accent}`}
                >
                  {isPending ? (
                     <span className="flex items-center gap-2">
                       <div className="h-4 w-4 rounded-full border-[3px] border-white/30 border-t-white animate-spin"></div>
                       Registering...
                    </span>
                  ) : (
                    <>Create Account <ArrowRight className="w-5 h-5" /></>
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
