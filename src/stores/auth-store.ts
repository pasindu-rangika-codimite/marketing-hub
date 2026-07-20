import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { AppUser } from '@/types'

const ACCESS_TOKEN = 'marketing_hub_auth_token'

interface AuthState {
  auth: {
    user: AppUser | null
    setUser: (user: AppUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isInitialized: boolean
    setInitialized: (value: boolean) => void
  }
}

function readStoredToken(): string {
  const cookieState = getCookie(ACCESS_TOKEN)
  if (!cookieState) return ''

  try {
    const parsed = JSON.parse(cookieState)
    return typeof parsed === 'string' ? parsed : ''
  } catch {
    removeCookie(ACCESS_TOKEN)
    return ''
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = readStoredToken()
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
            },
          }
        }),
      isInitialized: false,
      setInitialized: (value) =>
        set((state) => ({
          ...state,
          auth: { ...state.auth, isInitialized: value },
        })),
    },
  }
})
