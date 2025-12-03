import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Target,
    Users,
    Trophy,
    Wallet,
    CheckCircle
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { StatCard } from '../../components/charts/StatCard'
import { LineChart } from '../../components/charts/LineChart'
import { PieChart } from '../../components/charts/PieChart'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { toast } from 'react-hot-toast'

const AffiliateDashboardContainer = styled.div`
    padding: var(--spacing-xl);
    min-height: calc(100vh - var(--header-height));
    background: var(--gradient-bg);
    
    @media (max-width: 768px) {
        padding: var(--spacing-lg);
    }
`

const DashboardHeader = styled.div`
    margin-bottom: var(--spacing-xxl);
    
    h1 {
        font-size: 3rem;
        font-weight: 800;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: var(--spacing-sm);
    }
    
    .subtitle {
        color: var(--text-secondary);
        font-size: 1.125rem;
    }
    
    .affiliate-id {
        color: var(--color-primary);
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
    }
`

const EarningsHighlight = styled(motion.div)`
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xxl);
    margin-bottom: var(--spacing-xxl);
    text-align: center;
    box-shadow: 0 20px 60px var(--shadow-glow);
    
    .label {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: var(--spacing-md);
    }
    
    .amount {
        font-size: 4rem;
        font-weight: 800;
        color: #ffffff;
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: var(--spacing-md);
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        
        @media (max-width: 768px) {
            font-size: 2.5rem;
        }
    }
    
    .change {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
    }
`

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xxl);
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

const LeaderboardSection = styled(Card)`
    h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        
        svg {
            color: var(--color-primary);
        }
    }
`

const LeaderboardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
`

const LeaderboardItem = styled(motion.div) <{ rank: number }>`
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-glass);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    transition: var(--transition-normal);
    
    ${props => props.rank === 1 && `
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
        border-color: #ffd700;
    `}
    
    ${props => props.rank === 2 && `
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%);
        border-color: #c0c0c0;
    `}
    
    ${props => props.rank === 3 && `
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.1) 0%, rgba(205, 127, 50, 0.05) 100%);
        border-color: #cd7f32;
    `}
    
    &:hover {
        transform: translateX(5px);
        border-color: var(--color-primary);
    }
    
    .rank {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-primary);
        min-width: 40px;
        text-align: center;
        
        ${props => props.rank === 1 && 'color: #ffd700;'}
        ${props => props.rank === 2 && 'color: #c0c0c0;'}
        ${props => props.rank === 3 && 'color: #cd7f32;'}
    }
    
    .info {
        flex: 1;
        
        .name {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: var(--spacing-xs);
        }
        
        .stats {
            font-size: 0.875rem;
            color: var(--text-muted);
        }
    }
    
    .earnings {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--color-primary);
    }
`

const CampaignsSection = styled(Card)`
    h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
    }
`

const CampaignsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
`

const CampaignCard = styled.div`
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: var(--transition-normal);
    
    &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 10px 30px var(--shadow-glow);
    }
    
    .campaign-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: var(--spacing-md);
        
        .campaign-name {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .campaign-status {
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            background: rgba(0, 255, 136, 0.2);
            color: var(--color-success);
        }
    }
    
    .campaign-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }
    
    .stat {
        .stat-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: var(--spacing-xs);
        }
        
        .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
        }
    }
`

const PayoutSection = styled(Card)`
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%);
    border: 2px solid var(--color-primary);
    
    h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
    
    .payout-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
        
        @media (max-width: 768px) {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: stretch;
        }
    }
    
    .available-balance {
        .label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-bottom: var(--spacing-xs);
        }
        
        .amount {
            font-size: 2rem;
            font-weight: 800;
            color: var(--color-primary);
            font-family: 'JetBrains Mono', monospace;
        }
    }
`

const AffiliateDashboard: React.FC = () => {
    const { setViewMode, setAffiliateId, affiliateId } = useAppStore()
    const [requestingPayout, setRequestingPayout] = useState(false)

    // Mock affiliate data
    const [affiliateData] = useState({
        id: affiliateId || 'AFF-001',
        name: 'CyberPhantom',
        totalEarnings: 2.8934,
        monthlyEarnings: 0.4521,
        successRate: 92.3,
        activeCampaigns: 3,
        totalCampaigns: 8,
        conversions: 23,
        rank: 2
    })

    const [leaderboard] = useState([
        { rank: 1, name: 'DarkNet_King', earnings: 3.2145, campaigns: 15, successRate: 89.7 },
        { rank: 2, name: 'CyberPhantom', earnings: 2.8934, campaigns: 8, successRate: 92.3 },
        { rank: 3, name: 'Shadow_Broker', earnings: 2.4567, campaigns: 12, successRate: 85.5 },
        { rank: 4, name: 'Ghost_Hacker', earnings: 2.1098, campaigns: 10, successRate: 88.7 },
        { rank: 5, name: 'NightShade', earnings: 1.8765, campaigns: 7, successRate: 84.2 },
    ])

    const [campaigns] = useState([
        {
            id: '1',
            name: 'Corporate Takedown',
            sector: 'Finance',
            status: 'active',
            targets: 25,
            infected: 18,
            paid: 12,
            revenue: 0.25
        },
        {
            id: '2',
            name: 'Operation Blackout',
            sector: 'Healthcare',
            status: 'active',
            targets: 50,
            infected: 35,
            paid: 20,
            revenue: 0.15
        },
        {
            id: '3',
            name: 'EduCrypt Initiative',
            sector: 'Education',
            status: 'active',
            targets: 75,
            infected: 42,
            paid: 15,
            revenue: 0.08
        }
    ])

    const earningsData = [
        { label: 'Week 1', value: 0.1245, timestamp: '2024-01-01' },
        { label: 'Week 2', value: 0.1876, timestamp: '2024-01-08' },
        { label: 'Week 3', value: 0.2354, timestamp: '2024-01-15' },
        { label: 'Week 4', value: 0.3046, timestamp: '2024-01-22' },
    ]

    const commissionBreakdown = [
        { name: 'Your Share (70%)', value: 70, color: '#8b5cf6' },
        { name: 'Operator (20%)', value: 20, color: '#6d28d9' },
        { name: 'Infrastructure (10%)', value: 10, color: '#a78bfa' },
    ]

    useEffect(() => {
        setViewMode('affiliate')
        if (!affiliateId) {
            setAffiliateId(affiliateData.id)
        }
    }, [setViewMode, setAffiliateId, affiliateId, affiliateData.id])

    const handleRequestPayout = async () => {
        setRequestingPayout(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Payout request submitted! Processing within 24-48 hours.')
        setRequestingPayout(false)
    }

    return (
        <AffiliateDashboardContainer>
            <DashboardHeader>
                <h1>💼 Affiliate Dashboard</h1>
                <p className="subtitle">
                    Welcome back, <span className="affiliate-id">{affiliateData.name}</span>
                    {' '}(ID: {affiliateData.id})
                </p>
            </DashboardHeader>

            <EarningsHighlight
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="label">Total Lifetime Earnings</div>
                <div className="amount">{affiliateData.totalEarnings.toFixed(4)} BTC</div>
                <div className="change">
                    <TrendingUp size={20} />
                    +{affiliateData.monthlyEarnings.toFixed(4)} BTC this month
                </div>
            </EarningsHighlight>

            <StatsGrid>
                <StatCard
                    title="Success Rate"
                    value={`${affiliateData.successRate}%`}
                    icon={<CheckCircle />}
                    trend={2.5}
                />
                <StatCard
                    title="Active Campaigns"
                    value={affiliateData.activeCampaigns}
                    icon={<Target />}
                    trend={1}
                />
                <StatCard
                    title="Total Conversions"
                    value={affiliateData.conversions}
                    icon={<Users />}
                    trend={5}
                />
                <StatCard
                    title="Leaderboard Rank"
                    value={`#${affiliateData.rank}`}
                    icon={<Trophy />}
                    trend={0}
                />
            </StatsGrid>

            <ChartsSection>
                <Card>
                    <LineChart
                        data={earningsData}
                        title="Weekly Earnings Trend"
                        height={300}
                        color="#8b5cf6"
                        showGrid={true}
                    />
                </Card>

                <Card>
                    <PieChart
                        data={commissionBreakdown}
                        title="Commission Split"
                        height={300}
                        showLegend={true}
                        innerRadius={50}
                    />
                </Card>
            </ChartsSection>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                <CampaignsSection>
                    <h3>🎯 Your Active Campaigns</h3>
                    <CampaignsList>
                        {campaigns.map(campaign => (
                            <CampaignCard key={campaign.id}>
                                <div className="campaign-header">
                                    <div className="campaign-name">{campaign.name}</div>
                                    <div className="campaign-status">{campaign.status}</div>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {campaign.sector} Sector
                                </div>
                                <div className="campaign-stats">
                                    <div className="stat">
                                        <div className="stat-label">Infected/Targets</div>
                                        <div className="stat-value">{campaign.infected}/{campaign.targets}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-label">Paid</div>
                                        <div className="stat-value">{campaign.paid}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-label">Revenue</div>
                                        <div className="stat-value">{campaign.revenue} BTC</div>
                                    </div>
                                </div>
                            </CampaignCard>
                        ))}
                    </CampaignsList>
                </CampaignsSection>

                <LeaderboardSection>
                    <h3>
                        <Trophy />
                        Top Affiliates
                    </h3>
                    <LeaderboardList>
                        {leaderboard.map(affiliate => (
                            <LeaderboardItem
                                key={affiliate.rank}
                                rank={affiliate.rank}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: affiliate.rank * 0.1 }}
                            >
                                <div className="rank">#{affiliate.rank}</div>
                                <div className="info">
                                    <div className="name">{affiliate.name}</div>
                                    <div className="stats">
                                        {affiliate.campaigns} campaigns • {affiliate.successRate}% success
                                    </div>
                                </div>
                                <div className="earnings">{affiliate.earnings.toFixed(4)} BTC</div>
                            </LeaderboardItem>
                        ))}
                    </LeaderboardList>
                </LeaderboardSection>
            </div>

            <PayoutSection>
                <h3>
                    <Wallet />
                    Request Payout
                </h3>
                <div className="payout-info">
                    <div className="available-balance">
                        <div className="label">Available Balance</div>
                        <div className="amount">{affiliateData.totalEarnings.toFixed(4)} BTC</div>
                    </div>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handleRequestPayout}
                        loading={requestingPayout}
                        icon={<Wallet />}
                    >
                        {requestingPayout ? 'Processing...' : 'Request Payout'}
                    </Button>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    ℹ️ Minimum payout: 0.001 BTC • Processing time: 24-48 hours
                </div>
            </PayoutSection>
        </AffiliateDashboardContainer>
    )
}

export default AffiliateDashboard
