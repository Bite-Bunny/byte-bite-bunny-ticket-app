import { getAuthHeader } from './instance'

const WS_HOST_PATH = 'api.bbt-tg.xyz/api/session/'

/**
 * Resolve WebSocket URL. Uses wss when the page is HTTPS (avoids mixed-content / 1006);
 * otherwise ws. Override with NEXT_PUBLIC_WS_SESSION_URL if needed.
 */
function getSessionWebSocketUrl(): string {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WS_SESSION_URL) {
    return process.env.NEXT_PUBLIC_WS_SESSION_URL
  }
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${WS_HOST_PATH}`
  }
  return `ws://${WS_HOST_PATH}`
}

/** Redact auth query param for safe console logging */
function getUrlForLogging(url: URL): string {
  const u = new URL(url.toString())
  if (u.searchParams.has('auth')) {
    u.searchParams.set('auth', '[REDACTED]')
  }
  return u.toString()
}

/**
 * Creates an authenticated WebSocket connection to the ticket session endpoint.
 * Browser WebSockets cannot set custom headers, so the same Authorization value
 * used by Axios is passed as a query parameter for the backend to validate.
 */
export const createSessionWebSocket = (): WebSocket | null => {
  if (typeof window === 'undefined') {
    console.warn(
      '[WebSocket] Cannot create socket: not in browser (window is undefined)',
    )
    return null
  }

  const baseUrl = getSessionWebSocketUrl()
  const url = new URL(baseUrl)
  const authHeader = getAuthHeader()

  if (authHeader) {
    url.searchParams.set('auth', authHeader)
    console.log(
      '[WebSocket] Connecting with auth (query param). URL:',
      getUrlForLogging(url),
    )
  } else {
    console.warn(
      '[WebSocket] Connecting WITHOUT auth — getAuthHeader() returned nothing. URL:',
      getUrlForLogging(url),
    )
  }

  try {
    const ws = new WebSocket(url.toString())
    console.log(
      '[WebSocket] Socket created, readyState:',
      ws.readyState,
      '(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)',
    )
    return ws
  } catch (err) {
    console.error('[WebSocket] Failed to create WebSocket:', err)
    return null
  }
}
