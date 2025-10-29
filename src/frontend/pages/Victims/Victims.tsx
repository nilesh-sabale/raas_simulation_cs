import React from 'react'
import styled from 'styled-components'

import { Users, AlertTriangle, Shield } from 'lucide-react'
import { EncryptionForm } from '@components/forms/EncryptionForm'
import { Card } from '@components/common/Card'

const VictimsContainer = styled.div`
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

const DisclaimerCard = styled(Card)`
  background: rgba(255, 170, 0, 0.1);
  border-color: var(--color-warning);
  margin-bottom: var(--spacing-xl);
  
  .disclaimer-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-warning);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .disclaimer-text {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    strong {
      color: var(--text-primary);
    }
  }
`

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled(Card)`
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
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    color: var(--text-secondary);
    margin-left: var(--spacing-lg);
    
    li {
      margin-bottom: var(--spacing-xs);
    }
  }
`

const Victims: React.FC = () => {
  const handleEncryptionComplete = (result: any) => {
    console.log('Encryption completed:', result)
  }

  return (
    <VictimsContainer>
      <PageTitle>
        <Users />
        Victim Simulation
      </PageTitle>

      <DisclaimerCard>
        <div className="disclaimer-header">
          <AlertTriangle />
          Educational Simulation Only
        </div>
        <p className="disclaimer-text">
          <strong>This is a safe educational simulation.</strong> No real files are encrypted,
          no actual malware is involved, and no genuine security threats are created.
        </p>
        <p className="disclaimer-text">
          The "encryption" uses reversible encoding methods (Base64, Caesar cipher) on text content.
          This tool is designed for cybersecurity education and research purposes only.
        </p>
      </DisclaimerCard>

      <InfoSection>
        <InfoCard>
          <h3>
            <Shield />
            How This Simulation Works
          </h3>
          <p>
            This victim simulation demonstrates what a ransomware attack might look like
            from the victim's perspective, using completely safe methods:
          </p>
          <ul>
            <li>Upload a text file to simulate the encryption process</li>
            <li>Choose between Base64 encoding or Caesar cipher</li>
            <li>Receive a simulated ransom demand with fake payment details</li>
            <li>Decrypt the content to simulate payment and recovery</li>
          </ul>
        </InfoCard>

        <InfoCard>
          <h3>
            <Users />
            Learning Objectives
          </h3>
          <p>
            This simulation helps understand:
          </p>
          <ul>
            <li>The victim experience during a ransomware attack</li>
            <li>How ransom demands are typically presented</li>
            <li>The psychological pressure tactics used by attackers</li>
            <li>The importance of backups and incident response plans</li>
            <li>Why paying ransoms is discouraged by security experts</li>
          </ul>
        </InfoCard>
      </InfoSection>

      <EncryptionForm onEncryptionComplete={handleEncryptionComplete} />
    </VictimsContainer>
  )
}

export default Victims