import { createFileRoute } from '@tanstack/react-router'
import { AdminMembersPage } from '@/features/admin/members'

export const Route = createFileRoute('/admin/members')({
  component: AdminMembersPage,
})
