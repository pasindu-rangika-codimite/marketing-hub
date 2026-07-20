import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { ADMIN_PROJECTS, slugifyProjectName } from '@/features/admin/data/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ProjectItem = {
  id: string
  name: string
  status: 'active'
}

const INITIAL: ProjectItem[] = ADMIN_PROJECTS.map((p) => ({
  id: p.id,
  name: p.name,
  status: 'active' as const,
}))

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL)
  const [panelOpen, setPanelOpen] = useState(false)
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const closePanel = () => {
    setPanelOpen(false)
    setName('')
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || isCreating) return

    setIsCreating(true)
    await new Promise((r) => setTimeout(r, 600))

    const id = `${slugifyProjectName(name.trim())}-${Date.now()}`
    setProjects((prev) => [
      { id, name: name.trim(), status: 'active' },
      ...prev,
    ])
    toast.success('Project created', { description: name.trim() })
    setIsCreating(false)
    closePanel()
  }

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast.message('Project removed')
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
            Projects
          </h1>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            Create and manage projects for weekly team updates.
          </p>
        </div>

        <Button
          type='button'
          onClick={() => setPanelOpen(true)}
          className={cn(
            'h-11 shrink-0 rounded-xl px-5 text-sm font-semibold text-white shadow-none',
            'bg-[#7C3AED] hover:bg-[#6D28D9]'
          )}
        >
          <Plus className='size-4' />
          Add New Project
        </Button>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {projects.map((project) => (
          <article
            key={project.id}
            className={cn(
              'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
              'dark:border-slate-700 dark:bg-[#1E293B]'
            )}
          >
            <div className='flex flex-1 flex-col items-center text-center'>
              <PlaceholderImage
                label='Logo'
                rounded='xl'
                className='size-16 sm:size-[72px]'
              />
              <h2 className='mt-4 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
                {project.name}
              </h2>
              <p className='mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                • Active
              </p>
            </div>

            <div className='mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700'>
              <button
                type='button'
                className='inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:underline dark:text-sky-400'
              >
                <Pencil className='size-3.5' />
                Edit
              </button>
              <button
                type='button'
                onClick={() => handleDelete(project.id)}
                className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline dark:text-red-400'
              >
                <Trash2 className='size-3.5' />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

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
            aria-label='Add New Project'
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl',
              'inset-x-3 bottom-3 max-h-[min(640px,calc(100svh-5.5rem))] rounded-2xl',
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
                  Add New Project
                </h2>
                <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
                  Create a new project to organize weekly updates and
                  activities.
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
              <div className='flex-1 space-y-5 overflow-y-auto px-5 py-5'>
                <div>
                  <Label className='mb-2 block text-sm font-semibold text-[#374151] dark:text-[#E2E8F0]'>
                    Project Logo
                  </Label>
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center',
                      'border-sky-200 bg-sky-50/50 dark:border-sky-500/30 dark:bg-sky-500/10'
                    )}
                  >
                    <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-500/20'>
                      <UploadCloud className='size-6 text-sky-600 dark:text-sky-300' />
                    </div>
                    <p className='text-sm font-semibold text-[#334155] dark:text-[#E2E8F0]'>
                      Upload logo
                    </p>
                    <p className='mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]'>
                      PNG, JPG or SVG (max 2MB).
                    </p>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='project-name'
                    className='mb-2 block text-sm font-semibold text-[#374151] dark:text-[#E2E8F0]'
                  >
                    Project Name
                  </Label>
                  <Input
                    id='project-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter project name'
                    className='h-11 rounded-xl'
                    required
                  />
                </div>
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
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminShell>
  )
}
