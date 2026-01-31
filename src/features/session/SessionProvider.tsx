'use client'

import { useEffect } from 'react'
import { ensureSession } from '@/core/api/session-init'

interface SessionProviderProps {
  children: React.ReactNode
}

/**
 * Runs session login on every app open. Establishes server-side session
 * and receives Set-Cookie. Cookies are then sent automatically with
 * API requests and the ticket-session WebSocket.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  useEffect(() => {
    void ensureSession()
  }, [])

  return <>{children}</>
}
