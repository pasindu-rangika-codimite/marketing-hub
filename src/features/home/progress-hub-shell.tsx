import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Home as HomeIcon,
  Menu,
  X,
} from 'lucide-react'
import { APP_NAME } from '@/config/app'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'

export const WEEK_LABEL = 'Week 26'
export const WEEK_RANGE = 'Jun 22 – Jun 28, 2026'
const SELECTED_DATE = 'Thu, Jun 26, 2026'

type NavKey = 'home' | 'my-updates'

function SidebarContent({
  active,
  onNavigate,
}: {
  active: NavKey
  onNavigate?: () => void
}) {
  const linkClass = (key: NavKey) =>
    cn(
      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
      active === key
        ? 'bg-[#F3E8FF] font-semibold text-[#7C3AED] dark:bg-violet-500/20 dark:text-violet-300'
        : 'font-medium text-[#64748B] hover:bg-slate-100 dark:text-[#94A3B8] dark:hover:bg-slate-800',
      active === key &&
        'before:absolute before:top-1/2 before:left-0 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-[#7C3AED] dark:before:bg-violet-400'
    )

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center gap-3 px-5 pt-6 pb-8'>
        <PlaceholderImage
          label='Logo'
          rounded='xl'
          className='size-10 shrink-0'
        />
        <div className='min-w-0'>
          <p className='truncate text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
            {APP_NAME}
          </p>
        </div>
      </div>

      <nav className='flex flex-col gap-1.5 px-3'>
        <Link to='/home' onClick={onNavigate} className={linkClass('home')}>
          <HomeIcon className='size-[18px]' />
          Home
        </Link>
        <Link
          to='/my-updates'
          onClick={onNavigate}
          className={linkClass('my-updates')}
        >
          <FileText className='size-[18px]' />
          My Updates
        </Link>
      </nav>

      <div className='mt-auto p-4'>
        <div
          className={cn(
            'rounded-2xl border border-slate-200 bg-slate-50 p-4',
            'dark:border-slate-700 dark:bg-slate-800/60'
          )}
        >
          <div className='flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC]'>
            <CalendarDays className='size-4 text-[#7C3AED]' />
            <span className='text-sm font-bold'>{WEEK_LABEL}</span>
          </div>
          <p className='mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]'>
            {WEEK_RANGE}
          </p>
          <p className='mt-2 text-xs font-medium text-[#7C3AED] dark:text-violet-300'>
            5 days left to add updates.
          </p>
        </div>
      </div>
    </div>
  )
}

type ProgressHubShellProps = {
  active: NavKey
  title?: string
  subtitle?: string
  children: ReactNode
}

export function ProgressHubShell({
  active,
  title,
  subtitle,
  children,
}: ProgressHubShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className='flex h-svh w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]'>
      <aside
        className={cn(
          'hidden h-svh w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col',
          'dark:border-slate-800 dark:bg-[#111827]'
        )}
      >
        <SidebarContent active={active} />
      </aside>

      {mobileOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-slate-900/40'
            aria-label='Close menu'
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={cn(
              'absolute inset-y-0 left-0 flex w-[min(280px,88vw)] flex-col',
              'bg-white shadow-xl dark:bg-[#111827]'
            )}
          >
            <button
              type='button'
              className='absolute top-4 right-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              aria-label='Close sidebar'
              onClick={() => setMobileOpen(false)}
            >
              <X className='size-5' />
            </button>
            <SidebarContent
              active={active}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
        <header
          className={cn(
            'z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3',
            'sm:px-6 lg:px-8',
            'dark:border-slate-800 dark:bg-[#111827]'
          )}
        >
          <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='shrink-0 lg:hidden'
              onClick={() => setMobileOpen(true)}
              aria-label='Open menu'
            >
              <Menu className='size-5' />
            </Button>

            {title ? (
              <div className='min-w-0'>
                <h1 className='truncate text-base font-bold tracking-tight text-[#0F172A] sm:text-xl dark:text-[#F8FAFC]'>
                  {title}
                </h1>
                {subtitle && (
                  <p className='truncate text-xs text-[#64748B] sm:text-sm dark:text-[#94A3B8]'>
                    {subtitle}
                  </p>
                )}
              </div>
            ) : (
              <span className='truncate text-sm font-semibold text-[#0F172A] lg:hidden dark:text-[#F8FAFC]'>
                {APP_NAME}
              </span>
            )}
          </div>

          <div className='ms-auto flex shrink-0 items-center gap-2 sm:gap-3'>
            <ThemeSwitch />

            <button
              type='button'
              className={cn(
                'hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium',
                'text-[#334155] sm:inline-flex',
                'hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]',
                'dark:hover:bg-slate-800'
              )}
            >
              <CalendarDays className='size-4 text-[#7C3AED]' />
              <span className='max-w-[180px] truncate'>{SELECTED_DATE}</span>
              <ChevronDown className='size-4 text-slate-400' />
            </button>

            <button
              type='button'
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 sm:px-2',
                'hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full',
                  'bg-[#3B82F6] text-xs font-bold text-white'
                )}
              >
                SN
              </div>
              <div className='hidden min-w-0 text-start md:block'>
                <p className='truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                  Subodha N.
                </p>
                <p className='truncate text-xs text-[#64748B] dark:text-[#94A3B8]'>
                  UI/UX Designer
                </p>
              </div>
              <ChevronDown className='hidden size-4 text-slate-400 md:block' />
            </button>
          </div>
        </header>

        <main className='min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          {children}
        </main>
      </div>
    </div>
  )
}
