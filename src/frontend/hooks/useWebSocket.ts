import { useEffect, useRef, useCallback } from 'react'
import { websocketService } from '../services/websocket'
import { WebSocketEvents } from '../types'

export function useWebSocket() {
    const isConnected = websocketService.isConnected
    const connectionId = websocketService.connectionId

    const reconnect = useCallback(() => {
        websocketService.reconnect()
    }, [])

    const ping = useCallback(async () => {
        try {
            const latency = await websocketService.ping()
            return latency
        } catch (error) {
            console.error('Ping failed:', error)
            return null
        }
    }, [])

    return {
        isConnected,
        connectionId,
        reconnect,
        ping,
    }
}

export function useWebSocketEvent<K extends keyof WebSocketEvents>(
    event: K,
    handler: (data: WebSocketEvents[K]) => void,
    deps: React.DependencyList = []
) {
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    useEffect(() => {
        const unsubscribe = websocketService.on(event, (data) => {
            handlerRef.current(data)
        })

        return unsubscribe
    }, [event, ...deps])
}

// Specialized hooks for common WebSocket events
export function useStatsUpdates(handler: (stats: WebSocketEvents['stats-updated']) => void) {
    useWebSocketEvent('stats-updated', handler)
}

export function useCampaignUpdates(handler: (campaign: WebSocketEvents['campaign-created']) => void) {
    useWebSocketEvent('campaign-created', handler)
}

export function usePaymentUpdates(handler: (payment: WebSocketEvents['payment-updated']) => void) {
    useWebSocketEvent('payment-updated', handler)
}

export function useActivityUpdates(handler: (log: WebSocketEvents['activity-logged']) => void) {
    useWebSocketEvent('activity-logged', handler)
}

export function useLiveActivity(handler: (activity: WebSocketEvents['live-activity']) => void) {
    useWebSocketEvent('live-activity', handler)
}