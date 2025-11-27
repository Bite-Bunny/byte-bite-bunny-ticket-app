import { cn } from '@/shared/lib/cn'
import type { ComponentProps } from 'react'

export const Button = ({
  className,
  ref,
  children,
  ...props
}: ComponentProps<'button'>) => (
  <button
    type="button"
    ref={ref}
    className={cn(
      'relative flex items-center justify-center',
      'bg-white/10 backdrop-blur-[20px] border border-white/15',
      'text-white/90 hover:text-white',
      'hover:bg-white/15 hover:border-white/20',
      'focus:bg-white/15 focus:border-white/20',
      'shadow-[0_-8px_32px_rgba(0,0,0,0.3)]',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5 disabled:hover:bg-white/5',
      'transition-all touch-manipulation',
      'focus-visible:outline-none',
      className,
    )}
    style={{
      WebkitTapHighlightColor: 'transparent',
      boxShadow:
        '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }}
    {...props}
  >
    {children}
  </button>
)
