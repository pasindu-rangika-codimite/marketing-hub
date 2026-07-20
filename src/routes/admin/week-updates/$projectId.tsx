import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useProjects } from '@/hooks/use-live-data'
import { WeekUpdatesDetailPage } from '@/features/admin/week-updates/detail'
import { NotFoundError } from '@/features/errors/not-found-error'

export const Route = createFileRoute('/admin/week-updates/$projectId')({
  component: ProjectWeekUpdatesRoute,
})

function ProjectWeekUpdatesRoute() {
  const { projectId } = Route.useParams()
  const { projects, isLoading } = useProjects()

  if (isLoading) {
    return (
      <div className='flex min-h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return <NotFoundError />
  }

  return <WeekUpdatesDetailPage projectName={project.name} />
}
