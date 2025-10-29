import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@services/api'

interface UseApiOptions {
    immediate?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
}

interface UseApiReturn<T> {
    data: T | null
    loading: boolean
    error: Error | null
    execute: (...args: any[]) => Promise<T>
    reset: () => void
}

export function useApi<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    options: UseApiOptions = {}
): UseApiReturn<T> {
    const { immediate = false, onSuccess, onError } = options

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const execute = useCallback(async (...args: any[]): Promise<T> => {
        try {
            setLoading(true)
            setError(null)

            const result = await apiFunction(...args)
            setData(result)

            if (onSuccess) {
                onSuccess(result)
            }

            return result
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error')
            setError(error)

            if (onError) {
                onError(error)
            }

            throw error
        } finally {
            setLoading(false)
        }
    }, [apiFunction, onSuccess, onError])

    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setLoading(false)
    }, [])

    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [immediate, execute])

    return { data, loading, error, execute, reset }
}

// Specialized hooks for common API calls
export function useStats(immediate = true) {
    return useApi(apiService.getEnhancedStats, { immediate })
}

export function useCampaigns(immediate = true) {
    return useApi(apiService.getCampaigns, { immediate })
}

export function usePayments(immediate = true) {
    return useApi(apiService.getPayments, { immediate })
}

export function useLogs(immediate = true) {
    return useApi(apiService.getLogs, { immediate })
}