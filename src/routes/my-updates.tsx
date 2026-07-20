import { createFileRoute } from '@tanstack/react-router'
import { RequireApproved } from '@/components/auth-gate'
import { MyUpdatesPage } from '@/features/my-updates'

export const Route = createFileRoute('/my-updates')({
  component: () => (
    <RequireApproved>
      <MyUpdatesPage />
    </RequireApproved>
  ),
})
