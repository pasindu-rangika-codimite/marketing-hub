import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { startOfWeek } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { ArrowRight, CalendarDays, Loader2, Search } from 'lucide-react'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import {
  useAllAssets,
  useAllUpdates,
  useProjects,
} from '@/hooks/use-live-data'
import {
  ADMIN_WEEK_LABEL,
  ADMIN_WEEK_RANGE,
  AdminShell,
} from '@/features/admin/components/admin-shell'
import { Input } from '@/components/ui/input'

function isThisWeek(createdAt: unknown): boolean {
  if (!(createdAt instanceof Timestamp)) return false
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  return createdAt.toDate() >= weekStart
}

export function AdminWeekUpdatesPage() {
  const { projects, isLoading } = useProjects()
  const { assets } = useAllAssets()
  const { updates } = useAllUpdates()
  const [search, setSearch] = useState('')

  const countsByProject = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of [...assets, ...updates]) {
      if (!item.projectId || !isThisWeek(item.createdAt)) continue
      counts.set(item.projectId, (counts.get(item.projectId) ?? 0) + 1)
    }
    return counts
  }, [assets, updates])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => p.name.toLowerCase().includes(q))
  }, [projects, search])

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Week Updates
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Select a project to view updates by team members.
        </p>
      </div>

      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative min-w-0 flex-1'>
          <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search projects...'
            className='h-11 rounded-xl ps-9'
          />
        </div>

        <div
          className={cn(
            'flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium',
            'text-[#334155] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]'
          )}
        >
          <CalendarDays className='size-4 text-[#7C3AED]' />
          <span className='hidden truncate sm:inline'>
            {ADMIN_WEEK_LABEL} • {ADMIN_WEEK_RANGE}
          </span>
          <span className='truncate sm:hidden'>{ADMIN_WEEK_LABEL}</span>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-6 animate-spin text-slate-400' />
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {filtered.map((project) => {
            const count = countsByProject.get(project.id) ?? 0
            return (
              <article
                key={project.id}
                className={cn(
                  'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
                  'transition-shadow hover:shadow-md',
                  'dark:border-slate-700 dark:bg-[#1E293B]'
                )}
              >
                <div className='flex flex-col items-center text-center'>
                  <span
                    className={cn(
                      'flex size-14 items-center justify-center rounded-2xl text-base font-bold text-white sm:size-16',
                      project.color || 'bg-violet-500'
                    )}
                  >
                    {getDisplayNameInitials(project.name)}
                  </span>
                  <h2 className='mt-4 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                    {project.name}
                  </h2>
                  <p className='mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                    {count} update{count === 1 ? '' : 's'} this week
                  </p>
                </div>

                <Link
                  to='/admin/week-updates/$projectId'
                  params={{ projectId: project.id }}
                  className={cn(
                    'mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#7C3AED]',
                    'hover:underline dark:text-violet-300'
                  )}
                >
                  View updates
                  <ArrowRight className='size-4' />
                </Link>
              </article>
            )
          })}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className='py-16 text-center text-sm text-[#64748B] dark:text-[#94A3B8]'>
          {projects.length === 0
            ? 'No projects yet — add projects from the Projects page first.'
            : 'No projects match your search.'}
        </p>
      )}
    </AdminShell>
  )
}
