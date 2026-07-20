import { AdminShell } from '@/features/admin/components/admin-shell'

type AdminPlaceholderProps = {
  title: string
  description: string
}

export function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderProps) {
  return (
    <AdminShell>
      <div className='flex min-h-[50vh] flex-col items-center justify-center text-center'>
        <h1 className='text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]'>
          {title}
        </h1>
        <p className='mt-2 max-w-md text-sm text-[#64748B] dark:text-[#94A3B8]'>
          {description}
        </p>
      </div>
    </AdminShell>
  )
}
