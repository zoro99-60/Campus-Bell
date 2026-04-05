'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { submitAttendance } from '@/app/teacher/actions'

type Student = {
  user_id: string
  name: string
  roll_number: string | null
  pct: number
  existingStatus: 'present' | 'absent' | null
}

export function AttendanceMarker({
  students,
  timetableId,
  entryId,
  date,
  isLocked,
}: {
  students: Student[]
  timetableId: string
  entryId: string
  date: string
  isLocked: boolean
}) {
  const initial: Record<string, 'present' | 'absent'> = {}
  students.forEach(s => {
    initial[s.user_id] = s.existingStatus || 'present'
  })

  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent'>>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(isLocked)
  const [error, setError] = useState<string | null>(null)

  const toggle = (userId: string) => {
    if (submitted) return
    setStatuses(prev => ({ ...prev, [userId]: prev[userId] === 'present' ? 'absent' : 'present' }))
  }

  const bulkPresent = () => {
    if (submitted) return
    const all: Record<string, 'present' | 'absent'> = {}
    students.forEach(s => { all[s.user_id] = 'present' })
    setStatuses(all)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const fd = new FormData()
    fd.append('timetable_id', timetableId)
    fd.append('entry_id', entryId)
    fd.append('date', date)
    fd.append('entries', JSON.stringify(students.map(s => ({ user_id: s.user_id, status: statuses[s.user_id] }))))
    const result = await submitAttendance(fd)
    if (result?.error) setError(result.error)
    else setSubmitted(true)
    setSubmitting(false)
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length

  return (
    <div>
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">Attendance submitted and locked ✓</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-sm text-red-700">{error}</div>
      )}

      {/* Bulk action */}
      {!submitted && (
        <div className="flex justify-end mb-3">
          <button
            onClick={bulkPresent}
            className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-all"
          >
            Mark all present
          </button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {students.map(s => {
          const status = statuses[s.user_id]
          const isPresent = status === 'present'
          const isLow = s.pct < 75
          return (
            <div
              key={s.user_id}
              className={`flex items-center gap-3 rounded-2xl p-3.5 border transition-all ${
                isPresent ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
              }`}
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{s.name} {isLow && '⚠️'}</p>
                <p className="text-xs text-slate-400">Roll {s.roll_number || 'N/A'} · {s.pct}% overall</p>
              </div>
              {!submitted ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setStatuses(prev => ({ ...prev, [s.user_id]: 'present' })) }}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                      isPresent ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { setStatuses(prev => ({ ...prev, [s.user_id]: 'absent' })) }}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                      !isPresent ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-red-400'
                    }`}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isPresent ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {isPresent ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-sm text-slate-500 mb-4">{presentCount} of {students.length} marked present</div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-emerald-700 text-white rounded-2xl py-3.5 text-sm font-semibold disabled:opacity-50 hover:bg-emerald-800 transition-all"
        >
          {submitting ? 'Submitting...' : 'Submit attendance →'}
        </button>
      )}
    </div>
  )
}
