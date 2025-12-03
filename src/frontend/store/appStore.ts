import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
    SimulationStats,
    Campaign,
    Payment,
    ActivityLog,
    User
} from '../types'
import { apiService } from '../services/api'
import { websocketService } from '../services/websocket'
import { toast } from 'react-hot-toast'

interface AppStore {
    // UI State
    theme: 'light' | 'dark'
    sidebarCollapsed: boolean
    currentUser: User | null
    viewMode: 'operator' | 'affiliate' | 'victim'
    affiliateId: string | null
    victimSessionId: string | null

    // Data State
    stats: SimulationStats
    campaigns: Campaign[]
    payments: Payment[]
    logs: ActivityLog[]

    // Loading States
    loading: {
        stats: boolean
        campaigns: boolean
        payments: boolean
        logs: boolean
    }

    // Error States
    errors: {
        stats: string | null
        campaigns: string | null
        payments: string | null
        logs: string | null
    }

    // Last Updated Timestamps
    lastUpdated: {
        stats: number | null
        campaigns: number | null
        payments: number | null
        logs: number | null
    }

    // UI Actions
    setTheme: (theme: 'light' | 'dark') => void
    setSidebarCollapsed: (collapsed: boolean) => void
    setCurrentUser: (user: User | null) => void
    setViewMode: (mode: 'operator' | 'affiliate' | 'victim') => void
    setAffiliateId: (id: string | null) => void
    setVictimSessionId: (id: string | null) => void

    // Data Actions
    fetchStats: () => Promise<void>
    fetchCampaigns: () => Promise<void>
    fetchPayments: () => Promise<void>
    fetchLogs: () => Promise<void>

    // Real-time Updates
    updateStatsRealTime: (stats: Partial<SimulationStats>) => void
    addCampaign: (campaign: Campaign) => void
    updateCampaign: (id: string, updates: Partial<Campaign>) => void
    addPayment: (payment: Payment) => void
    updatePayment: (id: number, updates: Partial<Payment>) => void
    addActivityLog: (log: ActivityLog) => void

    // Utility Actions
    clearErrors: () => void
    refreshAll: () => Promise<void>
    reset: () => void
}

const initialStats: SimulationStats = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    successRate: '0',
    conversionRate: '0',
    avgPaymentAmount: '0',
    totalTargets: 0,
    activeTargets: 0,
    networkUptime: '0%',
    lastUpdate: '',
    recentActivity: []
}

const initialState = {
    // UI State
    theme: 'dark' as const,
    sidebarCollapsed: false,
    currentUser: null,
    viewMode: 'operator' as const,
    affiliateId: null,
    victimSessionId: null,

    // Data State
    stats: initialStats,
    campaigns: [],
    payments: [],
    logs: [],

    // Loading States
    loading: {
        stats: false,
        campaigns: false,
        payments: false,
        logs: false,
    },

    // Error States
    errors: {
        stats: null,
        campaigns: null,
        payments: null,
        logs: null,
    },

    // Last Updated Timestamps
    lastUpdated: {
        stats: null,
        campaigns: null,
        payments: null,
        logs: null,
    },
}

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // UI Actions
                setTheme: (theme) => set({ theme }),
                setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
                setCurrentUser: (user) => set({ currentUser: user }),
                setViewMode: (mode) => {
                    // Apply role-based theme
                    try {
                        const { applyRoleTheme } = require('../styles/roleThemes')
                        applyRoleTheme(mode)
                    } catch (error) {
                        console.warn('Failed to apply theme:', error)
                    }

                    set({ viewMode: mode })
                    // Refresh data when view mode changes
                    const { refreshAll } = get()
                    refreshAll()
                },
                setAffiliateId: (id) => set({ affiliateId: id }),
                setVictimSessionId: (id) => set({ victimSessionId: id }),

                // Data Actions
                fetchStats: async () => {
                    set(state => ({
                        loading: { ...state.loading, stats: true },
                        errors: { ...state.errors, stats: null }
                    }))

                    try {
                        const { viewMode } = get()
                        const stats = await apiService.getEnhancedStats(viewMode)
                        set(state => ({
                            stats,
                            loading: { ...state.loading, stats: false },
                            lastUpdated: { ...state.lastUpdated, stats: Date.now() }
                        }))
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch statistics'
                        set(state => ({
                            loading: { ...state.loading, stats: false },
                            errors: { ...state.errors, stats: errorMessage }
                        }))
                    }
                },

                fetchCampaigns: async () => {
                    set(state => ({
                        loading: { ...state.loading, campaigns: true },
                        errors: { ...state.errors, campaigns: null }
                    }))

                    try {
                        const { viewMode } = get()
                        const campaigns = await apiService.getCampaigns(viewMode)
                        set(state => ({
                            campaigns,
                            loading: { ...state.loading, campaigns: false },
                            lastUpdated: { ...state.lastUpdated, campaigns: Date.now() }
                        }))
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch campaigns'
                        set(state => ({
                            loading: { ...state.loading, campaigns: false },
                            errors: { ...state.errors, campaigns: errorMessage }
                        }))
                    }
                },

                fetchPayments: async () => {
                    set(state => ({
                        loading: { ...state.loading, payments: true },
                        errors: { ...state.errors, payments: null }
                    }))

                    try {
                        const { viewMode } = get()
                        const payments = await apiService.getPayments(viewMode)
                        set(state => ({
                            payments,
                            loading: { ...state.loading, payments: false },
                            lastUpdated: { ...state.lastUpdated, payments: Date.now() }
                        }))
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments'
                        set(state => ({
                            loading: { ...state.loading, payments: false },
                            errors: { ...state.errors, payments: errorMessage }
                        }))
                    }
                },

                fetchLogs: async () => {
                    set(state => ({
                        loading: { ...state.loading, logs: true },
                        errors: { ...state.errors, logs: null }
                    }))

                    try {
                        const { viewMode } = get()
                        const logs = await apiService.getLogs(viewMode)
                        set(state => ({
                            logs,
                            loading: { ...state.loading, logs: false },
                            lastUpdated: { ...state.lastUpdated, logs: Date.now() }
                        }))
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch logs'
                        set(state => ({
                            loading: { ...state.loading, logs: false },
                            errors: { ...state.errors, logs: errorMessage }
                        }))
                    }
                },

                // Real-time Updates
                updateStatsRealTime: (newStats) => {
                    set(state => ({
                        stats: { ...state.stats, ...newStats },
                        lastUpdated: { ...state.lastUpdated, stats: Date.now() }
                    }))
                },

                addCampaign: (campaign) => {
                    set(state => ({
                        campaigns: [campaign, ...state.campaigns],
                        lastUpdated: { ...state.lastUpdated, campaigns: Date.now() }
                    }))
                },

                updateCampaign: (id, updates) => {
                    set(state => ({
                        campaigns: state.campaigns.map(campaign =>
                            campaign.id === id ? { ...campaign, ...updates } : campaign
                        ),
                        lastUpdated: { ...state.lastUpdated, campaigns: Date.now() }
                    }))
                },

                addPayment: (payment) => {
                    set(state => ({
                        payments: [payment, ...state.payments],
                        lastUpdated: { ...state.lastUpdated, payments: Date.now() }
                    }))
                },

                updatePayment: (id, updates) => {
                    set(state => ({
                        payments: state.payments.map(payment =>
                            payment.id === id ? { ...payment, ...updates } : payment
                        ),
                        lastUpdated: { ...state.lastUpdated, payments: Date.now() }
                    }))
                },

                addActivityLog: (log) => {
                    set(state => ({
                        logs: [log, ...state.logs.slice(0, 199)], // Keep only latest 200 logs
                        lastUpdated: { ...state.lastUpdated, logs: Date.now() }
                    }))
                },

                // Utility Actions
                clearErrors: () => {
                    set(() => ({
                        errors: {
                            stats: null,
                            campaigns: null,
                            payments: null,
                            logs: null,
                        }
                    }))
                },

                refreshAll: async () => {
                    const { fetchStats, fetchCampaigns, fetchPayments, fetchLogs } = get()

                    try {
                        await Promise.all([
                            fetchStats(),
                            fetchCampaigns(),
                            fetchPayments(),
                            fetchLogs(),
                        ])
                        toast.success('Data refreshed successfully')
                    } catch (error) {
                        toast.error('Failed to refresh some data')
                    }
                },

                reset: () => {
                    set(initialState)
                },
            }),
            {
                name: 'raas-app-store',
                partialize: (state) => ({
                    theme: state.theme,
                    sidebarCollapsed: state.sidebarCollapsed,
                    currentUser: state.currentUser,
                    viewMode: state.viewMode,
                }),
            }
        ),
        {
            name: 'RaaS App Store',
        }
    )
)

// Set up WebSocket event listeners
websocketService.on('stats-updated', (stats) => {
    useAppStore.getState().updateStatsRealTime(stats)
})

websocketService.on('campaign-created', (campaign) => {
    useAppStore.getState().addCampaign(campaign)
})

websocketService.on('payment-updated', (payment) => {
    const { addPayment, updatePayment, payments } = useAppStore.getState()
    const existingPayment = payments.find(p => p.id === payment.id)

    if (existingPayment) {
        updatePayment(payment.id, payment)
    } else {
        addPayment(payment)
    }
})

websocketService.on('activity-logged', (log) => {
    useAppStore.getState().addActivityLog(log)
})

websocketService.on('live-activity', (activity) => {
    // Convert live activity to activity log format
    const log: ActivityLog = {
        id: Date.now(),
        type: 'campaign',
        message: activity.message,
        created_at: activity.timestamp,
        severity: 'info',
    }
    useAppStore.getState().addActivityLog(log)
})