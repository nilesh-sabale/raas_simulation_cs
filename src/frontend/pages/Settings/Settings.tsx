import React from 'react'
import styled from 'styled-components'
import { Settings as SettingsIcon, Moon, Sun, Monitor, Database, Wifi, Eye } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'

const SettingsContainer = styled.div`
  padding: var(--spacing-lg);
  min-height: calc(100vh - var(--header-height));
`

const PageHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    svg {
      color: var(--color-primary);
    }
  }
`

const SettingsGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
  max-width: 800px;
`

const SettingSection = styled(Card)`
  h3 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    
    svg {
      color: var(--color-primary);
    }
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--border);
    
    &:last-child {
      border-bottom: none;
    }
    
    .setting-info {
      .setting-label {
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
      }
      
      .setting-description {
        font-size: 0.875rem;
        color: var(--text-muted);
      }
    }
  }
`

const ThemeButton = styled.button<{ active: boolean }>`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.active ? 'var(--color-primary)' : 'var(--bg-tertiary)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--border)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  &:hover {
    background: var(--color-primary);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const Settings: React.FC = () => {
  const { theme, setTheme, sidebarCollapsed, setSidebarCollapsed, refreshAll } = useAppStore()

  return (
    <SettingsContainer>
      <PageHeader>
        <h1>
          <SettingsIcon />
          Settings
        </h1>
      </PageHeader>

      <SettingsGrid>
        <SettingSection>
          <h3>
            <Eye />
            View Modes Explained
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">🛡️ Operator View</div>
              <div className="setting-description">
                <strong>Full Administrative Access:</strong> See all campaigns, payments, victim data, and system controls.
                This is the main control panel for the entire RaaS operation with complete visibility into all activities.
              </div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">🎯 Affiliate View</div>
              <div className="setting-description">
                <strong>Campaign-Focused Dashboard:</strong> See only your assigned campaigns, earnings, and performance metrics.
                Limited access focused on individual affiliate operations and revenue tracking.
              </div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">👥 Victim View</div>
              <div className="setting-description">
                <strong>Target Perspective:</strong> Experience the simulation from a victim's viewpoint.
                See how attacks appear to targets, understand impact, and learn defensive strategies.
              </div>
            </div>
          </div>
        </SettingSection>

        <SettingSection>
          <h3>
            <Monitor />
            Appearance
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Theme</div>
              <div className="setting-description">
                Choose your preferred color scheme
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              <ThemeButton
                active={theme === 'light'}
                onClick={() => setTheme('light')}
              >
                <Sun />
                Light
              </ThemeButton>
              <ThemeButton
                active={theme === 'dark'}
                onClick={() => setTheme('dark')}
              >
                <Moon />
                Dark
              </ThemeButton>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Sidebar</div>
              <div className="setting-description">
                Sidebar display preference
              </div>
            </div>
            <Button
              variant={sidebarCollapsed ? 'secondary' : 'primary'}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </Button>
          </div>
        </SettingSection>

        <SettingSection>
          <h3>
            <Database />
            Data Management
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Refresh All Data</div>
              <div className="setting-description">
                Reload all simulation data from the server
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={refreshAll}
            >
              Refresh Now
            </Button>
          </div>
        </SettingSection>

        <SettingSection>
          <h3>
            <Wifi />
            Connection
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Real-time Updates</div>
              <div className="setting-description">
                WebSocket connection for live data updates
              </div>
            </div>
            <div style={{ color: 'var(--color-success)', fontWeight: 500 }}>
              Connected
            </div>
          </div>
        </SettingSection>
      </SettingsGrid>
    </SettingsContainer>
  )
}

export default Settings