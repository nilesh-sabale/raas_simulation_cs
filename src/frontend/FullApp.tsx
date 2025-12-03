import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { LoadingProvider } from './components/common/LoadingProvider'

// Pages
import LandingPage from './pages/Landing/LandingPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Campaigns from './pages/Campaigns/Campaigns'
import Victims from './pages/Victims/Victims'
import Payments from './pages/Payments/Payments'
import Logs from './pages/Logs/Logs'
import NetworkPage from './pages/Network/NetworkPage'
import Timeline from './pages/Timeline/Timeline'
import Defense from './pages/Defense/Defense'
import Settings from './pages/Settings/Settings'
import NotFound from './pages/NotFound/NotFound'

// Role-specific pages
import VictimPortal from './pages/VictimPortal/VictimPortal'
import AffiliateDashboard from './pages/Affiliate/AffiliateDashboard'

const AppContainer = styled.div`
  min-height: 100vh;
  background: var(--gradient-bg);
  position: relative;
  
  /* Reduced opacity and removed heavy animations for better performance */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-mesh);
    opacity: 0.01;
    z-index: -2;
    /* Removed animation for better performance */
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-glow);
    opacity: 0.05;
    z-index: -1;
    /* Removed animation for better performance */
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

                        {/* Victim Portal - Full screen experience */}
                        <Route path="/victim-portal" element={<VictimPortal />} />

                        {/* Dashboard Routes */}
                        <Route path="/app" element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="affiliate" element={<AffiliateDashboard />} />
                            <Route path="campaigns" element={<Campaigns />} />
                            <Route path="victims" element={<Victims />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="logs" element={<Logs />} />
                            <Route path="analytics/network" element={<NetworkPage />} />
                            <Route path="analytics/timeline" element={<Timeline />} />
                            <Route path="defense" element={<Defense />} />
                            <Route path="settings" element={<Settings />} />
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