const TICKET_SESSION_WS_HOST = 'api.bbt-tg.xyz/api/session/'

function getTicketSessionWsUrl(): string {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WS_SESSION_URL) {
    return process.env.NEXT_PUBLIC_WS_SESSION_URL
  }
  return `wss://${TICKET_SESSION_WS_HOST}`
}

/**
 * Creates the ticket-session WebSocket. Call ensureSession() before this
 * so the server has set cookies via POST /api/session/login. The browser
 * sends those cookies automatically with the WebSocket to the same origin.
 */
export function createTicketSessionWebSocket(): WebSocket | null {
  if (typeof window === 'undefined') return null

  try {
    return new WebSocket(getTicketSessionWsUrl())
  } catch {
    return null
  }
}
