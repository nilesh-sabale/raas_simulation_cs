import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { LoadingProvider } from './components/common/LoadingProvider'

// Import pages
import LandingPage from './pages/Landing/LandingPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Campaigns from './pages/Campaigns/Campaigns'
import Payments from './pages/Payments/Payments'
import Logs from './pages/Logs/Logs'
import NetworkPage from './pages/Network/NetworkPage'
import NotFound from './pages/NotFound/NotFound'

const AppContainer = styled.div`
  min-height: 100vh;
  background: var(--gradient-bg);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-mesh);
    opacity: 0.03;
    z-index: -2;
    animation: meshRotate 20s linear infinite;
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-glow);
    z-index: -1;
    animation: glowPulse 8s ease-in-out infinite;
  }
`

function FullApp() {
    return (
        <AppContainer>
            <ErrorBoundary>
                <LoadingProvider>
                    <Routes>
                        {/* Landing Page */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Dashboard Routes */}
                        <Route path="/app" element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="campaigns" element={<Campaigns />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="logs" element={<Logs />} />
                            <Route path="network" element={<NetworkPage />} />
                        </Route>

                        {/* 404 Page */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </LoadingProvider>
            </ErrorBoundary>
        </AppContainer>
    )
}

export default FullApp