'use client'

import { useState } from 'react'
import { Send, Users, GraduationCap, School, Layers } from 'lucide-react'
import { createAnnouncement } from '@/app/admin/actions'

export function AdminAnnouncementForm() {
  const [targetRole, setTargetRole] = useState('all')

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-8 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Send className="h-4 w-4 text-indigo-600" /> Create Targeted Announcement
      </h2>
      
      <form action={createAnnouncement} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1">Title</label>
            <input 
              name="title" 
              required 
              placeholder="e.g. Campus Closed on Friday" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 transition-all font-medium" 
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
              <Users className="h-3 w-3" /> Audience
            </label>
            <select 
              name="target_role" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 appearance-none font-medium cursor-pointer"
            >
              <option value="all">Everyone</option>
              <option value="student">Students Only</option>
              <option value="teacher">Teachers Only</option>
            </select>
          </div>

          {/* Conditional Filters for Students */}
          {targetRole === 'student' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                  <School className="h-3 w-3" /> Department
                </label>
                <select name="department" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 appearance-none font-medium cursor-pointer">
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Year / Semester
                </label>
                <select name="year" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 appearance-none font-medium cursor-pointer">
                  <option value="all">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map(y => <option key={y} value={y}>Semester {y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Division
                </label>
                <select name="division" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 appearance-none font-medium cursor-pointer">
                  <option value="all">All Divisions</option>
                  <option value="A">Division A</option>
                  <option value="B">Division B</option>
                  <option value="C">Division C</option>
                </select>
              </div>
            </>
          )}

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 ml-1">Message</label>
            <textarea 
              name="message" 
              rows={3} 
              required 
              placeholder="Enter the announcement content..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-indigo-500/20 resize-none font-medium transition-all" 
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-700 text-white rounded-2xl py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-700/20 hover:bg-indigo-800 transition-all hover:shadow-indigo-700/30 active:scale-[0.98]">
          <Send className="h-4 w-4" /> Broadcast Announcement
        </button>
      </form>
    </div>
  )
}
