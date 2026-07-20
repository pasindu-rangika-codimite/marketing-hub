import { APP_TAGLINE } from '@/config/app'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from '@/components/placeholder-image'

export function AuthBrandPanel({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'flex min-h-[340px] flex-col gap-8 border-b border-slate-100',
        'bg-[#FAFBFF] p-8 sm:min-h-[400px] sm:p-10 lg:min-h-0 lg:gap-10',
        'dark:border-slate-700/60 dark:bg-[#162032]',
        'lg:border-r lg:border-b-0 lg:p-12 xl:p-14',
        className
      )}
    >
      <div className='flex items-start gap-3.5'>
        <PlaceholderImage
          label='Logo'
          rounded='xl'
          className='size-12 shrink-0 sm:size-14'
        />
        <div className='min-w-0 pt-0.5'>
          <p className='text-xl leading-tight font-bold text-[#1A1A1A] sm:text-[1.375rem] dark:text-[#F8FAFC]'>
            Design
          </p>
          <p className='text-xl leading-tight font-bold text-[#7C3AED] sm:text-[1.375rem] dark:text-[#A78BFA]'>
            Progress Hub
          </p>
          <p className='mt-2 text-sm text-[#6B7280] sm:text-[0.95rem] dark:text-[#94A3B8]'>
            {APP_TAGLINE}
          </p>
        </div>
      </div>

      <div className='flex flex-1 items-center justify-center py-4 sm:py-6 lg:py-8'>
        <PlaceholderImage
          label='Illustration'
          rounded='2xl'
          className='aspect-[5/4] h-full w-full max-h-[420px] min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]'
        />
      </div>
    </section>
  )
}
