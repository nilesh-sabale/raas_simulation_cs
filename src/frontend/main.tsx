import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Toaster } from 'react-hot-toast'

import App from './App'
import { GlobalStyles } from '@styles/GlobalStyles'
import { theme } from '@styles/theme'

// Remove React.StrictMode in production for better performance
const isDevelopment = (import.meta as any).env?.DEV || false

const AppWrapper = () => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                    },
                }}
            />
        </ThemeProvider>
    </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    isDevelopment ? (
        <React.StrictMode>
            <AppWrapper />
        </React.StrictMode>
    ) : (
        <AppWrapper />
    )
)