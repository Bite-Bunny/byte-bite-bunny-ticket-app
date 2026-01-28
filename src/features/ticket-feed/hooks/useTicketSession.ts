'use client'

import { useEffect, useRef, useState } from 'react'
import { createSessionWebSocket } from '@/core/api/websocket'
import { TicketData } from '../types'
import { mapApiTicketToTicketData } from '../utils/mapApiTicket'

type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

// Hard cap on how many tickets we keep in memory.
// Reduced from 100 to 30 to significantly reduce memory usage.
// Each ticket can contain large data structures, so keeping fewer in memory
// prevents excessive RAM consumption (250MB+ can become 700MB+ with 100 tickets).
const MAX_TICKETS = 30

const isWsDebugEnabled = process.env.NEXT_PUBLIC_WS_DEBUG === 'true'

const wsDebugLog = (...args: unknown[]) => {
  if (isWsDebugEnabled) {
    // eslint-disable-next-line no-console
    console.log('[TicketSession]', ...args)
  }
}

export const useTicketSession = () => {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    setStatus('connecting')
    setError(null)

    const socket = createSessionWebSocket()

    wsDebugLog('creating WebSocket instance', socket)

    if (!socket) {
      setStatus('error')
      setError('WebSocket is not available in this environment')
      wsDebugLog('WebSocket is not available in this environment')
      return
    }

    socketRef.current = socket

    socket.onopen = () => {
      setStatus('open')
      wsDebugLog('WebSocket open')

      try {
        // API requires sending at least an empty message to start the stream
        socket.send('')
        wsDebugLog('sent initial empty message')
      } catch (err) {
        console.error('Failed to send initial session message', err)
        wsDebugLog('failed to send initial message', err)
      }
    }

    socket.onmessage = (event: MessageEvent) => {
      wsDebugLog('message received', event.data)
      try {
        const parsed = JSON.parse(event.data)
        const ticket = mapApiTicketToTicketData(parsed)

        if (ticket) {
          setTickets((prev) => {
            // Append new ticket and trim to the last MAX_TICKETS items
            const next = [...prev, ticket]
            if (next.length > MAX_TICKETS) {
              return next.slice(next.length - MAX_TICKETS)
            }
            return next
          })
        }
      } catch (err) {
        console.error('Failed to parse ticket message', err)
        wsDebugLog('failed to parse message', err)
      }
    }

    socket.onerror = (event: Event) => {
      setStatus('error')
      setError('WebSocket connection error')
      wsDebugLog('WebSocket error', event)
    }

    socket.onclose = (event: CloseEvent) => {
      setStatus('closed')
      wsDebugLog('WebSocket closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      })
    }

    return () => {
      // CRITICAL FIX: Close socket in ANY state (CONNECTING, OPEN, CLOSING)
      // The previous code only closed OPEN sockets, causing leaks
      if (socketRef.current) {
        const currentSocket = socketRef.current
        const readyState = currentSocket.readyState

        // Remove event handlers to prevent memory leaks
        currentSocket.onopen = null
        currentSocket.onmessage = null
        currentSocket.onerror = null
        currentSocket.onclose = null

        // Close socket if it's not already closed (CLOSED = 3)
        if (
          readyState !== WebSocket.CLOSED &&
          readyState !== WebSocket.CLOSING
        ) {
          wsDebugLog('closing WebSocket on cleanup', { readyState })
          currentSocket.close()
        }

        socketRef.current = null
      }

      // MEMORY FIX: Clear tickets array on unmount to free memory
      // This ensures all ticket data is garbage collected when component unmounts
      setTickets([])
    }
  }, [])

  return {
    tickets,
    status,
    error,
  }
}
