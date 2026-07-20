import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type AccessStatus = 'approved' | 'pending'

type Member = {
  id: string
  initials: string
  name: string
  color: string
  email: string
  role: string
  status: AccessStatus
  lastUpdate: string
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    initials: 'SN',
    name: 'Subodha N.',
    color: 'bg-sky-500',
    email: 'subodha@company.com',
    role: 'Designer',
    status: 'approved',
    lastUpdate: 'Today, 10:24 AM',
  },
  {
    id: '2',
    initials: 'D2',
    name: 'Designer 2',
    color: 'bg-violet-500',
    email: 'designer2@company.com',
    role: 'Designer',
    status: 'approved',
    lastUpdate: 'Today, 09:48 AM',
  },
  {
    id: '3',
    initials: 'D3',
    name: 'Designer 3',
    color: 'bg-orange-500',
    email: 'designer3@company.com',
    role: 'Designer',
    status: 'pending',
    lastUpdate: 'No updates',
  },
  {
    id: '4',
    initials: 'D4',
    name: 'Designer 4',
    color: 'bg-emerald-500',
    email: 'designer4@company.com',
    role: 'Designer',
    status: 'approved',
    lastUpdate: 'Yesterday',
  },
  {
    id: '5',
    initials: 'D5',
    name: 'Designer 5',
    color: 'bg-rose-500',
    email: 'designer5@company.com',
    role: 'Designer',
    status: 'approved',
    lastUpdate: '2 days ago',
  },
  {
    id: '6',
    initials: 'D6',
    name: 'Designer 6',
    color: 'bg-indigo-500',
    email: 'designer6@company.com',
    role: 'Manager/Admin',
    status: 'approved',
    lastUpdate: 'Today, 08:30 AM',
  },
]

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AccessStatus>('all')

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || member.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [members, search, statusFilter])

  const handleAction = (id: string) => {
    setMembers((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member
        if (member.status === 'pending') {
          return { ...member, status: 'approved' as const }
        }
        return member
      })
    )
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Members
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Manage team members and control access to the workspace.
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
              onValueChange={(v) =>
                setStatusFilter(v as 'all' | AccessStatus)
              }
            >
              <SelectTrigger className='h-10 w-full rounded-xl sm:w-[140px]'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] text-sm'>
            <thead>
              <tr className='border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium tracking-wide text-[#64748B] uppercase dark:border-slate-700 dark:bg-slate-800/50 dark:text-[#94A3B8]'>
                <th className='px-4 py-3 font-medium sm:px-6'>Member</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Email</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Role</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Access Status</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Last Update</th>
                <th className='px-4 py-3 text-end font-medium sm:px-6'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
              {filtered.map((member) => (
                <tr key={member.id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30'>
                  <td className='px-4 py-4 sm:px-6'>
                    <div className='flex items-center gap-2.5'>
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                          member.color
                        )}
                      >
                        {member.initials}
                      </span>
                      <span className='font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-[#64748B] sm:px-6 dark:text-[#94A3B8]'>
                    {member.email}
                  </td>
                  <td className='px-4 py-4 text-[#334155] sm:px-6 dark:text-[#E2E8F0]'>
                    {member.role}
                  </td>
                  <td className='px-4 py-4 sm:px-6'>
                    {member.status === 'approved' ? (
                      <span className='inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'>
                        Approved
                      </span>
                    ) : (
                      <span className='inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-300'>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-4 text-[#64748B] sm:px-6 dark:text-[#94A3B8]'>
                    {member.lastUpdate}
                  </td>
                  <td className='px-4 py-4 text-end sm:px-6'>
                    {member.status === 'pending' ? (
                      <button
                        type='button'
                        onClick={() => handleAction(member.id)}
                        className={cn(
                          'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600',
                          'hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
                          'dark:hover:bg-emerald-500/20'
                        )}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        type='button'
                        className={cn(
                          'rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600',
                          'hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
                          'dark:hover:bg-red-500/20'
                        )}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className='px-6 py-12 text-center text-sm text-[#64748B] dark:text-[#94A3B8]'>
            No members match your search.
          </p>
        )}
      </section>
    </AdminShell>
  )
}
