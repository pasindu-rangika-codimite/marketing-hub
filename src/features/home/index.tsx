import { useState } from 'react'
import { addDays, format, isBefore, isSameDay, startOfWeek } from 'date-fns'
import {
  Check,
  Clock3,
  FolderKanban,
  Link2,
  ListChecks,
  Minus,
  Paperclip,
  Upload,
  UploadCloud,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ProgressHubShell,
  WEEK_LABEL,
  WEEK_RANGE,
} from './progress-hub-shell'

// Real counts arrive with the Firestore wiring (uploads/updates phases).
const STATS = [
  {
    label: 'Updates Added',
    value: 0,
    icon: ListChecks,
    iconClass:
      'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  },
  {
    label: 'Projects Tagged',
    value: 0,
    icon: FolderKanban,
    iconClass:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  {
    label: 'Files Uploaded',
    value: 0,
    icon: Paperclip,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  },
] as const

type WeekDayStatus = 'done' | 'empty' | 'pending'

const WEEK_DAYS: { day: string; status: WeekDayStatus; detail: string }[] =
  (() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    return Array.from({ length: 5 }, (_, index) => {
      const day = addDays(weekStart, index)
      if (isSameDay(day, today)) {
        return {
          day: format(day, 'EEE d'),
          status: 'pending' as const,
          detail: 'Today',
        }
      }
      return {
        day: format(day, 'EEE d'),
        status: 'empty' as const,
        detail: isBefore(day, today) ? '0 updates' : '—',
      }
    })
  })()

// Placeholder until real uploads land (needs the Blaze plan for Storage).
function showComingSoon() {
  toast.info('Uploads are coming soon', {
    description:
      'File storage is being set up. You will be able to add updates here shortly.',
  })
}

export function HomePage() {
  const [linkValue, setLinkValue] = useState('')
  const [noteValue, setNoteValue] = useState('')

  return (
    <ProgressHubShell
      active='home'
      title="This Week's Updates"
      subtitle={`${WEEK_LABEL} • ${WEEK_RANGE}`}
    >
      <p className='mb-6 text-sm text-[#64748B] sm:mb-8 dark:text-[#94A3B8]'>
        Add your design updates for this week.
      </p>

      <div className='mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4'>
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

      <div className='grid gap-4 xl:grid-cols-3 xl:gap-5'>
        <section
          className={cn(
            'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
            'dark:border-slate-700 dark:bg-[#1E293B] sm:p-6'
          )}
        >
          <div
            className={cn(
              'flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed',
              'border-violet-200 bg-violet-50/50 px-4 py-10 text-center',
              'dark:border-violet-500/30 dark:bg-violet-500/10'
            )}
          >
            <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20'>
              <UploadCloud className='size-6 text-[#7C3AED] dark:text-violet-300' />
            </div>
            <p className='text-sm font-medium text-[#334155] dark:text-[#E2E8F0]'>
              Drag & drop your files here or{' '}
              <button
                type='button'
                className='font-semibold text-[#7C3AED] underline-offset-2 hover:underline dark:text-violet-300'
                onClick={showComingSoon}
              >
                browse
              </button>{' '}
              from your device.
            </p>
            <p className='mt-2 max-w-xs text-xs text-[#64748B] dark:text-[#94A3B8]'>
              Add design files, screenshots, PDFs, or links for this week.
            </p>
          </div>

          <Button
            type='button'
            onClick={showComingSoon}
            className={cn(
              'mt-5 h-11 w-full rounded-xl text-sm font-semibold text-white shadow-none',
              'bg-[#7C3AED] hover:bg-[#6D28D9]'
            )}
          >
            <Upload className='size-4' />
            Add New Update
          </Button>
        </section>

        <section
          className={cn(
            'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
            'dark:border-slate-700 dark:bg-[#1E293B] sm:p-6'
          )}
        >
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            Add Link with Note
          </h2>

          <label className='mt-5 block text-xs font-medium text-[#64748B] dark:text-[#94A3B8]'>
            Link
          </label>
          <div className='relative mt-1.5'>
            <Link2 className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
            <Input
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder='https://example.com/design'
              className='h-11 rounded-xl ps-10'
            />
          </div>

          <label className='mt-4 block text-xs font-medium text-[#64748B] dark:text-[#94A3B8]'>
            Note (optional)
          </label>
          <Textarea
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder='Add a short note about this link...'
            className='mt-1.5 min-h-[120px] flex-1 resize-none rounded-xl'
          />

          <div className='mt-5 flex justify-end'>
            <Button
              type='button'
              onClick={showComingSoon}
              className={cn(
                'h-10 rounded-xl px-5 text-sm font-semibold text-white shadow-none',
                'bg-[#7C3AED] hover:bg-[#6D28D9]'
              )}
            >
              <Link2 className='size-4' />
              Add Link
            </Button>
          </div>
        </section>

        <section
          className={cn(
            'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
            'dark:border-slate-700 dark:bg-[#1E293B] sm:p-6'
          )}
        >
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            This Week Status
          </h2>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            Your progress for this week.
          </p>

          <ul className='mt-5 flex flex-1 flex-col gap-2.5'>
            {WEEK_DAYS.map((item) => (
              <li
                key={item.day}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5',
                  item.status === 'pending'
                    ? 'bg-violet-50 dark:bg-violet-500/10'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                )}
              >
                <div className='flex items-center gap-3'>
                  {item.status === 'done' && (
                    <span className='flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'>
                      <Check className='size-3.5 stroke-[3]' />
                    </span>
                  )}
                  {item.status === 'empty' && (
                    <span className='flex size-7 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'>
                      <Minus className='size-3.5' />
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className='flex size-7 items-center justify-center rounded-full bg-violet-100 text-[#7C3AED] dark:bg-violet-500/20 dark:text-violet-300'>
                      <Clock3 className='size-3.5' />
                    </span>
                  )}
                  <span className='text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                    {item.day}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    item.status === 'pending'
                      ? 'text-[#7C3AED] dark:text-violet-300'
                      : 'text-[#64748B] dark:text-[#94A3B8]'
                  )}
                >
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ProgressHubShell>
  )
}
