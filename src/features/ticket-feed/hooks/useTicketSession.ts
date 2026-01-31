'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createTicketSessionWebSocket } from '@/core/api/ticket-session-ws'
import { ensureSession } from '@/core/api/session-init'
import { TicketData } from '../types'
import { mapApiTicketToTicketData } from '../utils/mapApiTicket'

type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

const MAX_TICKETS = 30

const isWsDebugEnabled = process.env.NEXT_PUBLIC_WS_DEBUG === 'true'
const wsDebugLog = (...args: unknown[]) => {
  if (isWsDebugEnabled) {
    // eslint-disable-next-line no-console
    console.log('[TicketSession]', ...args)
  }
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const useTicketSession = () => {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isRequestingNext, setIsRequestingNext] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)
  const isStartedRef = useRef(false)

  const startSession = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (socketRef.current != null) {
      wsDebugLog('session already started, skipping')
      return
    }

    try {
      await ensureSession()
    } catch (err) {
      setStatus('error')
      setError('Failed to establish session')
      console.error('[TicketSession] Session login failed:', err)
      return
    }

    console.log(
      '[TicketSession] startSession() — creating WebSocket (see [WebSocket] logs for URL and auth).',
    )
    const socket = createTicketSessionWebSocket()
    wsDebugLog('creating WebSocket instance', socket)

    if (!socket) {
      setStatus('error')
      setError('WebSocket is not available in this environment')
      wsDebugLog('WebSocket is not available in this environment')
      return
    }

    isStartedRef.current = true
    socketRef.current = socket
    setStatus('connecting')
    setError(null)

    socket.onopen = () => {
      setStatus('open')
      console.log('[TicketSession] WebSocket OPEN — connection established.')
      wsDebugLog('WebSocket open')
      try {
        const uuid = generateUUID()
        socket.send(uuid)
        console.log('[TicketSession] Sent first UUID:', uuid)
        wsDebugLog('sent first UUID', uuid)
      } catch (err) {
        console.error('[TicketSession] Failed to send first UUID', err)
        wsDebugLog('failed to send first UUID', err)
      }
    }

    socket.onmessage = (event: MessageEvent) => {
      wsDebugLog('message received', event.data)
      setIsRequestingNext(false)
      try {
        const parsed = JSON.parse(event.data as string)
        const ticket = mapApiTicketToTicketData(parsed)
        if (ticket) {
          setTickets((prev) => {
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

    let lastCloseCode: number | null = null
    let lastCloseReason: string | null = null

    socket.onclose = (event: CloseEvent) => {
      lastCloseCode = event.code
      lastCloseReason = event.reason || null
      setStatus('closed')
      console.warn('[TicketSession] WebSocket closed.', {
        code: event.code,
        reason: event.reason || '(no reason)',
        wasClean: event.wasClean,
        codeHint:
          event.code === 1006
            ? '1006 = abnormal closure (often: server refused, TLS, or network)'
            : event.code === 1002
              ? '1002 = protocol error'
              : event.code === 1008
                ? '1008 = policy violation'
                : undefined,
      })
      wsDebugLog('WebSocket closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      })
    }

    socket.onerror = (event: Event) => {
      setStatus('error')
      setError('WebSocket connection error')
      console.error('[TicketSession] WebSocket error.', {
        readyState: socket.readyState,
        closeCode: lastCloseCode,
        closeReason: lastCloseReason,
        event,
        hint:
          lastCloseCode === 1006
            ? 'Connection failed before open: check URL (wss), auth cookie, and backend CORS.'
            : 'Check [TicketSession] WebSocket closed. above for code/reason.',
      })
      wsDebugLog('WebSocket error', event)
    }
  }, [])

  const requestNextTicket = useCallback(() => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      wsDebugLog('requestNextTicket: socket not open', socket?.readyState)
      return
    }
    const uuid = generateUUID()
    socket.send(uuid)
    setIsRequestingNext(true)
    wsDebugLog('sent UUID for next ticket', uuid)
  }, [])

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        const currentSocket = socketRef.current
        currentSocket.onopen = null
        currentSocket.onmessage = null
        currentSocket.onerror = null
        currentSocket.onclose = null
        if (
          currentSocket.readyState !== WebSocket.CLOSED &&
          currentSocket.readyState !== WebSocket.CLOSING
        ) {
          wsDebugLog('closing WebSocket on cleanup')
          currentSocket.close()
        }
        socketRef.current = null
      }
      isStartedRef.current = false
      setTickets([])
    }
  }, [])

  const isStarted = status !== 'idle'

  return {
    startSession,
    isStarted,
    tickets,
    status,
    error,
    requestNextTicket,
    isRequestingNext,
  }
}
