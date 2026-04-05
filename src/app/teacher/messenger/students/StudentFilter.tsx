'use client'

import React, { useState } from 'react'
import { Search, ChevronLeft, MessageCircle, Filter, Users } from 'lucide-react'
import Link from 'next/link'

interface Student {
  user_id: string
  name: string
  profile_year: number
  profile_division: string
  department: string
  roll_number?: string
}

export function StudentFilter({ students }: { students: Student[] }) {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')
  const [divFilter, setDivFilter] = useState<'A' | 'B' | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = students.filter(s => {
    const matchesYear = yearFilter === 'all' || s.profile_year === yearFilter
    const matchesDiv = divFilter === 'all' || s.profile_division === divFilter
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.roll_number?.toLowerCase().includes(search.toLowerCase())
    return matchesYear && matchesDiv && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/teacher/messenger" className="h-10 w-10 flex items-center justify-center bg-white rounded-2xl border border-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
           <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500">Filter and start conversations</p>
        </div>
      </div>

      {/* FIXED FILTERS: Years 1-4 and Divisions A/B */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
           <Filter className="h-4 w-4 text-emerald-600" />
           <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Filters</span>
        </div>
        
        <div className="space-y-4">
           {/* Year Filter */}
           <div>
              <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">Select Year</p>
              <div className="flex flex-wrap gap-2">
                 {['all', 1, 2, 3, 4].map(y => (
                   <button 
                     key={y} 
                     onClick={() => setYearFilter(y as any)}
                     className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${yearFilter === y ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-emerald-50'}`}
                   >
                     {y === 'all' ? 'All Years' : `Year ${y}`}
                   </button>
                 ))}
              </div>
           </div>

           {/* Division Filter */}
           <div>
              <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">Select Division</p>
              <div className="flex gap-2">
                 {['all', 'A', 'B'].map(d => (
                   <button 
                     key={d} 
                     onClick={() => setDivFilter(d as any)}
                     className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${divFilter === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-emerald-50'}`}
                   >
                     {d === 'all' ? 'All Divs' : `Division ${d}`}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search by student name or roll number..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 ring-emerald-500/20 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 text-sm font-medium">No students match your filters</p>
          </div>
        ) : (
          filtered.map(s => (
            <div key={s.user_id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-colors">
               <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shrink-0">
                 {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{s.name}</h3>
                  <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-tight mt-0.5">
                    Year {s.profile_year} · Div {s.profile_division}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.roll_number || 'N/A'}</p>
               </div>
               <Link 
                 href={`/teacher/messenger/new?studentId=${s.user_id}`}
                 className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all active:scale-90 shadow-sm"
               >
                 <MessageCircle className="h-5 w-5" />
               </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
