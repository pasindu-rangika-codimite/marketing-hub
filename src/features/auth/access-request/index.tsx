import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Clock3, Info, Mail, XCircle } from 'lucide-react'
import { signOutUser } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { AuthPageShell } from '@/features/auth/components/auth-page-shell'
import { Button } from '@/components/ui/button'

export function AccessRequest() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.auth.user)
  const isInitialized = useAuthStore((state) => state.auth.isInitialized)

  // Route reactively: approval flips this page to the app without a refresh.
  useEffect(() => {
    if (!isInitialized) return
    if (!user) {
      navigate({ to: '/sign-in' })
      return
    }
    if (user.status === 'approved') {
      navigate({ to: '/home' })
    }
  }, [user, isInitialized, navigate])

  const handleTryAnotherAccount = async () => {
    await signOutUser()
    navigate({ to: '/sign-in' })
  }

  const isRejected = user?.status === 'rejected'

  return (
    <AuthPageShell contentClassName='items-center'>
      <div className='mx-auto w-full max-w-[440px] text-center lg:text-start'>
        <h1 className='text-[1.75rem] font-bold tracking-tight text-[#1A1A1A] sm:text-3xl dark:text-[#F8FAFC]'>
          {isRejected ? 'Access not approved' : 'Access request received'}
        </h1>
        <p className='mt-3 text-sm font-medium text-[#374151] sm:text-base dark:text-[#CBD5E1]'>
          {isRejected
            ? 'Your access request was declined.'
            : 'Your company account is waiting for admin approval.'}
        </p>
        <p className='mt-4 text-sm leading-relaxed text-[#6B7280] dark:text-[#94A3B8]'>
          {isRejected
            ? 'If you think this is a mistake, please contact your manager or an admin.'
            : "You've signed in successfully with your work email. Once an admin approves access, this page will update automatically and you can start adding your updates."}
        </p>

        <div className='mt-8 space-y-3'>
          <div
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-4 py-3',
              isRejected
                ? 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D]/40 dark:text-[#FCA5A5]'
                : 'bg-[#F3E8FF] text-[#7C3AED] dark:bg-[#3B0764]/40 dark:text-[#C4B5FD]',
              'lg:justify-start'
            )}
          >
            {isRejected ? (
              <XCircle className='size-4 shrink-0' aria-hidden='true' />
            ) : (
              <Clock3 className='size-4 shrink-0' aria-hidden='true' />
            )}
            <span className='text-sm font-semibold'>
              {isRejected ? 'Access declined' : 'Pending approval'}
            </span>
          </div>

          <div
            className={cn(
              'flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3',
              'border-[#E5E7EB] bg-white text-[#1A1A1A]',
              'dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]',
              'lg:justify-start'
            )}
          >
            <Mail
              className='size-4 shrink-0 text-[#6B7280] dark:text-[#94A3B8]'
              aria-hidden='true'
            />
            <span className='truncate text-sm font-medium'>
              {user?.email ?? '...'}
            </span>
          </div>
        </div>

        {!isRejected && (
          <div
            className={cn(
              'mt-5 flex items-start justify-center gap-2 text-start',
              'lg:justify-start'
            )}
          >
            <Info
              className='mt-0.5 size-4 shrink-0 text-[#9CA3AF] dark:text-[#64748B]'
              aria-hidden='true'
            />
            <p className='text-xs leading-relaxed text-[#6B7280] sm:text-sm dark:text-[#94A3B8]'>
              You&apos;ll receive access once an admin approves your account.
              You can safely close this page and come back later.
            </p>
          </div>
        )}

        <Button
          onClick={handleTryAnotherAccount}
          variant='outline'
          className={cn(
            'mt-8 h-14 w-full rounded-xl text-[0.95rem] font-semibold shadow-none',
            'border-[#E5E7EB] bg-white text-[#374151]',
            'hover:bg-slate-50',
            'dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#E2E8F0]',
            'dark:hover:bg-[#1E293B]'
          )}
        >
          Try another account
        </Button>
      </div>
    </AuthPageShell>
  )
}
