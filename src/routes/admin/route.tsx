import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RequireAdmin } from '@/components/auth-gate'
import { requireAdminAuth } from '@/features/admin/admin-route-guards'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    requireAdminAuth()
  },
  component: () => (
    <RequireAdmin>
      <Outlet />
    </RequireAdmin>
  ),
})
