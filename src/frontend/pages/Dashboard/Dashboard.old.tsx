import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Target, DollarSign, Users, UserCheck, RefreshCw, Activity, TrendingUp } from 'lucide-react'
import { useAppStore } from '@store/appStore'
import { useWebSocket, useStatsUpdates } from '@hooks/useWebSocket'
import { StatCard } from '@components/charts/StatCard'
import { LineChart } from '@components/charts/LineChart'
import { PieChart } from '@components/charts/PieChart'
import { Button } from '@components/common/Button'
import { Card } from '@components/common/Card'

const DashboardContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  background: var(--gradient-bg);
  position: relative;
  
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
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 400;
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
    animation: ${props => props.$connected ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`

const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
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
  transition: var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
    background: rgba(0, 255, 136, 0.05);
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

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
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

  // Load initial data with error handling and debouncing
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStats(), fetchLogs()])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }

    // Debounce the initial load
    const timeoutId = setTimeout(loadData, 100)
    return () => clearTimeout(timeoutId)
  }, [fetchStats, fetchLogs])

  // Calculate trends
  const getTrend = (current: number, previous: number) => {
    return current - previous
  }

  const handleRefresh = async () => {
    setPreviousStats(stats)
    await refreshAll()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'encrypt': return '🔒'
      case 'decrypt': return '🔓'
      case 'payment_create': return '💰'
      case 'payment_paid': return '✅'
      case 'campaign': return '🎯'
      default: return '📋'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString()
    } catch {
      return 'Unknown'
    }
  }

  const recentLogs = logs.slice(0, 5)

  // Generate sample chart data with memoization for performance
  const generateTrendData = React.useMemo(() => {
    const now = new Date()
    const data = []
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
      data.push({
        timestamp,
        value: Math.floor(Math.random() * 10) + (stats.totalCampaigns || 0) / 24,
        label: `Hour ${24 - i}`
      })
    }
    return data
  }, [stats.totalCampaigns])

  const revenueDistribution = [
    { name: 'Operator', value: 40, color: '#00ff88' },
    { name: 'Affiliates', value: 35, color: '#00cc6a' },
    { name: 'Infrastructure', value: 15, color: '#ffaa00' },
    { name: 'Development', value: 10, color: '#00aaff' }
  ]

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderInfo>
          <h1>Operations Dashboard</h1>
          <p>Real-time RaaS ecosystem simulation</p>
        </HeaderInfo>

        <HeaderActions>
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
          icon={<Users />}
          loading={loading.stats}
          suffix=" BTC"
        />

        <StatCard
          title="Network Uptime"
          value={stats.networkUptime}
          trend={0}
          icon={<UserCheck />}
          loading={loading.stats}
        />
      </StatsGrid>

      <ChartsSection>
        <Card>
          <LineChart
            data={generateTrendData}
            title="Campaign Activity (24 Hours)"
            height={300}
            color="#00ff88"
            showGrid={true}
            animate={true}
          />
        </Card>

        <Card>
          <PieChart
            data={revenueDistribution}
            title="Revenue Distribution"
            height={300}
            showLegend={true}
            innerRadius={40}
            animate={true}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginTop: 'var(--spacing-lg)'
          }}
        >
          Last updated: {new Date(lastUpdated.stats).toLocaleTimeString()}
        </motion.div>
      )}
    </DashboardContainer>
  )
}

export default Dashboard