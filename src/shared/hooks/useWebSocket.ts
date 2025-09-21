import { useEffect, useCallback, useState } from 'react'
import { webSocketService, type WebSocketMessage } from '@/core/api/websocket'

export interface UseWebSocketReturn {
  isConnected: boolean
  sendMessage: (message: WebSocketMessage) => void
  lastMessage: WebSocketMessage | null
  error: Event | null
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [error, setError] = useState<Event | null>(null)

  const sendMessage = useCallback((message: WebSocketMessage) => {
    webSocketService.send(message)
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const handleConnect = () => {
      setIsConnected(true)
      setError(null)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    const handleMessage = (message: WebSocketMessage) => {
      setLastMessage(message)
    }

    const handleError = (error: Event) => {
      setError(error)
      setIsConnected(false)
    }

    // Register event handlers
    webSocketService.onConnect(handleConnect)
    webSocketService.onDisconnect(handleDisconnect)
    webSocketService.onMessage(handleMessage)
    webSocketService.onError(handleError)

    // Set initial connection state
    setIsConnected(webSocketService.isConnected())

    // Cleanup
    return () => {
      // Note: We don't disconnect the WebSocket here as it's managed globally
      // by the WebSocketProvider
    }
  }, [])

  return {
    isConnected,
    sendMessage,
    lastMessage,
    error,
  }
}
