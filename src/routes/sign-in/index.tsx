import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

// Already-signed-in users are redirected by the SignIn component itself,
// which routes by approval status once the profile has loaded.
export const Route = createFileRoute('/sign-in/')({
  validateSearch: searchSchema,
  component: SignIn,
})
