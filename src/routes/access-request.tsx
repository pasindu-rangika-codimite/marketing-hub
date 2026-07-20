import { createFileRoute } from '@tanstack/react-router'
import { AccessRequest } from '@/features/auth/access-request'

export const Route = createFileRoute('/access-request')({
  component: AccessRequest,
})
