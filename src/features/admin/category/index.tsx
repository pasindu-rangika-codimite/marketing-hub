import { useMemo, useState, type FormEvent } from 'react'
import {
  Bell,
  Ellipsis,
  FileText,
  Monitor,
  Pencil,
  Plus,
  Presentation,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CategoryItem = {
  id: string
  name: string
  icon: typeof Monitor
  iconClass: string
  description: string
  createdDate: string
  status: string
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    name: 'UI Design',
    icon: Monitor,
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '2',
    name: 'Flyer',
    icon: FileText,
    iconClass: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '3',
    name: 'Branding',
    icon: Tag,
    iconClass: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '4',
    name: 'Social Media',
    icon: Share2,
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '5',
    name: 'Presentation',
    icon: Presentation,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '6',
    name: 'Research',
    icon: Search,
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    description: '',
    createdDate: '',
    status: '',
  },
  {
    id: '7',
    name: 'Other',
    icon: Ellipsis,
    iconClass: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    description: '',
    createdDate: '',
    status: '',
  },
]

function CategorySidebarFooter() {
  return (
    <div className='mt-auto p-4'>
      <div
        className={cn(
          'rounded-2xl border border-violet-100 bg-violet-50 p-4',
          'dark:border-violet-500/20 dark:bg-violet-500/10'
        )}
      >
        <div className='mb-2 flex items-center gap-2'>
          <Bell className='size-4 text-[#7C3AED] dark:text-violet-300' />
          <p className='text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            Stay on top!
          </p>
        </div>
        <p className='text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]'>
          Send reminders to members who haven&apos;t added updates yet.
        </p>
        <Button
          type='button'
          variant='outline'
          className={cn(
            'mt-3 h-9 w-full rounded-xl border-[#7C3AED] text-xs font-semibold text-[#7C3AED]',
            'hover:bg-violet-100 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-500/20'
          )}
          onClick={() =>
            toast.success('Reminder sent', {
              description: 'Members without updates will be notified.',
            })
          }
        >
          Send Reminder
        </Button>
      </div>
    </div>
  )
}

export function AdminCategoryPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, search])

  const closePanel = () => {
    setPanelOpen(false)
    setName('')
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || isCreating) return

    setIsCreating(true)
    await new Promise((r) => setTimeout(r, 600))

    setCategories((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: name.trim(),
        icon: Tag,
        iconClass:
          'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
        description: '',
        createdDate: '',
        status: '',
      },
    ])
    toast.success('Category created', { description: name.trim() })
    setIsCreating(false)
    closePanel()
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.message('Category removed')
  }

  return (
    <AdminShell sidebarFooter={<CategorySidebarFooter />}>
      <div className='mb-6 flex flex-col gap-1 sm:mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
          Category
        </h1>
        <p className='text-sm text-[#64748B] dark:text-[#94A3B8]'>
          Create and manage categories for weekly team updates.
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
            onClick={() => setPanelOpen(true)}
            className={cn(
              'h-10 shrink-0 rounded-xl px-4 text-sm font-semibold text-white shadow-none',
              'bg-[#7C3AED] hover:bg-[#6D28D9]'
            )}
          >
            <Plus className='size-4' />
            Add New Category
          </Button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[640px] text-sm'>
            <thead>
              <tr className='border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium tracking-wide text-[#64748B] uppercase dark:border-slate-700 dark:bg-slate-800/50 dark:text-[#94A3B8]'>
                <th className='px-4 py-3 font-medium sm:px-6'>Category</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Description</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Created Date</th>
                <th className='px-4 py-3 font-medium sm:px-6'>Status</th>
                <th className='px-4 py-3 text-end font-medium sm:px-6'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td className='px-4 py-4 sm:px-6'>
                    <div className='flex items-center gap-3'>
                      <span
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-full',
                          category.iconClass
                        )}
                      >
                        <category.icon className='size-4' />
                      </span>
                      <span className='font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-[#94A3B8] sm:px-6'>
                    {category.description || '—'}
                  </td>
                  <td className='px-4 py-4 text-[#94A3B8] sm:px-6'>
                    {category.createdDate || '—'}
                  </td>
                  <td className='px-4 py-4 text-[#94A3B8] sm:px-6'>
                    {category.status || '—'}
                  </td>
                  <td className='px-4 py-4 text-end sm:px-6'>
                    <div className='inline-flex items-center gap-3'>
                      <button
                        type='button'
                        className='inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:underline dark:text-sky-400'
                      >
                        <Pencil className='size-3.5' />
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(category.id)}
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

        {filtered.length === 0 && (
          <p className='px-6 py-12 text-center text-sm text-[#64748B] dark:text-[#94A3B8]'>
            No categories match your search.
          </p>
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
            aria-label='Add New Category'
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl',
              'inset-x-3 bottom-3 max-h-[min(520px,calc(100svh-5.5rem))] rounded-2xl',
              'top-[4.5rem]',
              'sm:inset-auto sm:top-20 sm:right-5 sm:bottom-5 sm:left-auto',
              'sm:w-[min(420px,calc(100vw-2.5rem))] sm:max-h-[calc(100svh-6.5rem)]',
              'dark:bg-[#1E293B] dark:shadow-black/40',
              'animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-300'
            )}
          >
            <div className='flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-700'>
              <div>
                <h2 className='text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                  Add New Category
                </h2>
                <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
                  Create a new category to organize weekly updates and content.
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
              onSubmit={handleCreate}
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
                  disabled={isCreating || !name.trim()}
                  className='h-11 rounded-xl bg-[#7C3AED] px-5 font-semibold text-white hover:bg-[#6D28D9]'
                >
                  {isCreating ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminShell>
  )
}
