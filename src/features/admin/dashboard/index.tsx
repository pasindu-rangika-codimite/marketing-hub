import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Clock3,
  FolderKanban,
  Tag,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { setUserStatus, type MemberRecord } from '@/lib/firebase'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import {
  useAllUsers,
  useCategories,
  useProjects,
} from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
import { AdminShell } from '@/features/admin/components/admin-shell'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function AdminDashboard() {
  const { users, isLoading: usersLoading } = useAllUsers()
  const { projects } = useProjects()
  const { categories } = useCategories()
  const currentUser = useAuthStore((state) => state.auth.user)

  const pending = users.filter((u) => u.status === 'pending')
  const approvedCount = users.filter((u) => u.status === 'approved').length

  const stats = [
    {
      label: 'Approved Members',
      value: usersLoading ? '…' : String(approvedCount),
      icon: Users,
      iconClass:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    },
    {
      label: 'Pending Approvals',
      value: usersLoading ? '…' : String(pending.length),
      icon: Clock3,
      iconClass:
        'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    },
    {
      label: 'Projects',
      value: String(projects.length),
      icon: FolderKanban,
      iconClass:
        'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    },
    {
      label: 'Categories',
      value: String(categories.length),
      icon: Tag,
      iconClass:
        'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
    },
  ]

  const approve = async (member: MemberRecord) => {
    try {
      await setUserStatus(member.uid, 'approved')
      toast.success('Member approved', { description: member.email })
    } catch {
      toast.error('Could not approve member')
    }
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          {greeting()}, {currentUser?.displayName?.split(' ')[0] ?? 'Admin'}!
          👋
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      <div className='mb-6 grid gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4'>
        {stats.map((stat) => (
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

      <div className='grid gap-4 xl:grid-cols-2 xl:gap-5'>
        {/* Pending access requests */}
        <section
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6',
            'dark:border-slate-700 dark:bg-[#1E293B]'
          )}
        >
          <div className='flex items-center justify-between'>
            <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
              Pending Access Requests
            </h2>
            <Link
              to='/admin/members'
              className='inline-flex items-center gap-1 text-sm font-semibold text-[#7C3AED] hover:underline dark:text-violet-300'
            >
              All members
              <ArrowRight className='size-3.5' />
            </Link>
          </div>

          {pending.length === 0 ? (
            <p className='mt-6 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-[#64748B] dark:bg-slate-800/50 dark:text-[#94A3B8]'>
              No pending requests. New sign-ins will appear here.
            </p>
          ) : (
            <ul className='mt-4 flex flex-col divide-y divide-slate-100 dark:divide-slate-800'>
              {pending.map((member) => (
                <li
                  key={member.uid}
                  className='flex items-center justify-between gap-3 py-3'
                >
                  <div className='flex min-w-0 items-center gap-2.5'>
                    {member.photoURL ? (
                      <img
                        src={member.photoURL}
                        alt={member.displayName}
                        referrerPolicy='no-referrer'
                        className='size-8 shrink-0 rounded-full object-cover'
                      />
                    ) : (
                      <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white'>
                        {getDisplayNameInitials(member.displayName)}
                      </span>
                    )}
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                        {member.displayName}
                      </p>
                      <p className='truncate text-xs text-[#64748B] dark:text-[#94A3B8]'>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => approve(member)}
                    className={cn(
                      'shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600',
                      'hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
                      'dark:hover:bg-emerald-500/20'
                    )}
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Workspace setup */}
        <section
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6',
            'dark:border-slate-700 dark:bg-[#1E293B]'
          )}
        >
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            Workspace Setup
          </h2>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            Keep projects and categories ready so the team can tag their
            updates.
          </p>

          <div className='mt-4 flex flex-col gap-3'>
            <Link
              to='/admin/projects'
              className={cn(
                'flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5',
                'hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
              )}
            >
              <span className='flex items-center gap-3'>
                <span className='flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300'>
                  <FolderKanban className='size-4' />
                </span>
                <span className='text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                  Manage Projects
                  <span className='ms-2 text-xs font-normal text-[#64748B] dark:text-[#94A3B8]'>
                    {projects.length} active
                  </span>
                </span>
              </span>
              <ArrowRight className='size-4 text-slate-400' />
            </Link>

            <Link
              to='/admin/category'
              className={cn(
                'flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5',
                'hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
              )}
            >
              <span className='flex items-center gap-3'>
                <span className='flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300'>
                  <Tag className='size-4' />
                </span>
                <span className='text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                  Manage Categories
                  <span className='ms-2 text-xs font-normal text-[#64748B] dark:text-[#94A3B8]'>
                    {categories.length} active
                  </span>
                </span>
              </span>
              <ArrowRight className='size-4 text-slate-400' />
            </Link>

            <div
              className={cn(
                'mt-1 rounded-xl bg-[#F3E8FF] px-4 py-3.5 text-sm text-[#5B21B6]',
                'dark:bg-violet-500/10 dark:text-violet-200'
              )}
            >
              Team activity and update statistics will appear here once
              members start posting updates.
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
