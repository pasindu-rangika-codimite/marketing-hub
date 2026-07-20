import { useMemo, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { UserStatus } from '@/types'
import { isAdminEmail } from '@/config/app'
import { setUserStatus, type MemberRecord } from '@/lib/firebase'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { useAllUsers } from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const AVATAR_COLORS = [
  'bg-sky-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
]

function avatarColor(uid: string): string {
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash]
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === 'approved') {
    return (
      <span className='inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'>
        Approved
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className='inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300'>
        Pending
      </span>
    )
  }
  return (
    <span className='inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-300'>
      Rejected
    </span>
  )
}

export function AdminMembersPage() {
  const { users, isLoading } = useAllUsers()
  const currentUser = useAuthStore((state) => state.auth.user)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')
  const [busyUid, setBusyUid] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((member) => {
      const matchesSearch =
        !q ||
        member.displayName.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' || member.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [users, search, statusFilter])

  const pendingCount = users.filter((u) => u.status === 'pending').length

  const changeStatus = async (member: MemberRecord, status: UserStatus) => {
    if (busyUid) return
    setBusyUid(member.uid)
    try {
      await setUserStatus(member.uid, status)
      toast.success(
        status === 'approved' ? 'Member approved' : 'Access removed',
        { description: member.email }
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update member status:', error)
      toast.error('Could not update member', {
        description: 'Please try again.',
      })
    } finally {
      setBusyUid(null)
    }
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Members
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Approve access requests and manage who can use the workspace.
          {pendingCount > 0 && (
            <span className='ms-2 font-semibold text-orange-600 dark:text-orange-300'>
              {pendingCount} pending approval{pendingCount === 1 ? '' : 's'}
            </span>
          )}
        </p>
      </div>

      <section
        className={cn(
          'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
          'dark:border-slate-700 dark:bg-[#1E293B]'
        )}
      >
        <div className='flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700'>
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            All Members
          </h2>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <div className='relative w-full sm:w-[220px]'>
              <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search member'
                className='h-10 rounded-xl ps-9'
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as 'all' | UserStatus)}
            >
              <SelectTrigger className='h-10 w-full rounded-xl sm:w-[140px]'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center px-6 py-16'>
            <Loader2 className='size-6 animate-spin text-slate-400' />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[760px] text-sm'>
              <thead>
                <tr className='border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium tracking-wide text-[#64748B] uppercase dark:border-slate-700 dark:bg-slate-800/50 dark:text-[#94A3B8]'>
                  <th className='px-4 py-3 font-medium sm:px-6'>Member</th>
                  <th className='px-4 py-3 font-medium sm:px-6'>Email</th>
                  <th className='px-4 py-3 font-medium sm:px-6'>Role</th>
                  <th className='px-4 py-3 font-medium sm:px-6'>
                    Access Status
                  </th>
                  <th className='px-4 py-3 text-end font-medium sm:px-6'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                {filtered.map((member) => {
                  const isSelf = member.uid === currentUser?.uid
                  const memberIsAdmin = isAdminEmail(member.email)
                  const isBusy = busyUid === member.uid

                  return (
                    <tr
                      key={member.uid}
                      className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    >
                      <td className='px-4 py-4 sm:px-6'>
                        <div className='flex items-center gap-2.5'>
                          {member.photoURL ? (
                            <img
                              src={member.photoURL}
                              alt={member.displayName}
                              referrerPolicy='no-referrer'
                              className='size-8 shrink-0 rounded-full object-cover'
                            />
                          ) : (
                            <span
                              className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                                avatarColor(member.uid)
                              )}
                            >
                              {getDisplayNameInitials(member.displayName)}
                            </span>
                          )}
                          <span className='font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                            {member.displayName}
                            {isSelf && (
                              <span className='ms-1.5 text-xs font-normal text-[#64748B] dark:text-[#94A3B8]'>
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-4 text-[#64748B] sm:px-6 dark:text-[#94A3B8]'>
                        {member.email}
                      </td>
                      <td className='px-4 py-4 text-[#334155] sm:px-6 dark:text-[#E2E8F0]'>
                        {memberIsAdmin ? 'Admin' : 'Member'}
                      </td>
                      <td className='px-4 py-4 sm:px-6'>
                        <StatusBadge status={member.status} />
                      </td>
                      <td className='px-4 py-4 text-end sm:px-6'>
                        {isSelf || memberIsAdmin ? (
                          <span className='text-xs text-[#94A3B8]'>—</span>
                        ) : (
                          <div className='inline-flex items-center gap-2'>
                            {member.status !== 'approved' && (
                              <button
                                type='button'
                                disabled={isBusy}
                                onClick={() =>
                                  changeStatus(member, 'approved')
                                }
                                className={cn(
                                  'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600',
                                  'hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
                                  'dark:hover:bg-emerald-500/20'
                                )}
                              >
                                Approve
                              </button>
                            )}
                            {member.status !== 'rejected' && (
                              <button
                                type='button'
                                disabled={isBusy}
                                onClick={() =>
                                  changeStatus(member, 'rejected')
                                }
                                className={cn(
                                  'rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600',
                                  'hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
                                  'dark:hover:bg-red-500/20'
                                )}
                              >
                                {member.status === 'pending'
                                  ? 'Reject'
                                  : 'Disable'}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className='px-6 py-12 text-center text-sm text-[#64748B] dark:text-[#94A3B8]'>
            {users.length === 0
              ? 'No members yet. New sign-ins will appear here for approval.'
              : 'No members match your search.'}
          </p>
        )}
      </section>
    </AdminShell>
  )
}
