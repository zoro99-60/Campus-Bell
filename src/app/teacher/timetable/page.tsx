'use client'

import React, { useState, useTransition } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Calendar, Edit, ChevronRight, Check, X, Building, Clock, MapPin, Plus, AlertCircle } from 'lucide-react'
import { updateLectureByTeacher, addExtraLectureByTeacher } from './actions'

export default function TeacherTimetablePage() {
  const [lectures, setLectures] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  React.useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from('v_timetable').select('*').eq('teacher_user_id', user.id).order('day').order('start_time')
      setLectures(data || [])
      setLoading(false)
    }
    loadData()
  }, [isPending])

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingId) return
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
         await updateLectureByTeacher(editingId, formData)
         setEditingId(null)
      } catch (err: any) {
         alert(err.message)
      }
    })
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
         await addExtraLectureByTeacher(formData)
         setShowAddForm(false)
         e.currentTarget.reset()
      } catch (err: any) {
         alert(err.message)
      }
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">My Timetable</h1>
          <p className="text-sm text-slate-500">Manage your assigned classes</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${showAddForm ? 'bg-slate-800 rotate-45' : 'bg-emerald-600 shadow-emerald-200'}`}
        >
           <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Add Extra Lecture Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl shadow-emerald-500/5 mb-6 animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <AlertCircle className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Add Extra Lecture</h2>
           </div>
           <form onSubmit={handleAdd} className="space-y-4">
              <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Subject Name</label>
                 <input name="subject" required placeholder="e.g. Advanced Maths" className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/10 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Classroom</label>
                    <input name="classroom" required placeholder="Room 302" className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/10 transition-all" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Day</label>
                    <select name="day" required className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/10 transition-all bg-white">
                       {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Start Time</label>
                    <input name="start_time" type="time" required className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/10 transition-all" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">End Time</label>
                    <input name="end_time" type="time" required className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/10 transition-all" />
                 </div>
              </div>
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-emerald-600 text-white rounded-2xl py-3.5 text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isPending ? 'Scheduling...' : 'Schedule Extra Class'}
              </button>
           </form>
        </div>
      )}

      <div className="space-y-4 relative">
         {lectures.length === 0 ? (
           <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
             No classes assigned to you yet.
           </div>
         ) : (
           <div className="grid gap-4">
             {lectures.map(lecture => (
               <div key={lecture.timetable_id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                  
                  {editingId === lecture.timetable_id ? (
                     <form onSubmit={handleEdit} className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                           <h3 className="text-sm font-bold text-slate-900">Edit {lecture.subject}</h3>
                           <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                           <div className="col-span-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Classroom</label>
                             <input name="classroom" defaultValue={lecture.classroom} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 ring-emerald-500" />
                           </div>
                           <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Start Time</label>
                             <input name="start_time" type="time" defaultValue={lecture.start_time} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 ring-emerald-500" />
                           </div>
                           <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">End Time</label>
                             <input name="end_time" type="time" defaultValue={lecture.end_time} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 ring-emerald-500" />
                           </div>
                        </div>
                        <button type="submit" disabled={isPending} className="w-full py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-all">
                           {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                     </form>
                  ) : (
                    <div className="flex justify-between items-start">
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest border border-emerald-100">{lecture.day}</span>
                             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tight"><Clock className="h-3 w-3" /> {lecture.start_time.substring(0,5)} - {lecture.end_time.substring(0,5)}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 truncate pr-4">{lecture.subject}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                             <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-slate-400" /> Sem {lecture.year} · {lecture.department}</p>
                             <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> Room {lecture.classroom}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => setEditingId(lecture.timetable_id)} 
                         className="h-10 w-10 shrink-0 rounded-2xl border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all active:scale-95 shadow-sm"
                       >
                          <Edit className="h-4 w-4" />
                       </button>
                    </div>
                  )}
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  )
}

