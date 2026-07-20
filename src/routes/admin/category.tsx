import { createFileRoute } from '@tanstack/react-router'
import { AdminCategoryPage } from '@/features/admin/category'

export const Route = createFileRoute('/admin/category')({
  component: AdminCategoryPage,
})
