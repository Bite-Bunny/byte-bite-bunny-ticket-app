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
      'focus-visible:styled-outline bg-white/10 backdrop-blur-md border border-white/20 text-white/90 md:hover:bg-white/20 md:hover:border-white/30 focus:bg-white/20 focus:border-white/30 shadow-lg shadow-black/20 flex h-12 w-full items-center justify-center rounded-lg text-base font-medium disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
      className,
    )}
    {...props}
  >
    {children}
  </button>
)
