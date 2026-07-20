import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  Layers,
  Link2,
  Search,
  Tag,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import {
  ADMIN_WEEK_LABEL,
  ADMIN_WEEK_RANGE,
  AdminShell,
} from '@/features/admin/components/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CategoryKey = 'ui-design' | 'flyer' | 'branding' | 'other'

type UpdateItem = {
  id: string
  member: string
  initials: string
  color: string
  category: CategoryKey
  title: string
  description: string
  time: string
  type: 'image' | 'link'
}

type DayGroup = {
  dateLabel: string
  updates: UpdateItem[]
}

const CATEGORY_STYLES: Record<
  CategoryKey,
  { label: string; className: string }
> = {
  'ui-design': {
    label: 'UI Design',
    className:
      'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  },
  flyer: {
    label: 'Flyer',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  branding: {
    label: 'Branding',
    className:
      'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  },
  other: {
    label: 'Other',
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
}

const DAY_GROUPS: DayGroup[] = [
  {
    dateLabel: 'Monday, Jun 22',
    updates: [
      {
        id: '1',
        member: 'Aisha Khan',
        initials: 'AK',
        color: 'bg-violet-500',
        category: 'ui-design',
        title: 'Dashboard – Analytics Overview',
        description: 'Updated the analytics cards and chart styles.',
        time: '10:15 AM',
        type: 'image',
      },
      {
        id: '2',
        member: 'Ravi Kumar',
        initials: 'RK',
        color: 'bg-sky-500',
        category: 'flyer',
        title: 'Promo Flyer – Week 26',
        description: 'Finalized flyer layout for social posts.',
        time: '11:40 AM',
        type: 'image',
      },
      {
        id: '3',
        member: 'Subodha N.',
        initials: 'SN',
        color: 'bg-emerald-500',
        category: 'branding',
        title: 'Brand Color Tokens',
        description: 'Shared Figma link for updated brand tokens.',
        time: '02:20 PM',
        type: 'link',
      },
    ],
  },
  {
    dateLabel: 'Tuesday, Jun 23',
    updates: [
      {
        id: '4',
        member: 'Designer 2',
        initials: 'D2',
        color: 'bg-orange-500',
        category: 'ui-design',
        title: 'Sidebar Navigation Polish',
        description: 'Improved active states and spacing.',
        time: '09:30 AM',
        type: 'image',
      },
      {
        id: '5',
        member: 'Designer 4',
        initials: 'D4',
        color: 'bg-rose-500',
        category: 'ui-design',
        title: 'Empty State Illustrations',
        description: 'Added empty-state assets for updates list.',
        time: '01:05 PM',
        type: 'image',
      },
    ],
  },
  {
    dateLabel: 'Wednesday, Jun 24',
    updates: [
      {
        id: '6',
        member: 'Aisha Khan',
        initials: 'AK',
        color: 'bg-violet-500',
        category: 'other',
        title: 'Meeting Notes Link',
        description: 'Linked notes from the weekly design sync.',
        time: '04:10 PM',
        type: 'link',
      },
    ],
  },
]

type WeekUpdatesDetailProps = {
  projectName: string
}

export function WeekUpdatesDetailPage({ projectName }: WeekUpdatesDetailProps) {
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredGroups = useMemo(() => {
    return DAY_GROUPS.map((group) => ({
      ...group,
      updates: group.updates.filter((item) => {
        const q = search.trim().toLowerCase()
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.member.toLowerCase().includes(q)
        const matchesMember =
          memberFilter === 'all' || item.member === memberFilter
        const matchesCategory =
          categoryFilter === 'all' || item.category === categoryFilter
        return matchesSearch && matchesMember && matchesCategory
      }),
    })).filter((group) => group.updates.length > 0)
  }, [search, memberFilter, categoryFilter])

  return (
    <AdminShell>
      <div className='mb-2'>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          <Link
            to='/admin/week-updates'
            className='font-medium text-[#7C3AED] hover:underline dark:text-violet-300'
          >
            Week Updates
          </Link>
          <span className='mx-1.5'>/</span>
          <span className='text-[#334155] dark:text-[#E2E8F0]'>{projectName}</span>
        </p>
      </div>

      <div className='mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
            {projectName} - Weekly Updates
          </h1>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            All project updates and activities for the selected week.
          </p>
        </div>

        <Button
          type='button'
          className={cn(
            'h-11 shrink-0 rounded-xl px-5 text-sm font-semibold text-white shadow-none',
            'bg-[#3B82F6] hover:bg-[#2563EB]'
          )}
        >
          <Download className='size-4' />
          Download zip
        </Button>
      </div>

      <div className='mb-6 flex flex-col gap-3 xl:flex-row xl:items-center'>
        <div className='relative min-w-0 flex-1'>
          <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search updates...'
            className='h-11 rounded-xl ps-9'
          />
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className='h-11 w-full rounded-xl sm:w-[160px]'>
              <Users className='size-4 text-slate-400' />
              <SelectValue placeholder='All Members' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Members</SelectItem>
              <SelectItem value='Aisha Khan'>Aisha Khan</SelectItem>
              <SelectItem value='Ravi Kumar'>Ravi Kumar</SelectItem>
              <SelectItem value='Subodha N.'>Subodha N.</SelectItem>
              <SelectItem value='Designer 2'>Designer 2</SelectItem>
              <SelectItem value='Designer 4'>Designer 4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='h-11 w-full rounded-xl sm:w-[170px]'>
              <Tag className='size-4 text-slate-400' />
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='ui-design'>UI Design</SelectItem>
              <SelectItem value='flyer'>Flyer</SelectItem>
              <SelectItem value='branding'>Branding</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>

          <button
            type='button'
            className={cn(
              'flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium',
              'text-[#334155] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]'
            )}
          >
            <CalendarDays className='size-4 text-[#7C3AED]' />
            <span className='hidden max-w-[200px] truncate lg:inline'>
              {ADMIN_WEEK_LABEL} • {ADMIN_WEEK_RANGE}
            </span>
            <span className='truncate lg:hidden'>{ADMIN_WEEK_LABEL}</span>
            <ChevronDown className='size-4 text-slate-400' />
          </button>

          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-11 shrink-0 rounded-xl'
            aria-label='Filter'
          >
            <Filter className='size-4' />
          </Button>
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]'>
        <div className='space-y-6'>
          {filteredGroups.map((group) => (
            <section
              key={group.dateLabel}
              className={cn(
                'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
                'dark:border-slate-700 dark:bg-[#1E293B]'
              )}
            >
              <div className='flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 dark:border-slate-700'>
                <h2 className='text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                  {group.dateLabel}
                </h2>
                <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#64748B] dark:bg-slate-800 dark:text-[#94A3B8]'>
                  {group.updates.length} update
                  {group.updates.length === 1 ? '' : 's'}
                </span>
              </div>

              <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
                {group.updates.map((item) => {
                  const cat = CATEGORY_STYLES[item.category]
                  return (
                    <li
                      key={item.id}
                      className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5'
                    >
                      {item.type === 'link' ? (
                        <div className='flex size-14 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/15'>
                          <Link2 className='size-5 text-sky-600 dark:text-sky-300' />
                        </div>
                      ) : (
                        <PlaceholderImage
                          label='Img'
                          rounded='xl'
                          className='size-14 shrink-0'
                        />
                      )}

                      <div className='min-w-0 flex-1'>
                        <div className='mb-1.5 flex flex-wrap items-center gap-2'>
                          <span
                            className={cn(
                              'flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white',
                              item.color
                            )}
                          >
                            {item.initials}
                          </span>
                          <span className='text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                            {item.member}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                              cat.className
                            )}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <p className='text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                          {item.title}
                        </p>
                        <p className='mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                          {item.description}
                        </p>
                        <p className='mt-1 text-xs text-[#94A3B8]'>{item.time}</p>
                      </div>

                      <button
                        type='button'
                        className='shrink-0 text-sm font-semibold text-[#3B82F6] hover:underline dark:text-sky-400'
                      >
                        View
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          {filteredGroups.length === 0 && (
            <p className='rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-[#64748B] dark:border-slate-700 dark:text-[#94A3B8]'>
              No updates match your filters.
            </p>
          )}
        </div>

        <aside className='space-y-4'>
          <section
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
              'dark:border-slate-700 dark:bg-[#1E293B]'
            )}
          >
            <div className='mb-4 flex items-center gap-2'>
              <BarChart3 className='size-4 text-[#7C3AED]' />
              <h3 className='text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                Weekly Summary
              </h3>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {[
                { label: 'Total Updates', value: '10' },
                { label: 'Files', value: '7' },
                { label: 'Links', value: '3' },
                { label: 'Active Members', value: '6' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className='rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60'
                >
                  <p className='text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                    {stat.value}
                  </p>
                  <p className='mt-0.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]'>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
              'dark:border-slate-700 dark:bg-[#1E293B]'
            )}
          >
            <div className='mb-4 flex items-center gap-2'>
              <Layers className='size-4 text-[#7C3AED]' />
              <h3 className='text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                Category Summary
              </h3>
            </div>
            <ul className='space-y-3'>
              {[
                { label: 'UI Design', value: 6, dot: 'bg-violet-500' },
                { label: 'Flyer', value: 3, dot: 'bg-emerald-500' },
                { label: 'Branding', value: 2, dot: 'bg-pink-500' },
                { label: 'Other', value: 1, dot: 'bg-slate-400' },
              ].map((row) => (
                <li
                  key={row.label}
                  className='flex items-center justify-between text-sm'
                >
                  <span className='flex items-center gap-2 text-[#334155] dark:text-[#E2E8F0]'>
                    <span className={cn('size-2.5 rounded-full', row.dot)} />
                    {row.label}
                  </span>
                  <span className='font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700'>
              <span className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                Total
              </span>
              <span className='text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                12
              </span>
            </div>
          </section>
        </aside>
      </div>
    </AdminShell>
  )
}
