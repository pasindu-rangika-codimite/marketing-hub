import { type ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

function FullPageSpinner() {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <Loader2 className='size-8 animate-spin text-muted-foreground' />
    </div>
  )
}

/**
 * Renders children only for a signed-in AND approved user.
 * While Firebase restores the session, shows a spinner instead of
 * flashing a redirect.
 */
export function RequireApproved({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.auth.user)
  const isInitialized = useAuthStore((state) => state.auth.isInitialized)

  if (!isInitialized) return <FullPageSpinner />
  if (!user) return <Navigate to='/sign-in' />
  if (user.status !== 'approved') return <Navigate to='/access-request' />

  return children
}

/** Renders children only for approved users on the admin allow-list. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.auth.user)
  const isInitialized = useAuthStore((state) => state.auth.isInitialized)

  if (!isInitialized) return <FullPageSpinner />
  if (!user) return <Navigate to='/sign-in' />
  if (user.status !== 'approved') return <Navigate to='/access-request' />
  if (!user.isAdmin) return <Navigate to='/home' />

  return children
}
