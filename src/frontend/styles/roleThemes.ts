/**
 * Role-based theme configuration for RaaS simulation
 * Each role has distinct color schemes and visual identity
 */

export interface RoleTheme {
    name: string
    primary: string
    secondary: string
    accent: string
    background: string
    backgroundSecondary: string
    backgroundTertiary: string
    text: string
    textSecondary: string
    textMuted: string
    border: string
    success: string
    warning: string
    danger: string
    gradient: string
    gradientGlow: string
    shadow: string
}

export const victimTheme: RoleTheme = {
    name: 'victim',
    // Dark, threatening red theme for panic/urgency
    primary: '#ff4444',
    secondary: '#cc0000',
    accent: '#ff6b6b',
    background: '#0a0000',
    backgroundSecondary: '#1a0000',
    backgroundTertiary: '#2a0505',
    text: '#ffffff',
    textSecondary: '#ffcccc',
    textMuted: '#ff8888',
    border: '#ff4444',
    success: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff0000',
    gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    gradientGlow: 'radial-gradient(circle at 50% 50%, rgba(255, 68, 68, 0.3) 0%, transparent 70%)',
    shadow: 'rgba(255, 68, 68, 0.4)'
}

export const affiliateTheme: RoleTheme = {
    name: 'affiliate',
    // Professional purple/blue for business/earnings focus
    primary: '#8b5cf6',
    secondary: '#6d28d9',
    accent: '#a78bfa',
    background: '#0a0a0f',
    backgroundSecondary: '#14141f',
    backgroundTertiary: '#1e1e2f',
    text: '#ffffff',
    textSecondary: '#c4b5fd',
    textMuted: '#a78bfa',
    border: '#8b5cf6',
    success: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    gradientGlow: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    shadow: 'rgba(139, 92, 246, 0.4)'
}

export const operatorTheme: RoleTheme = {
    name: 'operator',
    // Green/cyan command & control aesthetic
    primary: '#00ff88',
    secondary: '#00cc6a',
    accent: '#33ffaa',
    background: '#0a0a0a',
    backgroundSecondary: '#141414',
    backgroundTertiary: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#ccffee',
    textMuted: '#88ffcc',
    border: '#00ff88',
    success: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    gradientGlow: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.3) 0%, transparent 70%)',
    shadow: 'rgba(0, 255, 136, 0.4)'
}

export const roleThemes = {
    victim: victimTheme,
    affiliate: affiliateTheme,
    operator: operatorTheme
}

export type RoleName = keyof typeof roleThemes

/**
 * Apply role theme to CSS custom properties
 */
export const applyRoleTheme = (role: RoleName) => {
    const theme = roleThemes[role]
    const root = document.documentElement

    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--bg-primary', theme.background)
    root.style.setProperty('--bg-secondary', theme.backgroundSecondary)
    root.style.setProperty('--bg-tertiary', theme.backgroundTertiary)
    root.style.setProperty('--text-primary', theme.text)
    root.style.setProperty('--text-secondary', theme.textSecondary)
    root.style.setProperty('--text-muted', theme.textMuted)
    root.style.setProperty('--border', theme.border)
    root.style.setProperty('--color-success', theme.success)
    root.style.setProperty('--color-warning', theme.warning)
    root.style.setProperty('--color-danger', theme.danger)
    root.style.setProperty('--gradient-primary', theme.gradient)
    root.style.setProperty('--gradient-glow', theme.gradientGlow)
    root.style.setProperty('--shadow-glow', theme.shadow)
}

/**
 * Get role-specific messaging and labels
 */
export const getRoleContext = (role: RoleName) => {
    switch (role) {
        case 'victim':
            return {
                dashboardTitle: 'Ransom Portal',
                greeting: 'Your Files Have Been Encrypted',
                description: 'Follow the instructions below to recover your data'
            }
        case 'affiliate':
            return {
                dashboardTitle: 'Affiliate Dashboard',
                greeting: 'Welcome Back, Partner',
                description: 'Track your earnings and campaign performance'
            }
        case 'operator':
            return {
                dashboardTitle: 'Operations Dashboard',
                greeting: 'System Control Center',
                description: 'Monitor all affiliate activity and infrastructure'
            }
    }
}
