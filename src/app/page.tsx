import Link from 'next/link'
import { BellRing, CalendarDays, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <BellRing className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">Campus Bell</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8 mt-16">
        
        {/* Background Gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-2xl text-center z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 dark:text-slate-400 ring-1 ring-slate-900/10 dark:ring-white/10 hover:ring-slate-900/20 dark:hover:ring-white/20 transition-all cursor-pointer">
              Announcing dynamic timetables. <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 drop-shadow-sm pb-2">
            Never miss a class again.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Campus Bell seamlessly manages your weekly timetables, tracks real-time schedule changes, and automates lecture reminders so you're always one step ahead.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register" className="group flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 active:scale-95">
              Start for free
              <CalendarDays className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white transition-all hover:translate-x-1">
              Admin Portal <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-32 lg:mt-40 z-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16 transition-all hover:-translate-y-1 duration-300">
              <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 backdrop-blur-md ring-1 ring-inset ring-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <BellRing className="h-6 w-6" aria-hidden="true" />
                </div>
                Real-time Alerts
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">Instant notifications whenever an admin updates the schedule, moves a venue, or cancels a lecture.</dd>
            </div>
            <div className="relative pl-16 transition-all hover:-translate-y-1 duration-300">
              <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 backdrop-blur-md ring-1 ring-inset ring-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <CalendarDays className="h-6 w-6" aria-hidden="true" />
                </div>
                Smart Timetables
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">Contextual daily and weekly grids highlight your current classes, helping you navigate your day with ease.</dd>
            </div>
            <div className="relative pl-16 transition-all hover:-translate-y-1 duration-300">
              <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600/10 dark:bg-orange-500/20 backdrop-blur-md ring-1 ring-inset ring-orange-500/20 text-orange-600 dark:text-orange-400 shadow-sm">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                Role-based Access
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">Dedicated dashboards for students and administrators, with secure authentication and attendance tracking.</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}
