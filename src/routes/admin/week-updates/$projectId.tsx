import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAdminProjectById } from '@/features/admin/data/projects'
import { WeekUpdatesDetailPage } from '@/features/admin/week-updates/detail'

export const Route = createFileRoute('/admin/week-updates/$projectId')({
  component: ProjectWeekUpdatesRoute,
})

function ProjectWeekUpdatesRoute() {
  const { projectId } = Route.useParams()
  const project = getAdminProjectById(projectId)

  if (!project) {
    throw notFound()
  }

  return <WeekUpdatesDetailPage projectName={project.name} />
}
