import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { APP_NAME, ALLOWED_EMAIL_DOMAIN } from '@/config/app'
import { DomainNotAllowedError, signInWithGoogle } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { AuthPageShell } from '@/features/auth/components/auth-page-shell'
import { Button } from '@/components/ui/button'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fill='#4285F4'
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      />
      <path
        fill='#34A853'
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      />
      <path
        fill='#FBBC05'
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      />
      <path
        fill='#EA4335'
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      />
    </svg>
  )
}

export function SignIn() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((state) => state.auth.user)

  // Already signed in (or sign-in just completed): route by approval status.
  useEffect(() => {
    if (!user) return
    if (user.status === 'approved') {
      navigate({ to: '/home' })
    } else {
      navigate({ to: '/access-request' })
    }
  }, [user, navigate])

  const handleGoogleSignIn = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      await signInWithGoogle()
      // Navigation happens in the effect above once the profile loads.
    } catch (error) {
      setIsLoading(false)

      if (error instanceof DomainNotAllowedError) {
        toast.error('This account is not allowed', {
          description: `Please sign in with your @${ALLOWED_EMAIL_DOMAIN} Google account.`,
        })
        return
      }

      // Popup closed by the user is not an error worth shouting about.
      const code = (error as { code?: string })?.code
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        return
      }

      // eslint-disable-next-line no-console
      console.error('Google sign-in failed:', error)
      toast.error('Sign-in failed', {
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <AuthPageShell>
      <div className='mx-auto w-full max-w-[400px] text-center'>
        <h1 className='text-[1.75rem] font-bold tracking-tight text-[#1A1A1A] sm:text-3xl dark:text-[#F8FAFC]'>
          Welcome back!
        </h1>
        <p className='mt-3 text-sm text-[#6B7280] sm:text-base dark:text-[#94A3B8]'>
          Sign in to continue to {APP_NAME}.
        </p>

        <Button
          type='button'
          variant='outline'
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className={cn(
            'mt-10 h-14 w-full rounded-xl border-[#E5E7EB] bg-white',
            'text-[0.95rem] font-semibold text-[#1A1A1A] shadow-none',
            'hover:bg-slate-50',
            'dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]',
            'dark:hover:bg-[#1E293B]'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className='size-5 animate-spin' />
              Signing in...
            </>
          ) : (
            <>
              <GoogleIcon className='size-5 sm:size-6' />
              Continue with Google
            </>
          )}
        </Button>

        <div className='relative my-8 sm:my-10'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-[#E5E7EB] dark:border-[#334155]' />
          </div>
          <div className='relative flex justify-center text-xs sm:text-sm'>
            <span className='bg-white px-3 text-[#9CA3AF] dark:bg-[#1E293B] dark:text-[#64748B]'>
              or
            </span>
          </div>
        </div>

        <div className='flex items-start gap-2.5 text-start'>
          <ShieldCheck
            className='mt-0.5 size-4 shrink-0 text-emerald-500 sm:size-[1.125rem]'
            aria-hidden='true'
          />
          <p className='text-xs leading-relaxed text-[#6B7280] sm:text-sm dark:text-[#94A3B8]'>
            Only company Google accounts (@{ALLOWED_EMAIL_DOMAIN}) are allowed.
            Access is restricted to approved team members.
          </p>
        </div>
      </div>
    </AuthPageShell>
  )
}
