import React from 'react'
import styled from 'styled-components'
import { Eye, Shield, Target, Users } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  
  .indicator-icon {
    width: 16px;
    height: 16px;
    color: var(--color-primary);
  }
  
  .indicator-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: capitalize;
  }
  
  .indicator-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const ViewModeIndicator: React.FC = () => {
    const { viewMode } = useAppStore()

    const getViewModeConfig = (mode: string) => {
        switch (mode) {
            case 'operator':
                return {
                    icon: Shield,
                    label: 'Operator View',
                    description: 'Full system access - See all campaigns, payments, and administrative controls'
                }
            case 'affiliate':
                return {
                    icon: Target,
                    label: 'Affiliate View',
                    description: 'Campaign focus - See your campaigns, earnings, and performance metrics'
                }
            case 'victim':
                return {
                    icon: Users,
                    label: 'Victim View',
                    description: 'Target perspective - See attacks from the victim\'s point of view'
                }
            default:
                return {
                    icon: Eye,
                    label: 'Default View',
                    description: 'Standard view mode'
                }
        }
    }

    const config = getViewModeConfig(viewMode)
    const IconComponent = config.icon

    return (
        <IndicatorContainer title={config.description}>
            <IconComponent className="indicator-icon" />
            <div>
                <div className="indicator-label">Current View</div>
                <div className="indicator-text">{config.label}</div>
            </div>
        </IndicatorContainer>
    )
}

export default ViewModeIndicator