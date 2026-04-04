'use client'

import React, { useTransition } from 'react'
import { CheckCircle2, XCircle, UserMinus, UserCheck, AlertCircle } from 'lucide-react'

interface ActionButtonProps {
  action: (formData: FormData) => Promise<any>
  userId?: string
  active?: boolean
  leaveId?: string
  type: 'toggle' | 'delete' | 'approve' | 'reject'
  confirmMessage?: string
  className?: string
  variant?: 'student' | 'teacher' | 'admin'
}

export function ActionButton({ 
  action, 
  userId, 
  active, 
  leaveId, 
  type, 
  confirmMessage, 
  className,
  variant = 'teacher'
}: ActionButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = async (e: React.FormEvent) => {
    if (confirmMessage && !confirm(confirmMessage)) {
      e.preventDefault()
      return
    }
  }

  const iconSize = "h-5 w-5"

  const renderIcon = () => {
    if (type === 'delete') return <UserMinus className={iconSize} />
    if (type === 'toggle') return active ? <XCircle className={iconSize} /> : (variant === 'student' ? <UserCheck className={iconSize} /> : <CheckCircle2 className={iconSize} />)
    if (type === 'approve') return <CheckCircle2 className={iconSize} />
    if (type === 'reject') return <XCircle className={iconSize} />
    return null
  }

  const getTitle = () => {
    if (type === 'delete') return "Delete Account"
    if (type === 'toggle') return active ? "Deactivate" : "Activate / Approve"
    if (type === 'approve') return "Approve Leave"
    if (type === 'reject') return "Reject Leave"
    return ""
  }

  const getStyles = () => {
    if (type === 'delete') return "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
    if (type === 'toggle') {
      if (active) return "bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
      return variant === 'student' 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500" 
        : "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500"
    }
    if (type === 'approve') return "w-full h-11 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 flex items-center justify-center gap-2"
    if (type === 'reject') return "w-full h-11 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 flex items-center justify-center gap-2"
    return ""
  }

  return (
    <form action={action} onSubmit={handleClick} className={type === 'approve' || type === 'reject' ? 'w-full' : ''}>
      {userId && <input type="hidden" name="user_id" value={userId} />}
      {active !== undefined && <input type="hidden" name="active" value={String(active)} />}
      {leaveId && <input type="hidden" name="leave_id" value={leaveId} />}
      
      <button 
        type="submit"
        disabled={isPending}
        className={`${getStyles()} ${className || (type === 'approve' || type === 'reject' ? '' : 'h-9 w-9 rounded-xl flex items-center justify-center transition-all')} disabled:opacity-50`}
        title={getTitle()}
      >
        {isPending ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
          <>
            {renderIcon()}
            {(type === 'approve' || type === 'reject') && <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}</span>}
          </>
        )}
      </button>
    </form>
  )
}
