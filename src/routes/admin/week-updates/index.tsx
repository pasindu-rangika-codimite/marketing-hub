import { createFileRoute } from '@tanstack/react-router'
import { AdminWeekUpdatesPage } from '@/features/admin/week-updates'

export const Route = createFileRoute('/admin/week-updates/')({
  component: AdminWeekUpdatesPage,
})
