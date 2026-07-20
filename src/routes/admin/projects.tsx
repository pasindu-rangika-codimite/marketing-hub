import { createFileRoute } from '@tanstack/react-router'
import { AdminProjectsPage } from '@/features/admin/projects'

export const Route = createFileRoute('/admin/projects')({
  component: AdminProjectsPage,
})
