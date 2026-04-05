/**
 * Calculates current lecture state based on standard timetable entry times.
 * Handles the 'Neon Purple' branding for Live sessions.
 */
export function getLectureStatus(startTime: string, endTime: string) {
  const now = new Date()
  
  // Parse standard HH:mm format
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  
  const start = new Date(); start.setHours(sh, sm, 0, 0)
  const end = new Date(); end.setHours(eh, em, 0, 0)
  
  const diffMin = (start.getTime() - now.getTime()) / 60000

  if (now >= start && now < end) {
    return {
      status: 'live' as const,
      label: 'LIVE',
      style: 'neon-purple', // Visual flag for frontend
      progress: Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)
    }
  }

  if (diffMin > 0 && diffMin <= 30) {
    return {
      status: 'soon' as const,
      label: 'Starting soon',
      countdown: `${Math.round(diffMin)}m`,
      style: 'amber'
    }
  }

  if (diffMin > 30) {
    return {
      status: 'later' as const,
      label: 'Upcoming',
      countdown: `${Math.round(diffMin / 60)}h`,
      style: 'slate'
    }
  }

  return {
    status: 'done' as const,
    label: 'Completed',
    style: 'gray'
  }
}

/**
 * Utility to find the next class session for today.
 */
export function getNextClass(schedule: any[]) {
  const now = new Date()
  return schedule.find(l => {
    const [h, m] = l.start_time.split(':').map(Number)
    const start = new Date(); start.setHours(h, m, 0, 0)
    return start > now
  })
}
