import { io, Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { WebSocketEvents } from '../types'

class WebSocketService {
    private socket: Socket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private isConnecting = false
    private eventListeners: Map<string, Set<Function>> = new Map()

    constructor() {
        this.connect()
    }

    private connect() {
        if (this.isConnecting || this.socket?.connected) {
            return
        }

        this.isConnecting = true

        try {
            this.socket = io({
                transports: ['websocket', 'polling'],
                timeout: 30000,
                forceNew: true,
            })

            this.setupEventHandlers()
        } catch (error) {
            console.error('Failed to create socket connection:', error)
            this.isConnecting = false
            this.scheduleReconnect()
        }
    }

    private setupEventHandlers() {
        if (!this.socket) return

        this.socket.on('connect', () => {
            console.log('WebSocket connected:', this.socket?.id)
            this.isConnecting = false
            this.reconnectAttempts = 0

            // Join dashboard room for real-time updates
            this.socket?.emit('join-dashboard')

            toast.success('Connected to real-time updates', {
                duration: 2000,
                position: 'bottom-right',
            })
        })

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason)

            if (reason === 'io server disconnect') {
                // Server initiated disconnect, reconnect manually
                this.scheduleReconnect()
            }

            toast.error('Lost connection to server', {
                duration: 3000,
                position: 'bottom-right',
            })
        })

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error)
            this.isConnecting = false
            this.scheduleReconnect()
        })

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('WebSocket reconnected after', attemptNumber, 'attempts')
            this.reconnectAttempts = 0

            toast.success('Reconnected to server', {
                duration: 2000,
                position: 'bottom-right',
            })
        })

        this.socket.on('reconnect_error', (error) => {
            console.error('WebSocket reconnection failed:', error)
        })

        // Set up event forwarding to registered listeners
        this.setupEventForwarding()
    }

    private setupEventForwarding() {
        if (!this.socket) return

        // Forward all registered events to their listeners
        const events: (keyof WebSocketEvents)[] = [
            'stats-updated',
            'campaign-created',
            'payment-updated',
            'activity-logged',
            'live-activity',
        ]

        events.forEach(event => {
            this.socket?.on(event, (data) => {
                const listeners = this.eventListeners.get(event)
                if (listeners) {
                    listeners.forEach(listener => {
                        try {
                            listener(data)
                        } catch (error) {
                            console.error(`Error in ${event} listener:`, error)
                        }
                    })
                }
            })
        })
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached')
            toast.error('Unable to connect to server. Please refresh the page.', {
                duration: 0, // Don't auto-dismiss
                position: 'bottom-right',
            })
            return
        }

        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
        this.reconnectAttempts++

        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`)

        setTimeout(() => {
            if (!this.socket?.connected) {
                this.connect()
            }
        }, delay)
    }

    // Public methods for event handling
    on<K extends keyof WebSocketEvents>(
        event: K,
        listener: (data: WebSocketEvents[K]) => void
    ): () => void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set())
        }

        const listeners = this.eventListeners.get(event)!
        listeners.add(listener)

        // Return unsubscribe function
        return () => {
            listeners.delete(listener)
            if (listeners.size === 0) {
                this.eventListeners.delete(event)
            }
        }
    }

    off<K extends keyof WebSocketEvents>(
        event: K,
        listener?: (data: WebSocketEvents[K]) => void
    ): void {
        if (!listener) {
            // Remove all listeners for this event
            this.eventListeners.delete(event)
            return
        }

        const listeners = this.eventListeners.get(event)
        if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
                this.eventListeners.delete(event)
            }
        }
    }

    emit(event: string, data?: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data)
        } else {
            console.warn('Cannot emit event - socket not connected:', event)
        }
    }

    // Connection status
    get isConnected(): boolean {
        return this.socket?.connected || false
    }

    get connectionId(): string | undefined {
        return this.socket?.id
    }

    // Manual reconnection
    reconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket.connect()
        } else {
            this.connect()
        }
    }

    // Cleanup
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
        this.eventListeners.clear()
        this.reconnectAttempts = 0
        this.isConnecting = false
    }

    // Health check
    ping(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.socket?.connected) {
                reject(new Error('Socket not connected'))
                return
            }

            const startTime = Date.now()

            this.socket.emit('ping', startTime, () => {
                const latency = Date.now() - startTime
                resolve(latency)
            })

            // Timeout after 5 seconds
            setTimeout(() => {
                reject(new Error('Ping timeout'))
            }, 5000)
        })
    }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// Export for convenience
export default websocketService