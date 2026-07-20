import { useState } from 'react'
import {
  FolderKanban,
  Info,
  Link2,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Tag,
  Trash2,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProgressHubShell } from '@/features/home/progress-hub-shell'

type TabKey = 'uploaded' | 'links'

type UploadedFile = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  project: string
  category: string
}

const PROJECTS = [
  { value: 'caprome', label: 'Caprome', color: 'bg-violet-500' },
  { value: 'commandlyne', label: 'CommandLyne', color: 'bg-sky-500' },
  { value: 'design-hub', label: 'Design Hub', color: 'bg-emerald-500' },
] as const

const CATEGORIES = [
  { value: 'ui-design', label: 'UI Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'research', label: 'Research' },
  { value: 'prototyping', label: 'Prototyping' },
] as const

const INITIAL_FILES: UploadedFile[] = [
  {
    id: '1',
    name: 'homepage-hero-design.png',
    type: 'PNG',
    size: '2.4 MB',
    uploadedAt: '10:24 AM',
    project: 'caprome',
    category: 'ui-design',
  },
  {
    id: '2',
    name: 'dashboard-ui-v2.jpg',
    type: 'JPG',
    size: '1.9 MB',
    uploadedAt: '10:38 AM',
    project: 'commandlyne',
    category: 'ui-design',
  },
  {
    id: '3',
    name: 'design-system-guide.pdf',
    type: 'PDF',
    size: '2.1 MB',
    uploadedAt: '10:52 AM',
    project: 'caprome',
    category: 'branding',
  },
  {
    id: '4',
    name: 'weekly-update-slides.pptx',
    type: 'PPTX',
    size: '3.6 MB',
    uploadedAt: '11:05 AM',
    project: 'commandlyne',
    category: 'branding',
  },
]

function ProjectDot({ value }: { value: string }) {
  const project = PROJECTS.find((p) => p.value === value)
  return (
    <span
      className={cn(
        'size-2 shrink-0 rounded-full',
        project?.color ?? 'bg-slate-400'
      )}
    />
  )
}

export function MyUpdatesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('uploaded')
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES)
  const [isSaving, setIsSaving] = useState(false)

  const updateFile = (id: string, patch: Partial<UploadedFile>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...patch } : file))
    )
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSaving(false)
    toast.success('Updates saved', {
      description: `${files.length} file${files.length === 1 ? '' : 's'} saved for today.`,
    })
  }

  return (
    <ProgressHubShell
      active='my-updates'
      title="Today's Updates"
      subtitle='Add and organize your work for today.'
    >
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
          'dark:border-slate-700 dark:bg-[#1E293B]'
        )}
      >
        {/* Tabs */}
        <div className='flex gap-6 border-b border-slate-200 px-4 sm:px-6 dark:border-slate-700'>
          <button
            type='button'
            onClick={() => setActiveTab('uploaded')}
            className={cn(
              'relative flex items-center gap-2 py-4 text-sm font-semibold transition-colors',
              activeTab === 'uploaded'
                ? 'text-[#7C3AED] dark:text-violet-300'
                : 'text-[#64748B] hover:text-[#334155] dark:text-[#94A3B8] dark:hover:text-[#E2E8F0]'
            )}
          >
            <Upload className='size-4' />
            Uploaded ({files.length})
            {activeTab === 'uploaded' && (
              <span className='absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#7C3AED] dark:bg-violet-400' />
            )}
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('links')}
            className={cn(
              'relative flex items-center gap-2 py-4 text-sm font-semibold transition-colors',
              activeTab === 'links'
                ? 'text-[#7C3AED] dark:text-violet-300'
                : 'text-[#64748B] hover:text-[#334155] dark:text-[#94A3B8] dark:hover:text-[#E2E8F0]'
            )}
          >
            <Link2 className='size-4' />
            Links (0)
            {activeTab === 'links' && (
              <span className='absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#7C3AED] dark:bg-violet-400' />
            )}
          </button>
        </div>

        {activeTab === 'uploaded' ? (
          <>
            {/* Info banner */}
            <div
              className={cn(
                'mx-4 mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 sm:mx-6',
                'bg-[#EFF6FF] dark:bg-sky-500/10'
              )}
            >
              <Info
                className='mt-0.5 size-4 shrink-0 text-[#3B82F6] dark:text-sky-400'
                aria-hidden='true'
              />
              <p className='text-sm text-[#1E40AF] dark:text-sky-200'>
                Add project and category for each uploaded item before saving
                your update.
              </p>
            </div>

            {/* Action bar */}
            <div className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
              <p className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                {files.length} file{files.length === 1 ? '' : 's'} uploaded
              </p>
              <Button
                type='button'
                variant='outline'
                className={cn(
                  'h-10 rounded-xl border-[#7C3AED] bg-white text-sm font-semibold text-[#7C3AED]',
                  'hover:bg-violet-50 dark:border-violet-400 dark:bg-transparent dark:text-violet-300',
                  'dark:hover:bg-violet-500/10'
                )}
              >
                <Plus className='size-4' />
                Add More Files
              </Button>
            </div>

            {/* File list */}
            <ul className='divide-y divide-slate-100 dark:divide-slate-700'>
              {files.map((file) => (
                <li
                  key={file.id}
                  className='px-4 py-5 sm:px-6'
                >
                  <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-5'>
                    {/* Thumbnail + meta */}
                    <div className='flex min-w-0 flex-1 gap-3 sm:gap-4'>
                      <PlaceholderImage
                        label='Img'
                        rounded='lg'
                        className='size-16 shrink-0 sm:size-[72px]'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                          {file.name}
                        </p>
                        <p className='mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                          {file.type} • {file.size}
                        </p>
                        <p className='mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]'>
                          Uploaded at {file.uploadedAt}
                        </p>
                      </div>
                    </div>

                    {/* Project + category + delete */}
                    <div className='grid gap-3 sm:grid-cols-2 xl:flex xl:shrink-0 xl:items-start xl:gap-3'>
                      <div className='min-w-0 xl:w-[180px]'>
                        <label className='mb-1.5 block text-xs font-medium text-[#64748B] dark:text-[#94A3B8]'>
                          Project
                        </label>
                        <Select
                          value={file.project}
                          onValueChange={(value) =>
                            updateFile(file.id, { project: value })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              'h-10 w-full rounded-xl border-slate-200 bg-white',
                              'dark:border-slate-600 dark:bg-[#0F172A]'
                            )}
                          >
                            <SelectValue>
                              <span className='flex items-center gap-2'>
                                <ProjectDot value={file.project} />
                                {
                                  PROJECTS.find((p) => p.value === file.project)
                                    ?.label
                                }
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECTS.map((project) => (
                              <SelectItem
                                key={project.value}
                                value={project.value}
                              >
                                <span className='flex items-center gap-2'>
                                  <span
                                    className={cn(
                                      'size-2 rounded-full',
                                      project.color
                                    )}
                                  />
                                  {project.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='min-w-0 xl:w-[180px]'>
                        <label className='mb-1.5 block text-xs font-medium text-[#64748B] dark:text-[#94A3B8]'>
                          Category
                        </label>
                        <Select
                          value={file.category}
                          onValueChange={(value) =>
                            updateFile(file.id, { category: value })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              'h-10 w-full rounded-xl border-slate-200 bg-white',
                              'dark:border-slate-600 dark:bg-[#0F172A]'
                            )}
                          >
                            <SelectValue>
                              <span className='flex items-center gap-2'>
                                <Tag className='size-3.5 text-[#7C3AED]' />
                                {
                                  CATEGORIES.find(
                                    (c) => c.value === file.category
                                  )?.label
                                }
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='flex items-end justify-end sm:col-span-2 xl:pb-0.5'>
                        <button
                          type='button'
                          className={cn(
                            'rounded-lg p-2 text-red-500 transition-colors',
                            'hover:bg-red-50 dark:hover:bg-red-500/10'
                          )}
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className='size-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {files.length === 0 && (
              <div className='flex flex-col items-center justify-center px-6 py-16 text-center'>
                <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20'>
                  <FolderKanban className='size-7 text-[#7C3AED] dark:text-violet-300' />
                </div>
                <p className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                  No files uploaded yet.
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              className={cn(
                'flex flex-col gap-4 border-t border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6',
                'dark:border-slate-700'
              )}
            >
              <div className='flex items-start gap-2'>
                <ShieldCheck
                  className='mt-0.5 size-4 shrink-0 text-[#94A3B8]'
                  aria-hidden='true'
                />
                <p className='text-xs leading-relaxed text-[#64748B] sm:text-sm dark:text-[#94A3B8]'>
                  You can review and edit your updates anytime before the week
                  closes.
                </p>
              </div>

              <Button
                type='button'
                disabled={files.length === 0 || isSaving}
                onClick={handleSave}
                className={cn(
                  'h-11 shrink-0 rounded-xl px-6 text-sm font-semibold text-white shadow-none',
                  'bg-[#7C3AED] hover:bg-[#6D28D9]',
                  'disabled:opacity-50'
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className='size-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='size-4' />
                    Save My Updates ({files.length})
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
            <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20'>
              <Link2 className='size-7 text-[#7C3AED] dark:text-violet-300' />
            </div>
            <h2 className='text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
              No links yet
            </h2>
            <p className='mt-2 max-w-sm text-sm text-[#64748B] dark:text-[#94A3B8]'>
              Links you add from the Home page will appear here for organization.
            </p>
          </div>
        )}
      </div>
    </ProgressHubShell>
  )
}
