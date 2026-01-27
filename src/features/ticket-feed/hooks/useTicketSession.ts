'use client'

import { useEffect, useRef, useState } from 'react'
import { createSessionWebSocket } from '@/core/api/websocket'
import { TicketData } from '../types'
import { mapApiTicketToTicketData } from '../utils/mapApiTicket'

type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export const useTicketSession = () => {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    setStatus('connecting')
    setError(null)

    const socket = createSessionWebSocket()

    if (!socket) {
      setStatus('error')
      setError('WebSocket is not available in this environment')
      return
    }

    socketRef.current = socket

    socket.onopen = () => {
      setStatus('open')

      try {
        // API requires sending at least an empty message to start the stream
        socket.send('')
      } catch (err) {
        console.error('Failed to send initial session message', err)
      }
    }

    socket.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data)
        const ticket = mapApiTicketToTicketData(parsed)

        if (ticket) {
          setTickets((prev) => [...prev, ticket])
        }
      } catch (err) {
        console.error('Failed to parse ticket message', err)
      }
    }

    socket.onerror = () => {
      setStatus('error')
      setError('WebSocket connection error')
    }

    socket.onclose = () => {
      setStatus('closed')
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
