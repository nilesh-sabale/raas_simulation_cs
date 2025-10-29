import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
    BarChart3,
    Target,
    Users,
    CreditCard,
    Network,
    Clock,
    FileText,
    Shield,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

interface SidebarProps {
    collapsed: boolean
    mobileOpen: boolean
    onToggle: () => void
    onMobileClose: () => void
}

const SidebarContainer = styled.aside<{ collapsed: boolean; mobileOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.collapsed ? '80px' : 'var(--sidebar-width)'};
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow-y: auto;
  transition: var(--transition-normal);
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: var(--sidebar-width);
  }
`

const SidebarOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: var(--transition-normal);
  
  @media (min-width: 769px) {
    display: none;
  }
`

const SidebarHeader = styled.div<{ collapsed: boolean }>`
  padding: var(--spacing-xl) ${props => props.collapsed ? 'var(--spacing-md)' : 'var(--spacing-lg)'};
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
`

const Logo = styled.div<{ collapsed: boolean }>`
  display: flex;
  flex-direction: ${props => props.collapsed ? 'column' : 'row'};
  align-items: center;
  gap: ${props => props.collapsed ? 'var(--spacing-xs)' : 'var(--spacing-sm)'};
`

const LogoIcon = styled.span<{ $collapsed: boolean }>`
  font-size: ${props => props.$collapsed ? '1.5rem' : '2rem'};
  color: var(--color-primary);
  text-shadow: 0 0 20px var(--color-primary);
  animation: logoGlow 2s ease-in-out infinite alternate;
`

const LogoText = styled.div<{ collapsed: boolean }>`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  flex-direction: column;
  
  .logo-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: 2px;
  }
  
  .logo-subtitle {
    font-size: 0.6rem;
    color: var(--text-muted);
    letter-spacing: 3px;
    font-weight: 600;
  }
`

const CollapseButton = styled.button<{ collapsed: boolean }>`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavMenu = styled.nav`
  padding: var(--spacing-lg) 0;
`

const NavSection = styled.div`
  margin-bottom: var(--spacing-xl);
`

const NavSectionTitle = styled.h3<{ collapsed: boolean }>`
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 ${props => props.collapsed ? 'var(--spacing-md)' : 'var(--spacing-lg)'};
  margin-bottom: var(--spacing-md);
  display: ${props => props.collapsed ? 'none' : 'block'};
`

const NavItem = styled(NavLink) <{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) ${props => props.collapsed ? 'var(--spacing-md)' : 'var(--spacing-lg)'};
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-normal);
  position: relative;
  border-left: 3px solid transparent;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border-left-color: var(--color-primary);
  }
  
  &.active {
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border-left-color: var(--color-primary);
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--gradient-primary);
    }
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  .nav-text {
    font-weight: 500;
    font-size: 0.9rem;
    display: ${props => props.collapsed ? 'none' : 'block'};
  }
`

const RoleSelector = styled.div<{ collapsed: boolean }>`
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
  margin-top: auto;
  display: ${props => props.collapsed ? 'none' : 'block'};
`

const RoleSelectorTitle = styled.h3`
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: var(--spacing-md);
`

const RoleButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`

const RoleButton = styled.button<{ active?: boolean }>`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.active ? 'var(--gradient-primary)' : 'var(--bg-tertiary)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--border)'};
  color: ${props => props.active ? 'var(--bg-primary)' : 'var(--text-secondary)'};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: var(--transition-normal);
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  
  &:hover {
    background: ${props => props.active ? 'var(--gradient-primary)' : 'var(--color-primary)'};
    color: var(--bg-primary);
    border-color: var(--color-primary);
    box-shadow: 0 0 20px var(--shadow-glow);
  }
`

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    mobileOpen,
    onToggle,
    onMobileClose
}) => {
    // const location = useLocation()
    const [currentRole, setCurrentRole] = React.useState<'operator' | 'affiliate' | 'victim'>('operator')

    const navigationSections = [
        {
            title: 'Operations',
            items: [
                { path: '/app/dashboard', icon: BarChart3, text: 'Dashboard' },
                { path: '/app/campaigns', icon: Target, text: 'Campaigns' },
                { path: '/app/victims', icon: Users, text: 'Victims' },
                { path: '/app/payments', icon: CreditCard, text: 'Payments' },
            ]
        },
        {
            title: 'Analytics',
            items: [
                { path: '/app/analytics/network', icon: Network, text: 'Network Graph' },
                { path: '/app/analytics/timeline', icon: Clock, text: 'Timeline' },
                { path: '/app/logs', icon: FileText, text: 'Logs' },
            ]
        },
        {
            title: 'System',
            items: [
                { path: '/app/defense', icon: Shield, text: 'Blue Team Mode' },
                { path: '/app/settings', icon: Settings, text: 'Settings' },
            ]
        }
    ]

    return (
        <>
            <SidebarOverlay show={mobileOpen} onClick={onMobileClose} />

            <SidebarContainer collapsed={collapsed} mobileOpen={mobileOpen}>
                <SidebarHeader collapsed={collapsed}>
                    <Logo collapsed={collapsed}>
                        <LogoIcon $collapsed={collapsed}>⚡</LogoIcon>
                        <LogoText collapsed={collapsed}>
                            <span className="logo-title">RaaS</span>
                            <span className="logo-subtitle">SIMULATION</span>
                        </LogoText>
                    </Logo>

                    <CollapseButton collapsed={collapsed} onClick={onToggle}>
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </CollapseButton>
                </SidebarHeader>

                <NavMenu>
                    {navigationSections.map((section, sectionIndex) => (
                        <NavSection key={sectionIndex}>
                            <NavSectionTitle collapsed={collapsed}>
                                {section.title}
                            </NavSectionTitle>

                            {section.items.map((item, itemIndex) => (
                                <NavItem
                                    key={itemIndex}
                                    to={item.path}
                                    collapsed={collapsed}
                                    onClick={() => window.innerWidth <= 768 && onMobileClose()}
                                >
                                    <item.icon className="nav-icon" />
                                    <span className="nav-text">{item.text}</span>
                                </NavItem>
                            ))}
                        </NavSection>
                    ))}
                </NavMenu>

                <RoleSelector collapsed={collapsed}>
                    <RoleSelectorTitle>View Mode</RoleSelectorTitle>
                    <RoleButtons>
                        {(['operator', 'affiliate', 'victim'] as const).map((role) => (
                            <RoleButton
                                key={role}
                                active={currentRole === role}
                                onClick={() => setCurrentRole(role)}
                            >
                                {role}
                            </RoleButton>
                        ))}
                    </RoleButtons>
                </RoleSelector>
            </SidebarContainer>
        </>
    )
}