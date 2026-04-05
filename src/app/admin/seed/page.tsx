'use client'

import React, { useState } from 'react'
import { seedUsersAction } from './actions'
import { Database, UserPlus, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react'
import Link from 'next/link'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    if (!confirm('This will seed 5 teachers and 80 students into the database. Continue?')) return
    
    setLoading(true)
    try {
      const res = await seedUsersAction()
      setResult(res)
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Seed failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-8 border border-slate-100">
        <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
           <Database className="h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">System Seeding</h1>
        <p className="text-center text-slate-500 text-sm mb-8">
           Populate the database with 5 Teacher accounts and 80 Student accounts for testing.
        </p>

        <div className="space-y-4 mb-8">
           <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <UserPlus className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                 <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Teacher Accounts</p>
                 <p className="text-xs text-slate-500 mt-0.5">Priya Gupta, Tina Sawant, Faina Khan, etc.</p>
              </div>
           </div>
           <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Users className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                 <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Student Accounts</p>
                 <p className="text-xs text-slate-500 mt-0.5">80 students across 4 Years & 2 Divisions.</p>
              </div>
           </div>
        </div>

        {result && (
           <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${result.success ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
              {result.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <p className="text-xs font-bold leading-tight">{result.message}</p>
           </div>
        )}

        <div className="flex flex-col gap-3">
           <button 
             onClick={handleSeed}
             disabled={loading}
             className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5" />}
             {loading ? 'Seeding Data...' : 'Seed All Users'}
           </button>
           
           <Link 
             href="/admin"
             className="w-full h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm flex items-center justify-center hover:bg-slate-200 transition-colors"
           >
             Back to Dashboard
           </Link>
        </div>
      </div>
    </div>
  )
}
