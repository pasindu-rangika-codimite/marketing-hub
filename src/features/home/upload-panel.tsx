import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Folder,
  Presentation,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import { WEEK_LABEL } from './progress-hub-shell'

type UploadKind = 'image' | 'pdf' | 'pptx'

type UploadItem = {
  id: string
  name: string
  sizeLabel: string
  sizeMb: number
  kind: UploadKind
  /** Target progress when animation finishes (0–100). Completed starts full. */
  targetProgress: number
  startsCompleted?: boolean
}

const SAMPLE_FILES: UploadItem[] = [
  {
    id: '1',
    name: 'homepage-hero-design.png',
    sizeLabel: '6.2 MB',
    sizeMb: 6.2,
    kind: 'image',
    targetProgress: 100,
  },
  {
    id: '2',
    name: 'dashboard-ui-v2.jpg',
    sizeLabel: '3.8 MB',
    sizeMb: 3.8,
    kind: 'image',
    targetProgress: 100,
  },
  {
    id: '3',
    name: 'design-system-guide.pdf',
    sizeLabel: '2.1 MB',
    sizeMb: 2.1,
    kind: 'pdf',
    targetProgress: 100,
    startsCompleted: true,
  },
  {
    id: '4',
    name: 'weekly-update-slides.pptx',
    sizeLabel: '5.3 MB',
    sizeMb: 5.3,
    kind: 'pptx',
    targetProgress: 100,
    startsCompleted: true,
  },
]

const TOTAL_MB = 45.8

function CircularProgress({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const radius = 14
  const stroke = 3
  const normalized = Math.min(100, Math.max(0, value))
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalized / 100) * circumference

  return (
    <svg
      className={cn('size-9 -rotate-90', className)}
      viewBox='0 0 36 36'
      aria-hidden='true'
    >
      <circle
        cx='18'
        cy='18'
        r={radius}
        fill='none'
        className='stroke-slate-200 dark:stroke-slate-700'
        strokeWidth={stroke}
      />
      <circle
        cx='18'
        cy='18'
        r={radius}
        fill='none'
        className='stroke-[#7C3AED] transition-[stroke-dashoffset] duration-300 ease-out'
        strokeWidth={stroke}
        strokeLinecap='round'
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

function FileThumb({ kind }: { kind: UploadKind }) {
  if (kind === 'pdf') {
    return (
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/15'>
        <FileText className='size-5 text-red-500' />
      </div>
    )
  }

  if (kind === 'pptx') {
    return (
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/15'>
        <Presentation className='size-5 text-orange-500' />
      </div>
    )
  }

  return (
    <PlaceholderImage label='Img' rounded='lg' className='size-10 shrink-0' />
  )
}

type UploadPanelProps = {
  open: boolean
  onClose: () => void
}

export function UploadPanel({ open, onClose }: UploadPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [removedIds, setRemovedIds] = useState<string[]>([])

  // Reset + animate whenever panel opens
  useEffect(() => {
    if (!open) return

    setCollapsed(false)
    setRemovedIds([])

    // Start near the design snapshot, then animate upward
    setProgressMap({
      '1': 18,
      '2': 12,
      '3': 100,
      '4': 100,
    })

    const timer = window.setInterval(() => {
      setProgressMap((prev) => {
        const next = { ...prev }
        let changed = false

        for (const file of SAMPLE_FILES) {
          if (file.startsCompleted) {
            next[file.id] = 100
            continue
          }
          const current = next[file.id] ?? 0
          if (current >= 100) continue

          const step = file.id === '1' ? 1.6 : 1.25
          next[file.id] = Math.min(100, current + step)
          changed = true
        }

        return changed ? next : prev
      })
    }, 70)

    return () => {
      window.clearInterval(timer)
    }
  }, [open])

  const visibleFiles = useMemo(
    () => SAMPLE_FILES.filter((f) => !removedIds.includes(f.id)),
    [removedIds]
  )

  const uploadedMb = useMemo(() => {
    const weighted =
      ((progressMap['1'] ?? 0) / 100) * 18 +
      ((progressMap['2'] ?? 0) / 100) * 14 +
      ((progressMap['3'] ?? 0) / 100) * 6.5 +
      ((progressMap['4'] ?? 0) / 100) * 7.3
    return Math.min(TOTAL_MB, weighted)
  }, [progressMap])

  const overallPercent = Math.min(
    100,
    Math.round((uploadedMb / TOTAL_MB) * 100)
  )

  const allDone =
    visibleFiles.length > 0 &&
    visibleFiles.every((f) => (progressMap[f.id] ?? 0) >= 100)

  const activeCount = visibleFiles.filter(
    (f) => (progressMap[f.id] ?? 0) < 100
  ).length

  if (!open) return null

  return (
    <>
      <button
        type='button'
        className='fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px] sm:bg-slate-900/20'
        aria-label='Close upload panel'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-label='Uploading files'
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl',
          'inset-x-0 bottom-0 max-h-[85svh] rounded-t-2xl',
          'sm:inset-auto sm:right-4 sm:bottom-4 sm:top-4 sm:w-[min(400px,calc(100vw-2rem))]',
          'sm:max-h-[calc(100svh-2rem)] sm:rounded-2xl',
          'dark:bg-[#1E293B] dark:shadow-black/40',
          'animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-300'
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700'>
          <h2 className='text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            {allDone
              ? `${visibleFiles.length} items uploaded`
              : `Uploading ${activeCount || visibleFiles.length} items`}
          </h2>
          <div className='flex items-center gap-1'>
            <button
              type='button'
              className='rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              aria-label={collapsed ? 'Expand' : 'Collapse'}
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? (
                <ChevronUp className='size-4' />
              ) : (
                <ChevronDown className='size-4' />
              )}
            </button>
            <button
              type='button'
              className='rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              aria-label='Close'
              onClick={onClose}
            >
              <X className='size-4' />
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            {/* Overall progress */}
            <div className='px-5 py-4'>
              <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
                {uploadedMb.toFixed(1)} MB of {TOTAL_MB.toFixed(1)} MB uploaded
              </p>
              <div className='mt-2 flex items-center gap-3'>
                <div className='h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700'>
                  <div
                    className='h-full rounded-full bg-[#7C3AED] transition-[width] duration-300 ease-out'
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
                <span className='w-10 shrink-0 text-end text-sm font-semibold text-[#7C3AED]'>
                  {overallPercent}%
                </span>
              </div>
              <p className='mt-2 text-xs text-[#94A3B8] dark:text-[#64748B]'>
                {allDone ? 'Upload complete' : 'Less than a minute left'}
              </p>
            </div>

            {/* File list */}
            <ul className='min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3'>
              {visibleFiles.map((file) => {
                const progress = progressMap[file.id] ?? 0
                const completed = progress >= 100

                return (
                  <li
                    key={file.id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-2 py-2.5',
                      'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <FileThumb kind={file.kind} />

                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]'>
                        {file.name}
                      </p>
                      <p className='text-xs text-[#94A3B8]'>{file.sizeLabel}</p>
                    </div>

                    {completed ? (
                      <div className='flex shrink-0 items-center gap-1.5 text-emerald-600 dark:text-emerald-400'>
                        <span className='text-xs font-semibold'>Completed</span>
                        <span className='flex size-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20'>
                          <Check className='size-3.5 stroke-[3]' />
                        </span>
                      </div>
                    ) : (
                      <div className='flex shrink-0 items-center gap-2'>
                        <span className='w-8 text-end text-xs font-semibold text-[#7C3AED]'>
                          {Math.round(progress)}%
                        </span>
                        <div className='relative'>
                          <CircularProgress value={progress} />
                        </div>
                        <button
                          type='button'
                          className='rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800'
                          aria-label={`Cancel ${file.name}`}
                          onClick={() =>
                            setRemovedIds((ids) => [...ids, file.id])
                          }
                        >
                          <X className='size-3.5' />
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className='mt-auto border-t border-slate-100 px-5 py-3.5 dark:border-slate-700'>
              <div className='flex items-start gap-2.5'>
                <Folder className='mt-0.5 size-4 shrink-0 text-slate-400' />
                <div className='min-w-0 flex-1'>
                  <p className='text-xs text-[#64748B] dark:text-[#94A3B8]'>
                    All uploads are saved to
                  </p>
                  <button
                    type='button'
                    className='mt-0.5 truncate text-start text-xs font-semibold text-[#3B82F6] hover:underline dark:text-[#60A5FA]'
                  >
                    Design Progress Hub / {WEEK_LABEL} / Subodha N
                  </button>
                </div>
                <button
                  type='button'
                  className='rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  aria-label='Open folder'
                >
                  <ExternalLink className='size-3.5' />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
