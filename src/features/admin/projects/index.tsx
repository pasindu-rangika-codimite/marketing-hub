import { useState, type FormEvent } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types'
import {
  createProject,
  deleteProject,
  renameProject,
} from '@/lib/firebase'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { useProjects } from '@/hooks/use-live-data'
import { useAuthStore } from '@/stores/auth-store'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminProjectsPage() {
  const { projects, isLoading } = useProjects()
  const currentUser = useAuthStore((state) => state.auth.user)

  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const openCreate = () => {
    setEditing(null)
    setName('')
    setPanelOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setName(project.name)
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
        await renameProject(editing.id, trimmed)
        toast.success('Project renamed', { description: trimmed })
      } else {
        await createProject(trimmed, currentUser.uid, projects.length)
        toast.success('Project created', { description: trimmed })
      }
      closePanel()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save project:', error)
      toast.error('Could not save project', {
        description: 'Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProject(deleteTarget.id)
      toast.message('Project deleted', { description: deleteTarget.name })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete project:', error)
      toast.error('Could not delete project')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <AdminShell>
      <div className='mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]'>
            Projects
          </h1>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            Create and manage the projects members can tag their updates with.
          </p>
        </div>

        <Button
          type='button'
          onClick={openCreate}
          className={cn(
            'h-11 shrink-0 rounded-xl px-5 text-sm font-semibold text-white shadow-none',
            'bg-[#7C3AED] hover:bg-[#6D28D9]'
          )}
        >
          <Plus className='size-4' />
          Add New Project
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-6 animate-spin text-slate-400' />
        </div>
      ) : projects.length === 0 ? (
        <div
          className={cn(
            'flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center',
            'dark:border-slate-700 dark:bg-[#1E293B]'
          )}
        >
          <p className='text-sm font-medium text-[#334155] dark:text-[#E2E8F0]'>
            No projects yet.
          </p>
          <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
            Add your first project so the team can start tagging their updates.
          </p>
          <Button
            type='button'
            onClick={openCreate}
            className='mt-5 h-10 rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white hover:bg-[#6D28D9]'
          >
            <Plus className='size-4' />
            Add New Project
          </Button>
        </div>
      ) : (
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
                <span
                  className={cn(
                    'flex size-16 items-center justify-center rounded-2xl text-lg font-bold text-white sm:size-[72px]',
                    project.color || 'bg-violet-500'
                  )}
                >
                  {getDisplayNameInitials(project.name)}
                </span>
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
                  onClick={() => openEdit(project)}
                  className='inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:underline dark:text-sky-400'
                >
                  <Pencil className='size-3.5' />
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => setDeleteTarget(project)}
                  className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline dark:text-red-400'
                >
                  <Trash2 className='size-3.5' />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete "${deleteTarget?.name ?? ''}"?`}
        desc='Members will no longer be able to tag updates with this project.'
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
            aria-label={editing ? 'Edit Project' : 'Add New Project'}
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
                  {editing ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p className='mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]'>
                  {editing
                    ? 'Rename this project.'
                    : 'Create a new project to organize team updates.'}
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

            <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
              <div className='flex-1 px-5 py-5'>
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
                      : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminShell>
  )
}
