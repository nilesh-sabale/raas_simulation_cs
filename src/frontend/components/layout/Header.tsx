import React from 'react'
import styled from 'styled-components'
import {
    Menu,
    RefreshCw,
    Download,
    Shield,
    Bell,
    User
} from 'lucide-react'

interface HeaderProps {
    onMenuToggle: () => void
    onSidebarToggle: () => void
    sidebarCollapsed: boolean
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--header-height);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  z-index: 999;
  transition: var(--transition-normal);
  
  @media (max-width: 768px) {
    left: 0;
  }
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 var(--spacing-xl);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-lg);
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`

const PageTitle = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.25rem;
    }
    
    p {
      font-size: 0.8rem;
    }
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`

const StatusIndicators = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    display: none;
  }
`

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`

const StatusDot = styled.span<{ status: 'active' | 'warning' | 'danger' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
        switch (props.status) {
            case 'active': return 'var(--color-primary)'
            case 'warning': return 'var(--color-warning)'
            case 'danger': return 'var(--color-danger)'
            default: return 'var(--color-primary)'
        }
    }};
  box-shadow: 0 0 10px ${props => {
        switch (props.status) {
            case 'active': return 'var(--color-primary)'
            case 'warning': return 'var(--color-warning)'
            case 'danger': return 'var(--color-danger)'
            default: return 'var(--color-primary)'
        }
    }};
  animation: statusPulse 2s ease-in-out infinite;
`

const StatusText = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-secondary);
  text-transform: uppercase;
`

const HeaderActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition-normal);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  ${props => {
        switch (props.variant) {
            case 'primary':
                return `
          background: var(--gradient-primary);
          color: var(--bg-primary);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px var(--shadow-glow);
          }
        `
            case 'danger':
                return `
          background: var(--gradient-danger);
          color: var(--text-primary);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
          }
        `
            default:
                return `
          background: var(--bg-glass);
          color: var(--text-primary);
          border: 1px solid var(--border);
          
          &:hover {
            border-color: var(--color-primary);
            box-shadow: 0 0 20px var(--shadow-glow);
          }
        `
        }
    }}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-sm);
    
    .button-text {
      display: none;
    }
  }
`

const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: var(--color-danger);
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 18px;
      height: 18px;
      color: var(--bg-primary);
    }
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
  
  @media (max-width: 768px) {
    .user-info {
      display: none;
    }
  }
`

export const Header: React.FC<HeaderProps> = ({
    onMenuToggle
}) => {
    const [defenseMode, setDefenseMode] = React.useState(false)

    const handleRefresh = () => {
        window.location.reload()
    }

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export functionality')
    }

    const toggleDefenseMode = () => {
        setDefenseMode(!defenseMode)
    }

    return (
        <HeaderContainer>
            <HeaderContent>
                <HeaderLeft>
                    <MobileMenuButton onClick={onMenuToggle}>
                        <Menu />
                    </MobileMenuButton>

                    <PageTitle>
                        <h1>Operations Dashboard</h1>
                        <p>Real-time RaaS ecosystem simulation</p>
                    </PageTitle>
                </HeaderLeft>

                <HeaderRight>
                    <StatusIndicators>
                        <StatusItem>
                            <StatusDot status="active" />
                            <StatusText>System Online</StatusText>
                        </StatusItem>
                        <StatusItem>
                            <StatusDot status="warning" />
                            <StatusText>Simulation Mode</StatusText>
                        </StatusItem>
                    </StatusIndicators>

                    <HeaderActions>
                        <ActionButton onClick={handleRefresh}>
                            <RefreshCw />
                            <span className="button-text">Refresh</span>
                        </ActionButton>

                        <ActionButton onClick={handleExport}>
                            <Download />
                            <span className="button-text">Export</span>
                        </ActionButton>

                        <ActionButton
                            variant={defenseMode ? 'danger' : 'primary'}
                            onClick={toggleDefenseMode}
                        >
                            <Shield />
                            <span className="button-text">
                                {defenseMode ? 'Red Team' : 'Blue Team'}
                            </span>
                        </ActionButton>
                    </HeaderActions>

                    <NotificationButton>
                        <Bell />
                        <NotificationBadge>3</NotificationBadge>
                    </NotificationButton>

                    <UserMenu>
                        <div className="user-avatar">
                            <User />
                        </div>
                        <div className="user-info">
                            <span className="user-name">Operator</span>
                            <span className="user-role">Admin</span>
                        </div>
                    </UserMenu>
                </HeaderRight>
            </HeaderContent>
        </HeaderContainer>
    )
}