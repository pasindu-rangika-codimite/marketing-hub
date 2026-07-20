import { useState, type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  CalendarDays,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Tag,
  Users,
  X,
} from 'lucide-react'
import { APP_NAME } from '@/config/app'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

export const ADMIN_WEEK_LABEL = 'Week 26'
export const ADMIN_WEEK_RANGE = 'Jun 22 – Jun 28, 2026'

type AdminNavKey =
  | 'dashboard'
  | 'members'
  | 'week-updates'
  | 'projects'
  | 'category'

const NAV_ITEMS: {
  key: AdminNavKey
  label: string
  to: string
  icon: typeof LayoutDashboard
}[] = [
  { key: 'dashboard', label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { key: 'members', label: 'Members', to: '/admin/members', icon: Users },
  {
    key: 'week-updates',
    label: 'Week Updates',
    to: '/admin/week-updates',
    icon: CalendarDays,
  },
  {
    key: 'projects',
    label: 'Projects',
    to: '/admin/projects',
    icon: FolderKanban,
  },
  { key: 'category', label: 'Category', to: '/admin/category', icon: Tag },
]

function SidebarContent({
  active,
  onNavigate,
  footer,
}: {
  active: AdminNavKey
  onNavigate?: () => void
  footer?: ReactNode
}) {
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
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              active === item.key
                ? 'bg-[#F3E8FF] font-semibold text-[#7C3AED] dark:bg-violet-500/20 dark:text-violet-300'
                : 'font-medium text-[#64748B] hover:bg-slate-100 dark:text-[#94A3B8] dark:hover:bg-slate-800',
              active === item.key &&
                'before:absolute before:top-1/2 before:left-0 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-[#7C3AED] dark:before:bg-violet-400'
            )}
          >
            <item.icon className='size-[18px]' />
            {item.label}
          </Link>
        ))}
      </nav>

      {footer}
    </div>
  )
}

function resolveActiveNav(pathname: string): AdminNavKey {
  if (pathname.startsWith('/admin/members')) return 'members'
  if (pathname.startsWith('/admin/week-updates')) return 'week-updates'
  if (pathname.startsWith('/admin/projects')) return 'projects'
  if (pathname.startsWith('/admin/category')) return 'category'
  return 'dashboard'
}

type AdminShellProps = {
  children: ReactNode
  sidebarFooter?: ReactNode
}

export function AdminShell({ children, sidebarFooter }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const active = resolveActiveNav(pathname)
  const adminUser = useAuthStore((state) => state.auth.user)

  return (
    <div className='flex h-svh w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]'>
      <aside
        className={cn(
          'hidden h-svh w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col',
          'dark:border-slate-800 dark:bg-[#111827]'
        )}
      >
        <SidebarContent active={active} footer={sidebarFooter} />
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
              'absolute inset-y-0 left-0 flex w-[min(280px,88vw)] flex-col bg-white shadow-xl dark:bg-[#111827]'
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
              footer={sidebarFooter}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
        <header
          className={cn(
            'z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3',
            'sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-[#111827]'
          )}
        >
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

          <div className='ms-auto flex shrink-0 items-center gap-2 sm:gap-3'>
            <ThemeSwitch />

            <button
              type='button'
              className={cn(
                'hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium sm:inline-flex',
                'text-[#334155] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#E2E8F0]',
                'dark:hover:bg-slate-800'
              )}
            >
              <CalendarDays className='size-4 text-[#7C3AED]' />
              <span className='max-w-[220px] truncate'>
                {ADMIN_WEEK_LABEL} • {ADMIN_WEEK_RANGE}
              </span>
              <ChevronDown className='size-4 text-slate-400' />
            </button>

            <button
              type='button'
              className='flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 hover:bg-slate-50 sm:px-2 dark:hover:bg-slate-800'
            >
              <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-bold text-white'>
                MN
              </div>
              <div className='hidden min-w-0 text-start md:block'>
                <p className='truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]'>
                  {adminUser?.displayName ?? 'Admin'}
                </p>
                <p className='truncate text-xs text-[#64748B] dark:text-[#94A3B8]'>
                  Admin
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
