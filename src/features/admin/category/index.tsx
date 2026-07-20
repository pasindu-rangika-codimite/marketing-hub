import { useMemo, useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import {
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Category } from '@/types'
import {
  createCategory,
  createDefaultCategories,
  deleteCategory,
  renameCategory,
} from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { useCategories } from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ICON_CLASSES = [
  'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
  'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
]

function formatCreatedAt(createdAt: unknown): string {
  if (createdAt instanceof Timestamp) {
    return format(createdAt.toDate(), 'MMM d, yyyy')
  }
  return '—'
}

export function AdminCategoryPage() {
  const { categories, isLoading } = useCategories()
  const currentUser = useAuthStore((state) => state.auth.user)

  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, search])

  const openCreate = () => {
    setEditing(null)
    setName('')
    setPanelOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setName(category.name)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditing(null)
    setName('')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || isSaving || !currentUser) return

    setIsSaving(true)
    try {
      if (editing) {
        await renameCategory(editing.id, trimmed)
        toast.success('Category renamed', { description: trimmed })
      } else {
        await createCategory(trimmed, currentUser.uid)
        toast.success('Category created', { description: trimmed })
      }
      closePanel()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save category:', error)
      toast.error('Could not save category', {
        description: 'Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSeedDefaults = async () => {
    if (isSeeding || !currentUser) return
    setIsSeeding(true)
    try {
      await createDefaultCategories(currentUser.uid)
      toast.success('Starter categories added')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add starter categories:', error)
      toast.error('Could not add starter categories')
    } finally {
      setIsSeeding(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      toast.message('Category deleted', { description: deleteTarget.name })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete category:', error)
      toast.error('Could not delete category')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Category
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Create and manage the categories members use to organize updates.
        </p>
      </div>

      <section
        className={cn(
          'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
          'dark:border-slate-700 dark:bg-[#1E293B]'
        )}
      >
        <div className='flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700'>
          <div className='relative w-full sm:max-w-sm'>
            <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search categories...'
              className='h-10 rounded-xl ps-9'
            />
          </div>
          <Button
            type='button'
            onClick={openCreate}
            className={cn(
              'h-10 shrink-0 rounded-xl px-4 text-sm font-semibold text-white shadow-none',
              'bg-[#7C3AED] hover:bg-[#6D28D9]'
            )}
          >
            <Plus className='size-4' />
            Add New Category
          </Button>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center px-6 py-16'>
            <Loader2 className='size-6 animate-spin text-slate-400' />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px] text-sm'>
              <thead>
                <tr className='border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium tracking-wide text-[#64748B] uppercase dark:border-slate-700 dark:bg-slate-800/50 dark:text-[#94A3B8]'>
                  <th className='px-4 py-3 font-medium sm:px-6'>Category</th>
                  <th className='px-4 py-3 font-medium sm:px-6'>
                    Created Date
                  </th>
                  <th className='px-4 py-3 font-medium sm:px-6'>Status</th>
                  <th className='px-4 py-3 text-end font-medium sm:px-6'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                {filtered.map((category, index) => (
                  <tr key={category.id}>
                    <td className='px-4 py-4 sm:px-6'>
                      <div className='flex items-center gap-3'>
                        <span
                          className={cn(
                            'flex size-9 shrink-0 items-center justify-center rounded-full',
                            ICON_CLASSES[index % ICON_CLASSES.length]
                          )}
                        >
                          <Tag className='size-4' />
                        </span>
                        <span className='font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-[#64748B] sm:px-6 dark:text-[#94A3B8]'>
                      {formatCreatedAt(category.createdAt)}
                    </td>
                    <td className='px-4 py-4 sm:px-6'>
                      <span className='inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'>
                        Active
                      </span>
                    </td>
                    <td className='px-4 py-4 text-end sm:px-6'>
                      <div className='inline-flex items-center gap-3'>
                        <button
                          type='button'
                          onClick={() => openEdit(category)}
                          className='inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:underline dark:text-sky-400'
                        >
                          <Pencil className='size-3.5' />
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => setDeleteTarget(category)}
                          className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline dark:text-red-400'
                        >
                          <Trash2 className='size-3.5' />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className='flex flex-col items-center px-6 py-12 text-center'>
            <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
              {categories.length === 0
                ? 'No categories yet.'
                : 'No categories match your search.'}
            </p>
            {categories.length === 0 && (
              <Button
                type='button'
                variant='outline'
                disabled={isSeeding}
                onClick={handleSeedDefaults}
                className='mt-4 h-10 rounded-xl px-4 text-sm font-semibold'
              >
                {isSeeding ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <Sparkles className='size-4' />
                )}
                Add starter categories
              </Button>
            )}
          </div>
        )}

        <div
          className={cn(
            'm-4 flex items-start gap-2.5 rounded-xl px-4 py-3 sm:m-6',
            'bg-[#F3E8FF] dark:bg-violet-500/10'
          )}
        >
          <ShieldCheck
            className='mt-0.5 size-4 shrink-0 text-[#7C3AED] dark:text-violet-300'
            aria-hidden='true'
          />
          <p className='text-sm text-[#5B21B6] dark:text-violet-200'>
            Categories help organize team updates and keep projects structured.
            You can manage categories anytime to fit your team&apos;s workflow.
          </p>
        </div>
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete "${deleteTarget?.name ?? ''}"?`}
        desc='Members will no longer be able to tag updates with this category.'
        destructive
        confirmText='Delete'
        handleConfirm={handleDelete}
      />

      {panelOpen && (
        <>
          <button
            type='button'
            className='fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px]'
            aria-label='Close panel'
            onClick={closePanel}
          />
          <div
            role='dialog'
            aria-modal='true'
            aria-label={editing ? 'Edit Category' : 'Add New Category'}
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl',
              'inset-x-3 bottom-3 max-h-[min(420px,calc(100svh-5.5rem))] rounded-2xl',
              'top-auto',
              'sm:inset-auto sm:top-20 sm:right-5 sm:bottom-auto sm:left-auto',
              'sm:w-[min(420px,calc(100vw-2.5rem))]',
              'dark:bg-[#1E293B] dark:shadow-black/40',
              'animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-300'
            )}
          >
            <div className='flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-700'>
              <div>
                <h2 className='text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                  {editing ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
                  {editing
                    ? 'Rename this category.'
                    : 'Create a new category to organize updates and content.'}
                </p>
              </div>
              <button
                type='button'
                onClick={closePanel}
                className='rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                aria-label='Close'
              >
                <X className='size-4' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='flex min-h-0 flex-1 flex-col'
            >
              <div className='flex-1 px-5 py-5'>
                <Label
                  htmlFor='category-name'
                  className='mb-2 block text-sm font-semibold text-[#374151] dark:text-[#E2E8F0]'
                >
                  Category Name
                </Label>
                <Input
                  id='category-name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter category name'
                  className='h-11 rounded-xl'
                  required
                />
              </div>

              <div className='flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-700'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={closePanel}
                  className='h-11 rounded-xl px-5'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSaving || !name.trim()}
                  className='h-11 rounded-xl bg-[#7C3AED] px-5 font-semibold text-white hover:bg-[#6D28D9]'
                >
                  {isSaving
                    ? 'Saving...'
                    : editing
                      ? 'Save Changes'
                      : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminShell>
  )
}
