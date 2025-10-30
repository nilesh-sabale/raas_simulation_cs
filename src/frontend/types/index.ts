// Core simulation data types
export interface SimulationStats {
    totalCampaigns: number
    activeCampaigns: number
    totalPayments: number
    paidPayments: number
    pendingPayments: number
    totalRevenue: number
    successRate: string
    conversionRate: string
    avgPaymentAmount: string
    totalTargets: number
    activeTargets: number
    networkUptime: string
    lastUpdate: string
    recentActivity?: ActivityLog[]
}

export interface Campaign {
    id: string
    name: string
    description: string
    sector: string
    size: string
    amount: number
    deadline: number
    encryption_method: string
    affiliate_id: string
    status: 'active' | 'paused' | 'completed' | 'stopped'
    created_at: string
    affiliate_name?: string
}

export interface Payment {
    id: number
    victim: string
    amount: number
    paid: boolean
    paid_at?: string
    created_at: string
    campaign_id?: string
    address: string
    campaign_name?: string
}

export interface ActivityLog {
    id: number
    type: 'encrypt' | 'decrypt' | 'payment_create' | 'payment_paid' | 'campaign' | 'affiliate'
    message: string
    created_at: string
    severity?: 'low' | 'medium' | 'high' | 'info'
}

// UI State types
export interface User {
    id: string
    role: 'operator' | 'affiliate' | 'victim'
    name: string
}

export interface AppState {
    currentUser: User | null
    theme: 'light' | 'dark'
    sidebarCollapsed: boolean
    notifications: Notification[]
}

export interface DashboardState {
    stats: SimulationStats
    recentActivity: ActivityLog[]
    campaigns: Campaign[]
    payments: Payment[]
    loading: boolean
    error: string | null
}

// API Response types
export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
}

export interface ApiError {
    message: string
    code: string
    status: number
}

// WebSocket event types
export interface WebSocketEvents {
    'stats-updated': SimulationStats
    'campaign-created': Campaign
    'payment-updated': Payment
    'activity-logged': ActivityLog
    'live-activity': { message: string; timestamp: string }
}

// Chart data types
export interface ChartDataPoint {
    timestamp: string
    value: number
    label?: string
}

export interface NetworkNode {
    id: string
    type: 'operator' | 'affiliate' | 'victim'
    x?: number
    y?: number
    connections?: string[]
}

export interface NetworkLink {
    source: string
    target: string
    strength?: number
}

// Form types
export interface CampaignFormData {
    name: string
    description: string
    sector: string
    targetSize: number
    ransomAmount: number
    deadline: string
    encryptionMethod: string
    affiliateId: string
}

export interface EncryptionFormData {
    method: 'base64' | 'caesar'
    shift?: number
    file: File
}

// Component prop types
export interface StatCardProps {
    title: string
    value: number | string
    trend?: number
    icon: React.ReactNode
    loading?: boolean
    onClick?: () => void
}

export interface ChartProps {
    data: ChartDataPoint[]
    type: 'line' | 'bar' | 'pie' | 'area'
    height?: number
    realTime?: boolean
    title?: string
}

// Theme types
export interface Theme {
    colors: {
        primary: string
        secondary: string
        accent: string
        danger: string
        warning: string
        info: string
        success: string
        background: {
            primary: string
            secondary: string
            tertiary: string
            card: string
            glass: string
        }
        text: {
            primary: string
            secondary: string
            muted: string
            accent: string
        }
        border: string
        shadow: string
    }
    breakpoints: {
        mobile: string
        tablet: string
        desktop: string
        wide: string
    }
    spacing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        xxl: string
    }
    borderRadius: {
        sm: string
        md: string
        lg: string
        xl: string
    }
    transitions: {
        fast: string
        normal: string
        slow: string
    }
}