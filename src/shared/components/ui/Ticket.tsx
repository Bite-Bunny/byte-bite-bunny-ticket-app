import { cn } from '@/shared/lib/cn'
import type { ComponentProps } from 'react'
import Image from 'next/image'
import TicketImage from '@/assets/ticket-logo.png'

export type TicketVariant = 'bronze' | 'silver' | 'gold' | 'diamond'

export interface TicketProps extends Omit<ComponentProps<'div'>, 'children'> {
  variant?: TicketVariant
  price?: number
  quality?: number
  showCarrot?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  bronze: {
    gradient: 'from-amber-600 via-amber-700 to-amber-800',
    border: 'border-amber-400/30',
    shadow: 'shadow-amber-500/20',
    text: 'text-amber-100',
    accent: 'text-amber-200',
  },
  silver: {
    gradient: 'from-gray-300 via-gray-400 to-gray-500',
    border: 'border-gray-300/30',
    shadow: 'shadow-gray-400/20',
    text: 'text-gray-100',
    accent: 'text-gray-200',
  },
  gold: {
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    border: 'border-yellow-300/30',
    shadow: 'shadow-yellow-500/20',
    text: 'text-yellow-100',
    accent: 'text-yellow-200',
  },
  diamond: {
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    border: 'border-cyan-300/30',
    shadow: 'shadow-cyan-500/20',
    text: 'text-cyan-100',
    accent: 'text-cyan-200',
  },
}

const sizeStyles = {
  sm: {
    container: 'w-32 h-48',
    logo: 'w-8 h-8',
    text: 'text-xs',
    price: 'text-sm',
    quality: 'text-xs',
  },
  md: {
    container: 'w-40 h-60',
    logo: 'w-12 h-12',
    text: 'text-sm',
    price: 'text-base',
    quality: 'text-sm',
  },
  lg: {
    container: 'w-48 h-72',
    logo: 'w-16 h-16',
    text: 'text-base',
    price: 'text-lg',
    quality: 'text-base',
  },
}

// Logo component using the actual ticket logo image
const TicketLogo = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Image
      src={TicketImage}
      alt="Bite Bunny Logo"
      width={64}
      height={64}
      className="w-full h-full object-contain filter brightness-0 invert opacity-80"
    />
  </div>
)

// Star decoration component - 5-pointed star
const Star = ({ className }: { className?: string }) => (
  <div className={cn('relative w-3 h-3', className)}>
    <div className="absolute inset-0">
      <div
        className="w-full h-full bg-current opacity-60"
        style={{
          clipPath:
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }}
      />
    </div>
  </div>
)

export const Ticket = ({
  variant = 'bronze',
  price = 300,
  quality = 3.1554,
  showCarrot = true,
  size = 'md',
  className,
  ...props
}: TicketProps) => {
  const styles = variantStyles[variant]
  const sizeConfig = sizeStyles[size]

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-4',
        'bg-gradient-to-b',
        styles.gradient,
        styles.border,
        styles.shadow,
        'border-2 shadow-lg',
        'ticket-shape', // custom ticket corners
        sizeConfig.container,
        className,
      )}
      {...props}
    >
      {/* Decorative stars */}
      <Star className={cn('absolute top-2 left-2', styles.accent)} />
      <Star className={cn('absolute top-2 right-2', styles.accent)} />
      <Star className={cn('absolute top-4 left-1/4', styles.accent)} />
      <Star className={cn('absolute top-4 right-1/4', styles.accent)} />
      <Star
        className={cn(
          'absolute top-6 left-1/2 transform -translate-x-1/2',
          styles.accent,
        )}
      />
      <Star className={cn('absolute top-8 left-1/3', styles.accent)} />
      <Star className={cn('absolute top-8 right-1/3', styles.accent)} />

      {/* Main logo */}
      <div className={cn('mt-8 mb-4', styles.accent)}>
        <TicketLogo className={sizeConfig.logo} />
      </div>

      {/* Divider line */}
      <div className={cn('w-3/4 h-px bg-current opacity-30 mb-2')} />

      {/* Price */}
      <div
        className={cn(
          'flex items-center gap-1 mb-1',
          styles.text,
          sizeConfig.price,
        )}
      >
        <span>PRICE</span>
        <span className="font-bold">{price}</span>
        {showCarrot && <span>🥕</span>}
      </div>

      {/* Divider line */}
      <div className={cn('w-3/4 h-px bg-current opacity-30 mb-1')} />

      {/* Quality */}
      <div
        className={cn(
          'flex items-center gap-1',
          styles.text,
          sizeConfig.quality,
        )}
      >
        <span>QUALITY</span>
        <span className="font-bold">{quality}</span>
      </div>
    </div>
  )
}
