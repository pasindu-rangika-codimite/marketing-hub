import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Quick cookie-based check in beforeLoad: bounce clearly signed-out visitors
 * to /sign-in without rendering. The definitive admin check happens in the
 * <RequireAdmin> gate (and, for data, in the Firestore security rules).
 */
export function requireAdminAuth() {
  const { accessToken } = useAuthStore.getState().auth
  if (!accessToken) {
    throw redirect({ to: '/sign-in' })
  }
}
