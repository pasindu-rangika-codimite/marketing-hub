import { Lock } from 'lucide-react'
import { APP_NAME } from '@/config/app'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from '@/components/theme-switch'
import { AuthBrandPanel } from './auth-brand-panel'

type AuthPageShellProps = {
  children: React.ReactNode
  contentClassName?: string
}

export function AuthPageShell({
  children,
  contentClassName,
}: AuthPageShellProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-svh w-full flex-col items-center justify-center',
        'bg-[#F3F4FF] px-4 py-8 sm:px-6 sm:py-10 lg:py-12',
        'dark:bg-[#0F172A]'
      )}
    >
      <div className='absolute top-4 right-4 z-20 sm:top-6 sm:right-6'>
        <ThemeSwitch />
      </div>

      <div
        className={cn(
          'grid w-full max-w-[1120px] overflow-hidden rounded-[28px]',
          'min-h-[520px] sm:min-h-[580px] lg:min-h-[640px]',
          'bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]',
          'dark:bg-[#1E293B] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]',
          'lg:grid-cols-2'
        )}
      >
        <AuthBrandPanel />

        <section
          className={cn(
            'flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-14',
            'lg:px-14 lg:py-16 xl:px-16',
            contentClassName
          )}
        >
          {children}
        </section>
      </div>

      <footer className='mt-8 flex flex-col items-center gap-1.5 text-center sm:mt-10'>
        <p className='flex items-center gap-1.5 text-xs text-[#9CA3AF] dark:text-[#64748B]'>
          <Lock className='size-3.5' aria-hidden='true' />
          Secure · Private · Trusted
        </p>
        <p className='text-xs text-[#9CA3AF] dark:text-[#64748B]'>
          © 2025 {APP_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
