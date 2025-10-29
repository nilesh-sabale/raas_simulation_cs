import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Toaster } from 'react-hot-toast'

import FullApp from './FullApp'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'

// Remove React.StrictMode in production for better performance
const isDevelopment = (import.meta as any).env?.DEV || false

const AppWrapper = () => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FullApp />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(31, 41, 55, 0.9)',
                        color: '#f9fafb',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
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