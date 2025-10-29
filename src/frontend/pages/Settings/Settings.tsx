import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon } from 'lucide-react'

const SettingsContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  svg {
    color: var(--color-primary);
  }
`

const PlaceholderCard = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  padding: var(--spacing-xxl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  text-align: center;
`

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
`

const PlaceholderTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`

const PlaceholderText = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
`

const Settings: React.FC = () => {
    return (
        <SettingsContainer>
            <PageTitle>
                <SettingsIcon />
                Application Settings
            </PageTitle>

            <PlaceholderCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <PlaceholderIcon>⚙️</PlaceholderIcon>
                <PlaceholderTitle>Configuration Panel</PlaceholderTitle>
                <PlaceholderText>
                    Application settings, theme preferences, user configuration, and system
                    parameters will be implemented here. This includes dark/light mode toggle,
                    notification settings, and simulation parameters.
                </PlaceholderText>
            </PlaceholderCard>
        </SettingsContainer>
    )
}

export default Settings