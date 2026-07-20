import { cn } from '@/lib/utils'

type PlaceholderImageProps = {
  className?: string
  label?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

/**
 * Cross-mark sample image. Replace this component usage with a real
 * <img> or asset later without changing surrounding layout.
 */
export function PlaceholderImage({
  className,
  label = 'Image',
  rounded = 'lg',
}: PlaceholderImageProps) {
  const radius =
    rounded === 'none'
      ? 'rounded-none'
      : rounded === 'sm'
        ? 'rounded-sm'
        : rounded === 'md'
          ? 'rounded-md'
          : rounded === 'lg'
            ? 'rounded-lg'
            : rounded === 'xl'
              ? 'rounded-xl'
              : rounded === '2xl'
                ? 'rounded-2xl'
                : 'rounded-full'

  return (
    <div
      role='img'
      aria-label={`${label} placeholder`}
      className={cn(
        'relative flex items-center justify-center overflow-hidden border border-dashed border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/80',
        radius,
        className
      )}
    >
      <svg
        viewBox='0 0 100 100'
        className='absolute inset-0 size-full text-slate-300 dark:text-slate-600'
        aria-hidden='true'
        preserveAspectRatio='none'
      >
        <line
          x1='8'
          y1='8'
          x2='92'
          y2='92'
          stroke='currentColor'
          strokeWidth='1.5'
        />
        <line
          x1='92'
          y1='8'
          x2='8'
          y2='92'
          stroke='currentColor'
          strokeWidth='1.5'
        />
      </svg>
      <span className='relative z-10 px-2 text-center text-[10px] font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500'>
        {label}
      </span>
    </div>
  )
}
