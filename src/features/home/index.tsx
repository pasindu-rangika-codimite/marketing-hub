import { useMemo, useRef, useState, type DragEvent } from 'react'
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfWeek,
} from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import {
  Check,
  Clock3,
  FolderKanban,
  Link2,
  ListChecks,
  Loader2,
  Minus,
  Paperclip,
  Upload,
  UploadCloud,
} from 'lucide-react'
import { toast } from 'sonner'
import { createUpdate, uploadAsset } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { useMyAssets, useMyUpdates } from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ProgressHubShell,
  WEEK_LABEL,
  WEEK_RANGE,
} from './progress-hub-shell'

type UploadProgress = {
  name: string
  percent: number
}

function createdThisWeek(createdAt: unknown, weekStart: Date): boolean {
  if (!(createdAt instanceof Timestamp)) return false
  const date = createdAt.toDate()
  return date >= weekStart && date < addDays(weekStart, 7)
}

function linkTitle(linkUrl: string, note: string): string {
  const firstLine = note.split('\n')[0]?.trim()
  if (firstLine) return firstLine
  try {
    return new URL(linkUrl).hostname
  } catch {
    return linkUrl
  }
}

export function HomePage() {
  const user = useAuthStore((state) => state.auth.user)
  const { assets } = useMyAssets(user?.uid)
  const { updates } = useMyUpdates(user?.uid)

  const [linkValue, setLinkValue] = useState('')
  const [noteValue, setNoteValue] = useState('')
  const [isSavingLink, setIsSavingLink] = useState(false)
  const [uploading, setUploading] = useState<UploadProgress[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { today, weekStart } = useMemo(() => {
    const now = new Date()
    return { today: now, weekStart: startOfWeek(now, { weekStartsOn: 1 }) }
  }, [])

  const weekAssets = useMemo(
    () => assets.filter((a) => createdThisWeek(a.createdAt, weekStart)),
    [assets, weekStart]
  )
  const weekUpdates = useMemo(
    () => updates.filter((u) => createdThisWeek(u.createdAt, weekStart)),
    [updates, weekStart]
  )

  const projectsTagged = useMemo(() => {
    const ids = new Set<string>()
    for (const a of weekAssets) if (a.projectId) ids.add(a.projectId)
    for (const u of weekUpdates) if (u.projectId) ids.add(u.projectId)
    return ids.size
  }, [weekAssets, weekUpdates])

  const stats = [
    {
      label: 'Updates Added',
      value: weekUpdates.length,
      icon: ListChecks,
      iconClass:
        'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    },
    {
      label: 'Projects Tagged',
      value: projectsTagged,
      icon: FolderKanban,
      iconClass:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    },
    {
      label: 'Files Uploaded',
      value: weekAssets.length,
      icon: Paperclip,
      iconClass:
        'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
    },
  ]

  const weekDays = useMemo(() => {
    const countFor = (day: Date) =>
      [...weekAssets, ...weekUpdates].filter(
        (item) =>
          item.createdAt instanceof Timestamp &&
          isSameDay(item.createdAt.toDate(), day)
      ).length

    return Array.from({ length: 5 }, (_, index) => {
      const day = addDays(weekStart, index)
      const count = countFor(day)
      const label = `${count} update${count === 1 ? '' : 's'}`
      if (isSameDay(day, today)) {
        return {
          day: format(day, 'EEE d'),
          status: count > 0 ? ('done' as const) : ('pending' as const),
          detail: count > 0 ? label : 'Today',
        }
      }
      if (isBefore(day, today)) {
        return {
          day: format(day, 'EEE d'),
          status: count > 0 ? ('done' as const) : ('empty' as const),
          detail: label,
        }
      }
      return {
        day: format(day, 'EEE d'),
        status: 'empty' as const,
        detail: '—',
      }
    })
  }, [weekAssets, weekUpdates, weekStart, today])

  const handleFiles = async (fileList: FileList | File[] | null) => {
    if (!fileList || !user) return
    const files = Array.from(fileList)
    if (files.length === 0) return
    if (fileInputRef.current) fileInputRef.current.value = ''

    for (const file of files) {
      setUploading((prev) => [...prev, { name: file.name, percent: 0 }])
      try {
        await uploadAsset(
          file,
          { uid: user.uid, displayName: user.displayName },
          { projectId: '', categoryId: '' },
          {
            onProgress: (percent) =>
              setUploading((prev) =>
                prev.map((u) =>
                  u.name === file.name ? { ...u, percent } : u
                )
              ),
          }
        )
        toast.success('File uploaded', {
          description: `${file.name} — tag it with a project in My Updates.`,
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Upload failed:', error)
        toast.error('Upload failed', {
          description:
            error instanceof Error
              ? error.message
              : `Could not upload ${file.name}.`,
        })
      } finally {
        setUploading((prev) => prev.filter((u) => u.name !== file.name))
      }
    }
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    handleFiles(event.dataTransfer.files)
  }

  const handleAddLink = async () => {
    const link = linkValue.trim()
    if (!link || !user || isSavingLink) return

    setIsSavingLink(true)
    try {
      await createUpdate(
        {
          title: linkTitle(link, noteValue),
          description: noteValue.trim(),
          linkUrl: link,
          projectId: '',
          categoryId: '',
        },
        { uid: user.uid, displayName: user.displayName }
      )
      setLinkValue('')
      setNoteValue('')
      toast.success('Link added', {
        description: 'Tag it with a project in My Updates.',
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add link:', error)
      toast.error('Could not add the link', {
        description: 'Please try again.',
      })
    } finally {
      setIsSavingLink(false)
    }
  }

  return (
    <ProgressHubShell
      active='home'
      title="This Week's Updates"
      subtitle={`${WEEK_LABEL} • ${WEEK_RANGE}`}
    >
      <input
        ref={fileInputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className='mb-6 text-sm text-[#64748B] sm:mb-8 dark:text-[#94A3B8]'>
        Add your updates for this week.
      </p>

      <div className='mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4'>
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

      <div className='grid gap-4 xl:grid-cols-3 xl:gap-5'>
        <section
          className={cn(
            'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
            'dark:border-slate-700 dark:bg-[#1E293B] sm:p-6'
          )}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              'flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed',
              'px-4 py-10 text-center transition-colors',
              isDragOver
                ? 'border-violet-400 bg-violet-100/70 dark:border-violet-400 dark:bg-violet-500/20'
                : 'border-violet-200 bg-violet-50/50 dark:border-violet-500/30 dark:bg-violet-500/10'
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
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>{' '}
              from your device.
            </p>
            <p className='mt-2 max-w-xs text-xs text-[#64748B] dark:text-[#94A3B8]'>
              Design files, screenshots, PDFs — up to 50 MB each.
            </p>
          </div>

          {uploading.length > 0 && (
            <div className='mt-3 space-y-2'>
              {uploading.map((u) => (
                <div
                  key={u.name}
                  className='flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-2.5 dark:bg-violet-500/10'
                >
                  <Loader2 className='size-4 shrink-0 animate-spin text-[#7C3AED] dark:text-violet-300' />
                  <span className='min-w-0 flex-1 truncate text-xs font-medium text-[#334155] dark:text-[#E2E8F0]'>
                    {u.name}
                  </span>
                  <span className='shrink-0 text-xs font-semibold text-[#7C3AED] dark:text-violet-300'>
                    {Math.round(u.percent)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
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
              onClick={handleAddLink}
              disabled={isSavingLink || !linkValue.trim()}
              className={cn(
                'h-10 rounded-xl px-5 text-sm font-semibold text-white shadow-none',
                'bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50'
              )}
            >
              {isSavingLink ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Link2 className='size-4' />
              )}
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
            {weekDays.map((item) => (
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
