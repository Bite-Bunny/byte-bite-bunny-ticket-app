'use client'

import { useEffect } from 'react'
import { webSocketService } from '@/core/api/websocket'

interface WebSocketProviderProps {
  children: React.ReactNode
}

export default function WebSocketProvider({
  children,
}: WebSocketProviderProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Start WebSocket connection when component mounts
    webSocketService.connect()

    // Set up event handlers
    const handleConnect = () => {
      console.log('WebSocket connected - sending authorization')
      // Send authorization message after successful connection
      webSocketService.sendAuthorization()
    }

    const handleMessage = (message: any) => {
      console.log('WebSocket message received:', message)
      // Handle different message types here
      switch (message.type) {
        case 'authorization_success':
          console.log('WebSocket authorization successful')
          break
        case 'authorization_error':
          console.error('WebSocket authorization failed:', message.data)
          break
        default:
          console.log('Unknown message type:', message.type)
      }
    }

    const handleError = (error: Event) => {
      console.error('WebSocket error occurred:', error)
    }

    const handleDisconnect = () => {
      console.log('WebSocket disconnected')
    }

    // Register event handlers
    webSocketService.onConnect(handleConnect)
    webSocketService.onMessage(handleMessage)
    webSocketService.onError(handleError)
    webSocketService.onDisconnect(handleDisconnect)

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect()
    }
  }, [])

  return <>{children}</>
}
