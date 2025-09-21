'use client'

import { useWebSocket } from '@/shared/hooks/useWebSocket'

export default function WebSocketStatus() {
  const { isConnected, lastMessage, error } = useWebSocket()

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isConnected
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}
      >
        {isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
      </div>

      {error && (
        <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">
          Error: {error.type}
        </div>
      )}

      {lastMessage && (
        <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs max-w-xs">
          Last: {lastMessage.type}
        </div>
      )}
    </div>
  )
}
