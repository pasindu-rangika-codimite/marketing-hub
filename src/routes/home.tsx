import { createFileRoute } from '@tanstack/react-router'
import { RequireApproved } from '@/components/auth-gate'
import { HomePage } from '@/features/home'

export const Route = createFileRoute('/home')({
  component: () => (
    <RequireApproved>
      <HomePage />
    </RequireApproved>
  ),
})
