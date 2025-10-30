import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import {
    SimulationStats,
    Campaign,
    Payment,
    ActivityLog,
    ApiError,
    CampaignFormData
} from '../types'

class ApiService {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: '/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add any auth headers or request modifications here
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response
            },
            (error: AxiosError) => {
                this.handleError(error)
                return Promise.reject(error)
            }
        )
    }

    private handleError(error: AxiosError) {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            status: error.response?.status || 500,
        }

        if (error.response?.data) {
            const data = error.response.data as any
            apiError.message = data.message || data.error || apiError.message
            apiError.code = data.code || apiError.code
        } else if (error.request) {
            apiError.message = 'Network error - please check your connection'
            apiError.code = 'NETWORK_ERROR'
        }

        // Show user-friendly error messages
        switch (apiError.code) {
            case 'NETWORK_ERROR':
                toast.error('Connection failed. Please check your network.')
                break
            case 'db_error':
                toast.error('Database connection issue. Some features may be limited.')
                break
            default:
                if (apiError.status >= 500) {
                    toast.error('Server error. Please try again later.')
                } else if (apiError.status >= 400) {
                    toast.error(apiError.message)
                }
        }

        console.error('API Error:', apiError)
    }

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        const response = await this.client.get('/health')
        return response.data
    }

    // Statistics
    async getStats(viewMode?: string): Promise<SimulationStats> {
        const params = viewMode ? { view_mode: viewMode } : {}
        const response = await this.client.get('/stats', { params })
        return response.data
    }

    async getEnhancedStats(viewMode?: string): Promise<SimulationStats> {
        const params = viewMode ? { view_mode: viewMode } : {}
        const response = await this.client.get('/stats', { params })
        return response.data
    }

    // Campaigns
    async getCampaigns(viewMode?: string): Promise<Campaign[]> {
        const params = viewMode ? { view_mode: viewMode } : {}
        const response = await this.client.get('/campaigns', { params })
        return response.data
    }

    async createCampaign(campaignData: CampaignFormData): Promise<{ id: string; success: boolean }> {
        const response = await this.client.post('/campaigns', campaignData)
        return response.data
    }

    async getCampaign(id: string): Promise<Campaign> {
        const response = await this.client.get(`/campaigns/${id}`)
        return response.data
    }

    async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
        const response = await this.client.put(`/campaigns/${id}`, updates)
        return response.data
    }

    async deleteCampaign(id: string): Promise<{ success: boolean }> {
        const response = await this.client.delete(`/campaigns/${id}`)
        return response.data
    }

    // Payments
    async getPayments(viewMode?: string): Promise<Payment[]> {
        const params = viewMode ? { view_mode: viewMode } : {}
        const response = await this.client.get('/payments', { params })
        return response.data
    }

    async createPayment(victim: string, amount: number): Promise<Payment> {
        const response = await this.client.post('/payment/create', { victim, amount })
        return response.data
    }

    async markPaymentPaid(id: number): Promise<{ success: boolean }> {
        const response = await this.client.post(`/payments/${id}/pay`)
        return response.data
    }

    // Activity Logs
    async getLogs(viewMode?: string): Promise<ActivityLog[]> {
        const params = viewMode ? { view_mode: viewMode } : {}
        const response = await this.client.get('/logs', { params })
        return response.data
    }

    async getLiveActivity(): Promise<ActivityLog[]> {
        try {
            const response = await this.client.get('/activity/live')
            return response.data
        } catch (error) {
            // Fallback to regular logs if live endpoint fails
            return this.getLogs()
        }
    }

    // Encryption/Decryption
    async encryptFile(formData: FormData, victimId?: string): Promise<{
        method: string
        encoded: string
        ransom: {
            payment_id: number
            amount: string
            address: string
            victim: string
        }
    }> {
        const headers: Record<string, string> = {
            'Content-Type': 'multipart/form-data',
        }

        if (victimId) {
            headers['X-Victim-Id'] = victimId
        }

        const response = await this.client.post('/encrypt', formData, { headers })
        return response.data
    }

    async decryptContent(method: string, content: string, shift?: number): Promise<{ decoded: string }> {
        const response = await this.client.post('/decrypt', {
            method,
            content,
            shift: shift || 3,
        })
        return response.data
    }

    // Retry mechanism for failed requests
    async retryRequest<T>(
        requestFn: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await requestFn()
            } catch (error) {
                lastError = error as Error

                if (attempt === maxRetries) {
                    throw lastError
                }

                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
            }
        }

        throw lastError!
    }

    // Batch requests
    async batchRequest<T>(requests: (() => Promise<T>)[]): Promise<(T | Error)[]> {
        const results = await Promise.allSettled(requests.map(req => req()))

        return results.map(result =>
            result.status === 'fulfilled' ? result.value : new Error(result.reason)
        )
    }
}

// Create singleton instance
export const apiService = new ApiService()

// Export individual methods for convenience
export const {
    healthCheck,
    getStats,
    getEnhancedStats,
    getCampaigns,
    createCampaign,
    getCampaign,
    updateCampaign,
    deleteCampaign,
    getPayments,
    createPayment,
    markPaymentPaid,
    getLogs,
    getLiveActivity,
    encryptFile,
    decryptContent,
    retryRequest,
    batchRequest,
} = apiService