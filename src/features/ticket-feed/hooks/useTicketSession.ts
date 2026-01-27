'use client'

import { useEffect, useRef, useState } from 'react'
import { createSessionWebSocket } from '@/core/api/websocket'
import { TicketData } from '../types'
import { mapApiTicketToTicketData } from '../utils/mapApiTicket'

type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

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
          setTickets((prev) => [...prev, ticket])
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
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close()
      }
    }
  }, [])

  return {
    tickets,
    status,
    error,
  }
}
