'use client'

import Image from 'next/image'

export function Loading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-transparent">
      <div className="relative">
        <Image
          src="/logo-short.png"
          alt="Bite Bunny Logo"
          width={120}
          height={120}
          className="animate-pulse-smooth"
          priority
        />
      </div>
    </div>
  )
}
