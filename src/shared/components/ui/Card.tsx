import { cn } from '@/shared/lib/cn'
import type { ComponentProps } from 'react'

export interface CardProps extends ComponentProps<'div'> {
  variant?: 'default' | 'elevated'
}

export const Card = ({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) => {
  const baseStyles =
    'relative bg-white/10 backdrop-blur-[20px] border border-white/15 rounded-2xl'

  const shadowStyles = {
    default:
      '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    elevated:
      '0 12px 48px rgba(0, 0, 0, 0.4), 0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  }

  return (
    <div
      className={cn(baseStyles, className)}
      style={{
        boxShadow: shadowStyles[variant],
      }}
      {...props}
    >
      {children}
    </div>
  )
}
