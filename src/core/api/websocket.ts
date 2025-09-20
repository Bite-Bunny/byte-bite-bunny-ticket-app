import { retrieveRawInitData } from '@telegram-apps/sdk-react'

export interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: number
}

export interface WebSocketService {
  connect: () => void
  disconnect: () => void
  send: (message: WebSocketMessage) => void
  isConnected: () => boolean
  onMessage: (callback: (message: WebSocketMessage) => void) => void
  onError: (callback: (error: Event) => void) => void
  onConnect: (callback: () => void) => void
  onDisconnect: (callback: () => void) => void
}

class WebSocketManager implements WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private initDataRaw: string | undefined
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageCallbacks: ((message: WebSocketMessage) => void)[] = []
  private errorCallbacks: ((error: Event) => void)[] = []
  private connectCallbacks: (() => void)[] = []
  private disconnectCallbacks: (() => void)[] = []
  private shouldReconnect = true

  constructor(url: string) {
    this.url = url
    // Initialize initDataRaw lazily to avoid SSR issues
    this.initDataRaw = undefined
  }

  private getInitDataRaw(): string | undefined {
    if (this.initDataRaw === undefined && typeof window !== 'undefined') {
      this.initDataRaw = retrieveRawInitData()
    }
    return this.initDataRaw
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully')
        this.reconnectAttempts = 0
        this.connectCallbacks.forEach((callback) => callback())
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.messageCallbacks.forEach((callback) => callback(message))
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.disconnectCallbacks.forEach((callback) => callback())

        if (
          this.shouldReconnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.errorCallbacks.forEach((callback) => callback(error))
      }

      // Set authorization header if initDataRaw is available
      const initDataRaw = this.getInitDataRaw()
      if (initDataRaw) {
        // Note: WebSocket doesn't support custom headers in the constructor
        // The authorization will need to be handled by the server or sent as first message
        console.log('initDataRaw available for WebSocket authorization')
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.errorCallbacks.forEach((callback) => callback(error as Event))
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(
      `Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`,
    )

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }

  disconnect(): void {
    this.shouldReconnect = false
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now(),
      }
      this.ws.send(JSON.stringify(messageWithTimestamp))
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message)
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.messageCallbacks.push(callback)
  }

  onError(callback: (error: Event) => void): void {
    this.errorCallbacks.push(callback)
  }

  onConnect(callback: () => void): void {
    this.connectCallbacks.push(callback)
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallbacks.push(callback)
  }

  // Send authorization message after connection
  sendAuthorization(): void {
    const initDataRaw = this.getInitDataRaw()
    if (initDataRaw && this.isConnected()) {
      this.send({
        type: 'authorization',
        data: {
          initDataRaw: initDataRaw,
        },
      })
    }
  }
}

// Create singleton instance lazily to avoid SSR issues
const WEBSOCKET_URL = 'ws://api.bbt-tg.xyz/api/session/'
let webSocketServiceInstance: WebSocketManager | null = null

export function getWebSocketService(): WebSocketManager {
  if (!webSocketServiceInstance && typeof window !== 'undefined') {
    webSocketServiceInstance = new WebSocketManager(WEBSOCKET_URL)
  }
  if (!webSocketServiceInstance) {
    throw new Error('WebSocket service is not available on server side')
  }
  return webSocketServiceInstance
}

// Create a safe proxy for client-side usage
function createWebSocketServiceProxy() {
  return {
    connect: () => {
      try {
        getWebSocketService().connect()
      } catch (error) {
        console.error('WebSocket connect failed:', error)
      }
    },
    disconnect: () => {
      try {
        getWebSocketService().disconnect()
      } catch (error) {
        console.error('WebSocket disconnect failed:', error)
      }
    },
    send: (message: WebSocketMessage) => {
      try {
        getWebSocketService().send(message)
      } catch (error) {
        console.error('WebSocket send failed:', error)
      }
    },
    isConnected: () => {
      try {
        return getWebSocketService().isConnected()
      } catch (error) {
        console.error('WebSocket isConnected failed:', error)
        return false
      }
    },
    onMessage: (callback: (message: WebSocketMessage) => void) => {
      try {
        getWebSocketService().onMessage(callback)
      } catch (error) {
        console.error('WebSocket onMessage failed:', error)
      }
    },
    onError: (callback: (error: Event) => void) => {
      try {
        getWebSocketService().onError(callback)
      } catch (error) {
        console.error('WebSocket onError failed:', error)
      }
    },
    onConnect: (callback: () => void) => {
      try {
        getWebSocketService().onConnect(callback)
      } catch (error) {
        console.error('WebSocket onConnect failed:', error)
      }
    },
    onDisconnect: (callback: () => void) => {
      try {
        getWebSocketService().onDisconnect(callback)
      } catch (error) {
        console.error('WebSocket onDisconnect failed:', error)
      }
    },
    sendAuthorization: () => {
      try {
        getWebSocketService().sendAuthorization()
      } catch (error) {
        console.error('WebSocket sendAuthorization failed:', error)
      }
    },
  }
}

// Export the proxy for backward compatibility
export const webSocketService = createWebSocketServiceProxy()
