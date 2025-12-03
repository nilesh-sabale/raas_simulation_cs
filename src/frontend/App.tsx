import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { LoadingProvider } from './components/common/LoadingProvider'

// Pages
import LandingPage from './pages/Landing/LandingPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Campaigns from './pages/Campaigns/Campaigns'
import Analytics from './pages/Analytics/Analytics'
import Victims from './pages/Victims/Victims'
import Payments from './pages/Payments/Payments'
import Logs from './pages/Logs/Logs'
import Settings from './pages/Settings/Settings'
import NotFound from './pages/NotFound/NotFound'

// Role-specific pages
import VictimPortal from './pages/VictimPortal/VictimPortal'
import AffiliateDashboard from './pages/Affiliate/AffiliateDashboard'

function App() {
    return (
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
                        <Route path="campaigns/*" element={<Campaigns />} />
                        <Route path="analytics/*" element={<Analytics />} />
                        <Route path="victims" element={<Victims />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="logs" element={<Logs />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </LoadingProvider>
        </ErrorBoundary>
    )
}

export default App