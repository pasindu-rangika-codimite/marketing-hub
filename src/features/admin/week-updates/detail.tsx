import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { format, isSameDay } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Inbox,
  Link2,
} from 'lucide-react'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import {
  useAllAssets,
  useAllUpdates,
  useCategories,
} from '@/hooks/use-live-data'
import {
  ADMIN_WEEK_LABEL,
  ADMIN_WEEK_RANGE,
  AdminShell,
} from '@/features/admin/components/admin-shell'

type WeekUpdatesDetailPageProps = {
  projectId: string
  projectName: string
}

type FeedItem = {
  id: string
  member: string
  title: string
  subtitle: string
  url: string
  kind: 'file' | 'link'
  categoryId: string
  createdAt: Date
}

export function WeekUpdatesDetailPage({
  projectId,
  projectName,
}: WeekUpdatesDetailPageProps) {
  const { assets } = useAllAssets()
  const { updates } = useAllUpdates()
  const { categories } = useCategories()

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? ''

  const dayGroups = useMemo(() => {
    const items: FeedItem[] = []

    for (const asset of assets) {
      if (asset.projectId !== projectId) continue
      if (!(asset.createdAt instanceof Timestamp)) continue
      items.push({
        id: `asset-${asset.id}`,
        member: asset.ownerName,
        title: asset.fileName,
        subtitle: asset.fileType,
        url: asset.downloadURL,
        kind: 'file',
        categoryId: asset.categoryId,
        createdAt: asset.createdAt.toDate(),
      })
    }

    for (const update of updates) {
      if (update.projectId !== projectId) continue
      if (!(update.createdAt instanceof Timestamp)) continue
      items.push({
        id: `update-${update.id}`,
        member: update.ownerName,
        title: update.title,
        subtitle: update.description || update.linkUrl || '',
        url: update.linkUrl ?? '',
        kind: 'link',
        categoryId: update.categoryId,
        createdAt: update.createdAt.toDate(),
      })
    }

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const groups: { dateLabel: string; date: Date; items: FeedItem[] }[] = []
    for (const item of items) {
      const group = groups.find((g) => isSameDay(g.date, item.createdAt))
      if (group) {
        group.items.push(item)
      } else {
        groups.push({
          dateLabel: format(item.createdAt, 'EEEE, MMM d'),
          date: item.createdAt,
          items: [item],
        })
      }
    }
    return groups
  }, [assets, updates, projectId])

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
              All updates from the team for this project.
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

      {dayGroups.length === 0 ? (
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
            When team members upload files or add links tagged with this
            project, they will appear here grouped by day.
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {dayGroups.map((group) => (
            <section key={group.dateLabel}>
              <h2 className='mb-3 text-sm font-bold tracking-wide text-[#64748B] uppercase dark:text-[#94A3B8]'>
                {group.dateLabel}
              </h2>
              <div
                className={cn(
                  'divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
                  'dark:divide-slate-800 dark:border-slate-700 dark:bg-[#1E293B]'
                )}
              >
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-3 px-4 py-4 sm:px-6'
                  >
                    <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white'>
                      {getDisplayNameInitials(item.member)}
                    </span>

                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                        <span className='text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                          {item.member}
                        </span>
                        {categoryName(item.categoryId) && (
                          <span className='rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300'>
                            {categoryName(item.categoryId)}
                          </span>
                        )}
                        <span className='text-xs text-[#94A3B8]'>
                          {format(item.createdAt, 'h:mm a')}
                        </span>
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target='_blank'
                          rel='noreferrer'
                          className='mt-0.5 block truncate text-sm text-[#334155] hover:underline dark:text-[#E2E8F0]'
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p className='mt-0.5 truncate text-sm text-[#334155] dark:text-[#E2E8F0]'>
                          {item.title}
                        </p>
                      )}
                      {item.subtitle && (
                        <p className='truncate text-xs text-[#64748B] dark:text-[#94A3B8]'>
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg',
                        item.kind === 'file'
                          ? 'bg-violet-100 text-[#7C3AED] dark:bg-violet-500/20 dark:text-violet-300'
                          : 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300'
                      )}
                    >
                      {item.kind === 'file' ? (
                        <FileText className='size-4' />
                      ) : (
                        <Link2 className='size-4' />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
