import { Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ADMIN_WEEK_LABEL,
  ADMIN_WEEK_RANGE,
  AdminShell,
} from '@/features/admin/components/admin-shell'

type WeekUpdatesDetailPageProps = {
  projectName: string
}

export function WeekUpdatesDetailPage({
  projectName,
}: WeekUpdatesDetailPageProps) {
  return (
    <AdminShell>
      <div className='mb-6 sm:mb-8'>
        <Link
          to='/admin/week-updates'
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:underline dark:text-violet-300'
        >
          <ArrowLeft className='size-4' />
          All projects
        </Link>
        <div className='mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
              {projectName}
            </h1>
            <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
              Weekly updates from the team for this project.
            </p>
          </div>
          <div
            className={cn(
              'flex h-11 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium',
              'text-[#334155] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]'
            )}
          >
            <CalendarDays className='size-4 text-[#7C3AED]' />
            <span className='truncate'>
              {ADMIN_WEEK_LABEL} • {ADMIN_WEEK_RANGE}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center',
          'dark:border-slate-700 dark:bg-[#1E293B]'
        )}
      >
        <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20'>
          <Inbox className='size-7 text-[#7C3AED] dark:text-violet-300' />
        </div>
        <p className='text-sm font-medium text-[#334155] dark:text-[#E2E8F0]'>
          No updates yet for this project.
        </p>
        <p className='mt-1 max-w-sm text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Once team members start adding updates, they will appear here grouped
          by day.
        </p>
      </div>
    </AdminShell>
  )
}
