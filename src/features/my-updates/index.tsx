import { useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import {
  FileText,
  FolderKanban,
  Link2,
  Loader2,
  Plus,
  Tag,
  Trash2,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Asset, DailyUpdate } from '@/types'
import {
  deleteAsset,
  deleteUpdate,
  formatFileSize,
  updateAssetTags,
  updateUpdateTags,
  uploadAsset,
} from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { useCategories, useMyAssets, useMyUpdates, useProjects } from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
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

type UploadProgress = {
  name: string
  percent: number
}

function formatWhen(createdAt: unknown): string {
  if (createdAt instanceof Timestamp) {
    return format(createdAt.toDate(), 'MMM d, h:mm a')
  }
  return 'Just now'
}

const PROJECT_DOT_FALLBACK = 'bg-slate-400'

export function MyUpdatesPage() {
  const user = useAuthStore((state) => state.auth.user)
  const { assets, isLoading: assetsLoading } = useMyAssets(user?.uid)
  const { updates, isLoading: updatesLoading } = useMyUpdates(user?.uid)
  const { projects } = useProjects()
  const { categories } = useCategories()

  const [activeTab, setActiveTab] = useState<TabKey>('uploaded')
  const [uploading, setUploading] = useState<UploadProgress[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Items whose serverTimestamp hasn't resolved yet sort to the top.
  const createdMillis = (createdAt: unknown) =>
    createdAt instanceof Timestamp
      ? createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER

  const sortedAssets = useMemo(
    () =>
      [...assets].sort(
        (a, b) => createdMillis(b.createdAt) - createdMillis(a.createdAt)
      ),
    [assets]
  )

  const linkUpdates = useMemo(
    () =>
      [...updates]
        .filter((u) => u.linkUrl)
        .sort(
          (a, b) => createdMillis(b.createdAt) - createdMillis(a.createdAt)
        ),
    [updates]
  )

  const projectDot = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.color ?? PROJECT_DOT_FALLBACK

  const handlePickFiles = () => fileInputRef.current?.click()

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !user) return
    const files = Array.from(fileList)
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
        toast.success('File uploaded', { description: file.name })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Upload failed:', error)
        toast.error('Upload failed', {
          description:
            error instanceof Error ? error.message : `Could not upload ${file.name}.`,
        })
      } finally {
        setUploading((prev) => prev.filter((u) => u.name !== file.name))
      }
    }
  }

  const handleDeleteAsset = async (asset: Asset) => {
    try {
      await deleteAsset(asset)
      toast.message('File removed', { description: asset.fileName })
    } catch {
      toast.error('Could not remove file')
    }
  }

  const handleDeleteLink = async (update: DailyUpdate) => {
    try {
      await deleteUpdate(update.id)
      toast.message('Link removed')
    } catch {
      toast.error('Could not remove link')
    }
  }

  const retagAsset = async (
    asset: Asset,
    patch: Partial<{ projectId: string; categoryId: string }>
  ) => {
    try {
      await updateAssetTags(asset.id, patch)
    } catch {
      toast.error('Could not save the tag')
    }
  }

  const retagUpdate = async (
    update: DailyUpdate,
    patch: Partial<{ projectId: string; categoryId: string }>
  ) => {
    try {
      await updateUpdateTags(update.id, patch)
    } catch {
      toast.error('Could not save the tag')
    }
  }

  const isLoading = assetsLoading || updatesLoading

  return (
    <ProgressHubShell
      active='my-updates'
      title="Today's Updates"
      subtitle='Add and organize your work.'
    >
      <input
        ref={fileInputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

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
            Uploaded ({sortedAssets.length})
            {activeTab === 'uploaded' && (
              <span className='absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#7C3AED] dark:bg-violet-400' />
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
            Links ({linkUpdates.length})
            {activeTab === 'links' && (
              <span className='absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#7C3AED] dark:bg-violet-400' />
            )}
          </button>
        </div>

        {activeTab === 'uploaded' && (
          <div>
            {/* Action bar */}
            <div className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
              <p className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                {sortedAssets.length} file
                {sortedAssets.length === 1 ? '' : 's'} uploaded
              </p>
              <Button
                type='button'
                variant='outline'
                onClick={handlePickFiles}
                className={cn(
                  'h-10 rounded-xl border-[#7C3AED] bg-white text-sm font-semibold text-[#7C3AED]',
                  'hover:bg-violet-50 dark:border-violet-400 dark:bg-transparent dark:text-violet-300',
                  'dark:hover:bg-violet-500/10'
                )}
              >
                <Plus className='size-4' />
                Add Files
              </Button>
            </div>

            {/* In-flight uploads */}
            {uploading.length > 0 && (
              <div className='space-y-2 px-4 pb-3 sm:px-6'>
                {uploading.map((u) => (
                  <div
                    key={u.name}
                    className='flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3 dark:bg-violet-500/10'
                  >
                    <Loader2 className='size-4 shrink-0 animate-spin text-[#7C3AED] dark:text-violet-300' />
                    <span className='min-w-0 flex-1 truncate text-sm font-medium text-[#334155] dark:text-[#E2E8F0]'>
                      {u.name}
                    </span>
                    <span className='shrink-0 text-xs font-semibold text-[#7C3AED] dark:text-violet-300'>
                      {Math.round(u.percent)}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* File list */}
            {isLoading ? (
              <div className='flex items-center justify-center px-6 py-16'>
                <Loader2 className='size-6 animate-spin text-slate-400' />
              </div>
            ) : (
              <ul className='divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-700'>
                {sortedAssets.map((asset) => (
                  <li
                    key={asset.id}
                    className='flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'
                  >
                    <div className='flex min-w-0 items-center gap-3'>
                      <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20'>
                        <FileText className='size-5 text-[#7C3AED] dark:text-violet-300' />
                      </span>
                      <div className='min-w-0'>
                        <a
                          href={asset.downloadURL}
                          target='_blank'
                          rel='noreferrer'
                          className='block truncate text-sm font-semibold text-[#0F172A] hover:underline dark:text-[#F8FAFC]'
                        >
                          {asset.fileName}
                        </a>
                        <p className='text-xs text-[#64748B] dark:text-[#94A3B8]'>
                          {asset.fileType} • {formatFileSize(asset.fileSizeBytes)} •{' '}
                          {formatWhen(asset.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                      <Select
                        value={asset.projectId || undefined}
                        onValueChange={(value) =>
                          retagAsset(asset, { projectId: value })
                        }
                      >
                        <SelectTrigger className='h-9 w-[160px] rounded-lg text-xs'>
                          <span className='flex items-center gap-1.5 truncate'>
                            <FolderKanban className='size-3.5 shrink-0 text-slate-400' />
                            <SelectValue placeholder='Project' />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <span className='flex items-center gap-2'>
                                <span
                                  className={cn(
                                    'size-2 rounded-full',
                                    projectDot(p.id)
                                  )}
                                />
                                {p.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={asset.categoryId || undefined}
                        onValueChange={(value) =>
                          retagAsset(asset, { categoryId: value })
                        }
                      >
                        <SelectTrigger className='h-9 w-[150px] rounded-lg text-xs'>
                          <span className='flex items-center gap-1.5 truncate'>
                            <Tag className='size-3.5 shrink-0 text-slate-400' />
                            <SelectValue placeholder='Category' />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <button
                        type='button'
                        aria-label={`Remove ${asset.fileName}`}
                        onClick={() => handleDeleteAsset(asset)}
                        className={cn(
                          'rounded-lg p-2 text-red-500 transition-colors',
                          'hover:bg-red-50 dark:hover:bg-red-500/10'
                        )}
                      >
                        <Trash2 className='size-4' />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && sortedAssets.length === 0 && uploading.length === 0 && (
              <div className='flex flex-col items-center border-t border-slate-100 px-6 py-14 text-center dark:border-slate-700'>
                <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20'>
                  <FolderKanban className='size-7 text-[#7C3AED] dark:text-violet-300' />
                </div>
                <p className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                  No files uploaded yet.
                </p>
                <Button
                  type='button'
                  onClick={handlePickFiles}
                  className='mt-4 h-10 rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white hover:bg-[#6D28D9]'
                >
                  <Upload className='size-4' />
                  Upload your first file
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div>
            {isLoading ? (
              <div className='flex items-center justify-center px-6 py-16'>
                <Loader2 className='size-6 animate-spin text-slate-400' />
              </div>
            ) : linkUpdates.length === 0 ? (
              <div className='flex flex-col items-center px-6 py-14 text-center'>
                <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/20'>
                  <Link2 className='size-7 text-[#7C3AED] dark:text-violet-300' />
                </div>
                <p className='text-sm font-medium text-[#64748B] dark:text-[#94A3B8]'>
                  No links added yet.
                </p>
                <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
                  Add links with notes from the Home page.
                </p>
              </div>
            ) : (
              <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
                {linkUpdates.map((update) => (
                  <li
                    key={update.id}
                    className='flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'
                  >
                    <div className='flex min-w-0 items-center gap-3'>
                      <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-500/20'>
                        <Link2 className='size-5 text-sky-600 dark:text-sky-300' />
                      </span>
                      <div className='min-w-0'>
                        <a
                          href={update.linkUrl}
                          target='_blank'
                          rel='noreferrer'
                          className='block truncate text-sm font-semibold text-[#0F172A] hover:underline dark:text-[#F8FAFC]'
                        >
                          {update.title || update.linkUrl}
                        </a>
                        <p className='truncate text-xs text-[#64748B] dark:text-[#94A3B8]'>
                          {update.description || update.linkUrl} •{' '}
                          {formatWhen(update.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                      <Select
                        value={update.projectId || undefined}
                        onValueChange={(value) =>
                          retagUpdate(update, { projectId: value })
                        }
                      >
                        <SelectTrigger className='h-9 w-[160px] rounded-lg text-xs'>
                          <span className='flex items-center gap-1.5 truncate'>
                            <FolderKanban className='size-3.5 shrink-0 text-slate-400' />
                            <SelectValue placeholder='Project' />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <span className='flex items-center gap-2'>
                                <span
                                  className={cn(
                                    'size-2 rounded-full',
                                    projectDot(p.id)
                                  )}
                                />
                                {p.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={update.categoryId || undefined}
                        onValueChange={(value) =>
                          retagUpdate(update, { categoryId: value })
                        }
                      >
                        <SelectTrigger className='h-9 w-[150px] rounded-lg text-xs'>
                          <span className='flex items-center gap-1.5 truncate'>
                            <Tag className='size-3.5 shrink-0 text-slate-400' />
                            <SelectValue placeholder='Category' />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <button
                        type='button'
                        aria-label='Remove link'
                        onClick={() => handleDeleteLink(update)}
                        className={cn(
                          'rounded-lg p-2 text-red-500 transition-colors',
                          'hover:bg-red-50 dark:hover:bg-red-500/10'
                        )}
                      >
                        <Trash2 className='size-4' />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <p className='mt-4 text-xs text-[#64748B] dark:text-[#94A3B8]'>
        Changes save automatically. Tag each item with a project and category
        so it shows up correctly in the team overview.
      </p>
    </ProgressHubShell>
  )
}
