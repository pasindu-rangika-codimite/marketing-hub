import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, ChevronDown, Filter, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import {
  ADMIN_WEEK_LABEL,
  ADMIN_WEEK_RANGE,
  AdminShell,
} from '@/features/admin/components/admin-shell'
import { ADMIN_PROJECTS } from '@/features/admin/data/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AdminWeekUpdatesPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ADMIN_PROJECTS
    return ADMIN_PROJECTS.filter((p) => p.name.toLowerCase().includes(q))
  }, [search])

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Week Updates
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Select a project to view weekly updates by team members.
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

        <div className='flex shrink-0 items-center gap-2'>
          <button
            type='button'
            className={cn(
              'flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium',
              'text-[#334155] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]',
              'dark:hover:bg-slate-800'
            )}
          >
            <CalendarDays className='size-4 text-[#7C3AED]' />
            <span className='hidden truncate sm:inline'>
              {ADMIN_WEEK_LABEL} • {ADMIN_WEEK_RANGE}
            </span>
            <span className='truncate sm:hidden'>{ADMIN_WEEK_LABEL}</span>
            <ChevronDown className='size-4 text-slate-400' />
          </button>

          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-11 shrink-0 rounded-xl'
            aria-label='Filter projects'
          >
            <Filter className='size-4' />
          </Button>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((project) => (
          <article
            key={project.id}
            className={cn(
              'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
              'transition-shadow hover:shadow-md',
              'dark:border-slate-700 dark:bg-[#1E293B]'
            )}
          >
            <div className='flex flex-col items-center text-center'>
              <PlaceholderImage
                label='Logo'
                rounded='lg'
                className='size-14 sm:size-16'
              />
              <h2 className='mt-4 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                {project.name}
              </h2>
              <p className='mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                {project.updates} updates this week
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
        ))}
      </div>

      {filtered.length === 0 && (
        <p className='py-16 text-center text-sm text-[#64748B] dark:text-[#94A3B8]'>
          No projects match your search.
        </p>
      )}
    </AdminShell>
  )
}
