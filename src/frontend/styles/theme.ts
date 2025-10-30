import { Theme } from '../types'

export const theme: Theme = {
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        success: '#10b981',
        background: {
            primary: '#0a0a0f',
            secondary: '#111827',
            tertiary: '#1f2937',
            card: 'rgba(31, 41, 55, 0.8)',
            glass: 'rgba(17, 24, 39, 0.7)',
        },
        text: {
            primary: '#f9fafb',
            secondary: '#d1d5db',
            muted: '#9ca3af',
            accent: '#6366f1',
        },
        border: '#374151',
        shadow: 'rgba(0, 0, 0, 0.6)',
    },
    breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem',
    },
    borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
    },
    transitions: {
        fast: '0.15s ease-out',
        normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '0.5s ease-in-out',
    },
}

// CSS Custom Properties for global use
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-danger: ${theme.colors.danger};
    --color-warning: ${theme.colors.warning};
    --color-info: ${theme.colors.info};
    --color-success: ${theme.colors.success};
    
    /* Backgrounds */
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};
    --bg-card: ${theme.colors.background.card};
    --bg-glass: ${theme.colors.background.glass};
    
    /* Text */
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.muted};
    --text-accent: ${theme.colors.text.accent};
    
    /* Borders & Shadows */
    --border: ${theme.colors.border};
    --shadow: ${theme.colors.shadow};
    --border-glow: rgba(0, 255, 136, 0.3);
    --shadow-glow: rgba(0, 255, 136, 0.2);
    
    /* Modern Gradients */
    --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    --gradient-secondary: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    --gradient-accent: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    --gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
    --gradient-bg: #0a0a0f; /* Simplified for better performance */
    --gradient-card: rgba(31, 41, 55, 0.9); /* Simplified for better performance */
    --gradient-glow: rgba(99, 102, 241, 0.05); /* Simplified for better performance */
    --gradient-mesh: rgba(99, 102, 241, 0.02); /* Simplified for better performance */
    
    /* Smooth Animations */
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Modern Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
    
    /* Layout */
    --sidebar-width: 200px;
    --header-height: 80px;
    
    /* Spacing */
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --spacing-xxl: ${theme.spacing.xxl};
    
    /* Border Radius */
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    
    /* Transitions */
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
    --transition-slow: ${theme.transitions.slow};
  }
`