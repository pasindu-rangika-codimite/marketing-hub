import {
  AlertCircle,
  CheckCircle2,
  FileText,
  FolderKanban,
  Link2,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminShell } from '@/features/admin/components/admin-shell'

const STATS = [
  {
    label: 'Total Updates',
    value: '24',
    icon: FileText,
    iconClass:
      'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  },
  {
    label: 'Members Updated',
    value: '6 / 7',
    icon: Users,
    iconClass:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  {
    label: 'Projects Tagged',
    value: '8',
    icon: FolderKanban,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  },
  {
    label: 'Files & Links',
    value: '31',
    icon: Link2,
    iconClass:
      'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
  },
] as const

const TEAM_ROWS = [
  { initials: 'SN', name: 'Subodha N.', color: 'bg-sky-500', updates: 5, status: 'completed' as const },
  { initials: 'D1', name: 'Designer 1', color: 'bg-violet-500', updates: 4, status: 'completed' as const },
  { initials: 'D2', name: 'Designer 2', color: 'bg-emerald-500', updates: 3, status: 'completed' as const },
  { initials: 'D3', name: 'Designer 3', color: 'bg-orange-500', updates: 0, status: 'missing' as const },
  { initials: 'D4', name: 'Designer 4', color: 'bg-rose-500', updates: 6, status: 'completed' as const },
  { initials: 'D5', name: 'Designer 5', color: 'bg-indigo-500', updates: 4, status: 'completed' as const },
  { initials: 'D6', name: 'Designer 6', color: 'bg-teal-500', updates: 2, status: 'completed' as const },
]

const PROJECTS = [
  { name: 'Caprome', updates: 8, members: 3, color: 'bg-violet-500', icon: FolderKanban },
  { name: 'CommandLyne', updates: 5, members: 2, color: 'bg-sky-500', icon: FileText },
  { name: 'Codimite Website', updates: 4, members: 2, color: 'bg-emerald-500', icon: Link2 },
  { name: 'Internal Branding', updates: 3, members: 1, color: 'bg-orange-500', icon: FolderKanban },
  { name: 'ZipZap', updates: 2, members: 1, color: 'bg-rose-500', icon: FolderKanban },
]

const ACTIVITY = [
  { initials: 'SN', name: 'Subodha N.', color: 'bg-sky-500', action: 'uploaded 2 files', time: '10:24 AM' },
  { initials: 'D4', name: 'Designer 4', color: 'bg-rose-500', action: 'added 1 Figma link', time: '10:38 AM' },
  { initials: 'D1', name: 'Designer 1', color: 'bg-violet-500', action: 'uploaded 3 files', time: '11:05 AM' },
  { initials: 'D2', name: 'Designer 2', color: 'bg-emerald-500', action: 'tagged Caprome project', time: 'Yesterday' },
]

export function AdminDashboard() {
  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Good morning, Manager! 👋
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Here&apos;s this week&apos;s overview of your team&apos;s updates.
        </p>
      </div>

      <div className='mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:mb-8 sm:gap-4'>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
              'dark:border-slate-700 dark:bg-[#1E293B]'
            )}
          >
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                stat.iconClass
              )}
            >
              <stat.icon className='size-5' />
            </div>
            <div>
              <p className='text-xs font-medium text-[#64748B] dark:text-[#94A3B8]'>
                {stat.label}
              </p>
              <p className='text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='mb-6 grid gap-4 xl:grid-cols-2 xl:gap-5'>
        {/* Team submission */}
        <section
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6',
            'dark:border-slate-700 dark:bg-[#1E293B]'
          )}
        >
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            Team Submission Status
          </h2>

          <div className='mt-4 overflow-x-auto'>
            <table className='w-full min-w-[320px] text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-left text-xs font-medium text-[#64748B] dark:border-slate-700 dark:text-[#94A3B8]'>
                  <th className='pb-3 font-medium'>Member</th>
                  <th className='pb-3 font-medium'>Updates</th>
                  <th className='pb-3 text-end font-medium'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-50 dark:divide-slate-800'>
                {TEAM_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td className='py-3'>
                      <div className='flex items-center gap-2.5'>
                        <span
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                            row.color
                          )}
                        >
                          {row.initials}
                        </span>
                        <span className='font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 text-[#64748B] dark:text-[#94A3B8]'>
                      {row.updates} update{row.updates === 1 ? '' : 's'}
                    </td>
                    <td className='py-3 text-end'>
                      {row.status === 'completed' ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'>
                          <CheckCircle2 className='size-3.5' />
                          Completed
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-300'>
                          <AlertCircle className='size-3.5' />
                          Missing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Project wise */}
        <section
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6',
            'dark:border-slate-700 dark:bg-[#1E293B]'
          )}
        >
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
              Project Wise Updates
            </h2>
            <button
              type='button'
              className='text-xs font-semibold text-[#7C3AED] hover:underline dark:text-violet-300'
            >
              View all projects
            </button>
          </div>

          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {PROJECTS.map((project) => (
              <div
                key={project.name}
                className={cn(
                  'rounded-xl border border-slate-100 bg-slate-50/80 p-4',
                  'dark:border-slate-700 dark:bg-slate-800/50'
                )}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg text-white',
                      project.color
                    )}
                  >
                    <project.icon className='size-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                      {project.name}
                    </p>
                    <p className='mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                      {project.updates} updates
                    </p>
                    <p className='text-xs text-[#94A3B8] dark:text-[#64748B]'>
                      {project.members} member{project.members === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Activity */}
      <section
        className={cn(
          'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6',
          'dark:border-slate-700 dark:bg-[#1E293B]'
        )}
      >
        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            Today&apos;s Uploads
          </h2>
          <button
            type='button'
            className='text-xs font-semibold text-[#7C3AED] hover:underline dark:text-violet-300'
          >
            View all activity
          </button>
        </div>

        <ul className='mt-4 divide-y divide-slate-100 dark:divide-slate-800'>
          {ACTIVITY.map((item) => (
            <li
              key={`${item.name}-${item.time}`}
              className='flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex min-w-0 items-center gap-3'>
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    item.color
                  )}
                >
                  {item.initials}
                </span>
                <p className='text-sm text-[#334155] dark:text-[#E2E8F0]'>
                  <span className='font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                    {item.name}
                  </span>{' '}
                  {item.action}
                </p>
              </div>
              <span className='shrink-0 ps-12 text-xs text-[#94A3B8] sm:ps-0 dark:text-[#64748B]'>
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  )
}
