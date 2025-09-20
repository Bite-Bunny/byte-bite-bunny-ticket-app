'use client'

import { useEffect, useState } from 'react'

interface TelegramProviderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function TelegramProvider({
  children,
  fallback = null,
}: TelegramProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
