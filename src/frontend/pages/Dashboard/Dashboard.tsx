import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Target, DollarSign, Users, UserCheck, RefreshCw, Activity, TrendingUp, Database } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useWebSocket, useStatsUpdates } from '../../hooks/useWebSocket'
import { StatCard } from '../../components/charts/StatCard'
import { LineChart } from '../../components/charts/LineChart'
import { PieChart } from '../../components/charts/PieChart'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import ViewModeIndicator from '../../components/common/ViewModeIndicator'

const DashboardContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  position: relative;
  
  /* Removed heavy background animation for better performance */
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg);
  }
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
    align-items: flex-start;
  }
`

const HeaderInfo = styled.div`
  h1 {
    font-size: 3rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    letter-spacing: -0.02em;
    /* Removed animation for better performance */
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.125rem;
    font-weight: 500;
    opacity: 0.9;
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`

const ConnectionStatus = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$connected ? 'var(--color-success)' : 'var(--color-danger)'};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
  
  & > * {
    animation: slideInUp 0.6s ease-out;
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
  & > *:nth-child(3) { animation-delay: 0.3s; }
  & > *:nth-child(4) { animation-delay: 0.4s; }
`

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const RecentActivity = styled(Card)`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 400px;
  overflow-y: auto;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-glass);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  transition: var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
    background: rgba(37, 99, 235, 0.05);
  }
`

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
`

const ActivityContent = styled.div`
  flex: 1;
  
  .activity-message {
    font-size: 0.9rem;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .activity-time {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
  }
`

const QuickActions = styled(Card)`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
  }
`

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`

const Dashboard: React.FC = () => {
    const {
        stats,
        logs,
        loading,
        errors,
        fetchStats,
        fetchLogs,
        refreshAll,
        lastUpdated
    } = useAppStore()

    const { isConnected } = useWebSocket()
    const [previousStats, setPreviousStats] = useState(stats)

    // Set up real-time stats updates
    useStatsUpdates((newStats) => {
        console.log('Received stats update:', newStats)
    })

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchStats(), fetchLogs()])
            } catch (error) {
                console.error('Failed to load dashboard data:', error)
            }
        }
        loadData()
    }, [fetchStats, fetchLogs])

    // Memoized trend calculation
    const getTrend = useCallback((current: number, previous: number) => {
        return current - previous
    }, [])

    // Memoized refresh handler
    const handleRefresh = useCallback(async () => {
        setPreviousStats(stats)
        await refreshAll()
    }, [stats, refreshAll])

    // Memoized chart data generation
    const trendData = useMemo(() => {
        const now = new Date()
        const data = []
        const baseValue = (stats.totalCampaigns || 0) / 24

        for (let i = 23; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
            data.push({
                timestamp,
                value: Math.floor(Math.random() * 5) + baseValue + i * 0.1,
                label: `${24 - i}:00`
            })
        }
        return data
    }, [stats.totalCampaigns])

    // Memoized pie chart data
    const revenueDistribution = useMemo(() => [
        { name: 'Operator', value: 40, color: '#2563eb' },
        { name: 'Affiliates', value: 35, color: '#1e40af' },
        { name: 'Infrastructure', value: 15, color: '#f59e0b' },
        { name: 'Development', value: 10, color: '#16a34a' }
    ], [])

    // Memoized activity icon function
    const getActivityIcon = useCallback((type: string) => {
        switch (type) {
            case 'encrypt': return '🔒'
            case 'decrypt': return '🔓'
            case 'payment_create': return '💰'
            case 'payment_paid': return '✅'
            case 'campaign': return '🎯'
            default: return '📋'
        }
    }, [])

    // Memoized time formatter
    const formatTime = useCallback((dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString()
        } catch {
            return 'Unknown'
        }
    }, [])

    // Memoized recent logs
    const recentLogs = useMemo(() => logs.slice(0, 5), [logs])

    return (
        <DashboardContainer>
            <DashboardHeader>
                <HeaderInfo>
                    <h1>
                        <Database />
                        Operations Dashboard
                    </h1>
                    <p>Real-time RaaS ecosystem monitoring</p>
                </HeaderInfo>

                <HeaderActions>
                    <ViewModeIndicator />

                    <ConnectionStatus $connected={isConnected}>
                        <span className="status-dot" />
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </ConnectionStatus>

                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        loading={loading.stats}
                        icon={<RefreshCw />}
                    >
                        Refresh
                    </Button>
                </HeaderActions>
            </DashboardHeader>

            <StatsGrid>
                <StatCard
                    title="Active Campaigns"
                    value={stats.activeCampaigns}
                    trend={getTrend(stats.activeCampaigns, previousStats.activeCampaigns)}
                    icon={<Target />}
                    loading={loading.stats}
                />

                <StatCard
                    title="Total Revenue"
                    value={stats.totalRevenue}
                    trend={getTrend(stats.totalRevenue, previousStats.totalRevenue)}
                    icon={<DollarSign />}
                    loading={loading.stats}
                    suffix=" BTC"
                />

                <StatCard
                    title="Success Rate"
                    value={`${stats.successRate}%`}
                    trend={getTrend(parseFloat(stats.successRate || '0'), parseFloat(previousStats.successRate || '0'))}
                    icon={<UserCheck />}
                    loading={loading.stats}
                />

                <StatCard
                    title="Active Targets"
                    value={stats.activeTargets}
                    trend={getTrend(stats.activeTargets, previousStats.activeTargets)}
                    icon={<Users />}
                    loading={loading.stats}
                />
            </StatsGrid>

            <StatsGrid>
                <StatCard
                    title="Total Payments"
                    value={stats.totalPayments}
                    trend={getTrend(stats.totalPayments, previousStats.totalPayments)}
                    icon={<DollarSign />}
                    loading={loading.stats}
                />

                <StatCard
                    title="Pending Payments"
                    value={stats.pendingPayments}
                    trend={getTrend(stats.pendingPayments, previousStats.pendingPayments)}
                    icon={<Target />}
                    loading={loading.stats}
                />

                <StatCard
                    title="Avg Payment"
                    value={parseFloat(stats.avgPaymentAmount).toFixed(4)}
                    trend={getTrend(parseFloat(stats.avgPaymentAmount), parseFloat(previousStats.avgPaymentAmount))}
                    icon={<TrendingUp />}
                    loading={loading.stats}
                    suffix=" BTC"
                />

                <StatCard
                    title="Network Uptime"
                    value={stats.networkUptime}
                    trend={0}
                    icon={<Activity />}
                    loading={loading.stats}
                />
            </StatsGrid>

            <ChartsSection>
                <Card>
                    <LineChart
                        data={trendData}
                        title="Campaign Activity (24 Hours)"
                        height={300}
                        color="#2563eb"
                        showGrid={true}
                        animate={false}
                    />
                </Card>

                <Card>
                    <PieChart
                        data={revenueDistribution}
                        title="Revenue Distribution"
                        height={300}
                        showLegend={true}
                        innerRadius={40}
                        animate={false}
                    />
                </Card>
            </ChartsSection>

            <ActivitySection>
                <RecentActivity>
                    <h3>
                        📋 Recent Activity
                    </h3>

                    {loading.logs ? (
                        <div>Loading activity...</div>
                    ) : errors.logs ? (
                        <div style={{ color: 'var(--color-danger)' }}>
                            Failed to load activity: {errors.logs}
                        </div>
                    ) : recentLogs.length > 0 ? (
                        <ActivityList>
                            {recentLogs.map((log) => (
                                <ActivityItem key={log.id}>
                                    <ActivityIcon>
                                        {getActivityIcon(log.type)}
                                    </ActivityIcon>
                                    <ActivityContent>
                                        <div className="activity-message">{log.message}</div>
                                        <div className="activity-time">{formatTime(log.created_at)}</div>
                                    </ActivityContent>
                                </ActivityItem>
                            ))}
                        </ActivityList>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            No recent activity
                        </div>
                    )}
                </RecentActivity>

                <QuickActions>
                    <h3>Quick Actions</h3>
                    <ActionsList>
                        <Button variant="primary" fullWidth>
                            Create Campaign
                        </Button>
                        <Button variant="secondary" fullWidth>
                            Upload File
                        </Button>
                        <Button variant="secondary" fullWidth>
                            View Network
                        </Button>
                        <Button variant="ghost" fullWidth>
                            Export Data
                        </Button>
                    </ActionsList>
                </QuickActions>
            </ActivitySection>

            {lastUpdated.stats && (
                <div
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        marginTop: 'var(--spacing-lg)'
                    }}
                >
                    Last updated: {new Date(lastUpdated.stats).toLocaleTimeString()}
                </div>
            )}
        </DashboardContainer>
    )
}

export default Dashboard