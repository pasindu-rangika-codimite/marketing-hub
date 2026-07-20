import { useEffect, type ReactNode } from 'react'
import { isAdminEmail } from '@/config/app'
import {
  ensureUserProfile,
  isAllowedEmail,
  signOutUser,
  subscribeToAuthChanges,
  subscribeToUserProfile,
} from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth-store'

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Bridges Firebase Auth to the app's auth store.
 *
 * On sign-in: rejects non-company accounts, creates the `users/{uid}`
 * profile (status `pending`) if it's the first visit, then keeps the store
 * in sync with the profile via a live subscription — so an admin approving
 * the user is reflected immediately.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined

    const unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
      const { auth } = useAuthStore.getState()

      unsubscribeProfile?.()
      unsubscribeProfile = undefined

      if (!firebaseUser) {
        auth.reset()
        auth.setInitialized(true)
        return
      }

      // Safety net: a session from a non-company account is terminated.
      if (!isAllowedEmail(firebaseUser.email)) {
        await signOutUser()
        auth.reset()
        auth.setInitialized(true)
        return
      }

      try {
        const token = await firebaseUser.getIdToken()
        const initialProfile = await ensureUserProfile(firebaseUser)
        const email = (firebaseUser.email ?? '').toLowerCase()

        auth.setAccessToken(token)
        auth.setUser({
          uid: firebaseUser.uid,
          email,
          displayName: initialProfile.displayName,
          photoURL: initialProfile.photoURL,
          status: initialProfile.status,
          role: initialProfile.role,
          isAdmin: isAdminEmail(email),
        })

        // Keep status/role live — approval flips the UI without a refresh.
        unsubscribeProfile = subscribeToUserProfile(
          firebaseUser.uid,
          (profile) => {
            if (!profile) return
            const { auth: current } = useAuthStore.getState()
            const user = current.user
            if (!user) return
            current.setUser({
              ...user,
              displayName: profile.displayName,
              photoURL: profile.photoURL,
              status: profile.status,
              role: profile.role,
            })
          }
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize user session:', error)
        auth.reset()
      }

      auth.setInitialized(true)
    })

    return () => {
      unsubscribeProfile?.()
      unsubscribeAuth()
    }
  }, [])

  return children
}
