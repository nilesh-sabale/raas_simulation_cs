import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Target, Plus, Play, Pause, Square, Edit, Trash2 } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CampaignForm } from '../../components/forms/CampaignForm'
// import { Campaign } from '@/types'

const CampaignsContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  background: var(--gradient-bg);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-glow);
    opacity: 0.2;
    z-index: -1;
    animation: cyberShift 30s ease-in-out infinite;
  }
`

const PageHeader = styled.div`
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

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  animation: neonPulse 3s ease-in-out infinite;
  
  svg {
    color: var(--color-primary);
    filter: drop-shadow(0 0 10px var(--color-primary));
  }
`

const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
`

const CampaignCard = styled(Card)`
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px var(--shadow);
  }
`

const CampaignHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`

const CampaignTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`

const CampaignStatus = styled.span<{ status: string }>`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: rgba(0, 255, 136, 0.2);
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        `
      case 'paused':
        return `
          background: rgba(255, 170, 0, 0.2);
          color: var(--color-warning);
          border: 1px solid var(--color-warning);
        `
      case 'completed':
        return `
          background: rgba(0, 170, 255, 0.2);
          color: var(--color-info);
          border: 1px solid var(--color-info);
        `
      case 'stopped':
        return `
          background: rgba(255, 68, 68, 0.2);
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
        `
      default:
        return `
          background: var(--bg-tertiary);
          color: var(--text-muted);
          border: 1px solid var(--border);
        `
    }
  }}
`

const CampaignDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: var(--spacing-lg);
`

const CampaignStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`

const StatItem = styled.div`
  .label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: var(--spacing-xs);
  }
  
  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-primary);
    font-family: 'JetBrains Mono', monospace;
  }
`

const CampaignActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: var(--spacing-xxl);
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto var(--spacing-lg);
  }
`

const Campaigns: React.FC = () => {
  const { campaigns, loading, fetchCampaigns } = useAppStore()
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleCreateCampaign = () => {
    setShowCreateForm(true)
  }

  const handleCampaignCreated = () => {
    fetchCampaigns()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Unknown'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={14} />
      case 'paused': return <Pause size={14} />
      case 'stopped': return <Square size={14} />
      default: return null
    }
  }

  if (loading.campaigns) {
    return (
      <CampaignsContainer>
        <PageHeader>
          <PageTitle>
            <Target />
            Campaign Management
          </PageTitle>
        </PageHeader>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
          Loading campaigns...
        </div>
      </CampaignsContainer>
    )
  }

  return (
    <CampaignsContainer>
      <PageHeader>
        <PageTitle>
          <Target />
          Campaign Management
        </PageTitle>
        <Button
          variant="primary"
          onClick={handleCreateCampaign}
          icon={<Plus />}
        >
          Create Campaign
        </Button>
      </PageHeader>

      {campaigns.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="empty-icon">🎯</div>
          <h3>No Campaigns Yet</h3>
          <p>
            Create your first campaign to start simulating ransomware-as-a-service operations.
            Configure targets, set ransom amounts, and track campaign performance.
          </p>
          <Button
            variant="primary"
            onClick={handleCreateCampaign}
            icon={<Plus />}
          >
            Create Your First Campaign
          </Button>
        </EmptyState>
      ) : (
        <CampaignsGrid>
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
            >
              <CampaignHeader>
                <div>
                  <CampaignTitle>{campaign.name}</CampaignTitle>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {campaign.sector} • {formatDate(campaign.created_at)}
                  </div>
                </div>
                <CampaignStatus status={campaign.status}>
                  {getStatusIcon(campaign.status)}
                  {campaign.status}
                </CampaignStatus>
              </CampaignHeader>

              <CampaignDescription>
                {campaign.description}
              </CampaignDescription>

              <CampaignStats>
                <StatItem>
                  <div className="label">Targets</div>
                  <div className="value">{campaign.size}</div>
                </StatItem>
                <StatItem>
                  <div className="label">Victims</div>
                  <div className="value">0</div>
                </StatItem>
                <StatItem>
                  <div className="label">Ransom</div>
                  <div className="value">{campaign.amount} BTC</div>
                </StatItem>
                <StatItem>
                  <div className="label">Revenue</div>
                  <div className="value">0.0000 BTC</div>
                </StatItem>
              </CampaignStats>

              <CampaignActions>
                <Button size="small" variant="secondary" icon={<Edit />}>
                  Edit
                </Button>
                <Button size="small" variant="secondary" icon={<Play />}>
                  {campaign.status === 'active' ? 'Pause' : 'Start'}
                </Button>
                <Button size="small" variant="danger" icon={<Trash2 />}>
                  Delete
                </Button>
              </CampaignActions>
            </CampaignCard>
          ))}
        </CampaignsGrid>
      )}

      <CampaignForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleCampaignCreated}
      />
    </CampaignsContainer>
  )
}

export default Campaigns