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
      'focus-visible:styled-outline bg-brand text-black hover:bg-brand-light focus:bg-brand-light violet:bg-brand-violet violet:text-white violet:hover:bg-brand-violet-light violet:focus:bg-brand-violet-light flex h-12 w-full items-center justify-center rounded-lg text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
  </button>
)
