import React from 'react'
import styled from 'styled-components'
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react'
import { Card } from '../../components/common/Card'

const DefenseContainer = styled.div`
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
    margin-bottom: var(--spacing-sm);
    
    svg {
      color: var(--color-primary);
    }
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
  }
`

const DefenseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`

const DefenseCard = styled(Card)`
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
  }
  
  ul {
    color: var(--text-secondary);
    margin-left: var(--spacing-lg);
    
    li {
      margin-bottom: var(--spacing-xs);
    }
  }
`

const Defense: React.FC = () => {
    return (
        <DefenseContainer>
            <PageHeader>
                <h1>
                    <Shield />
                    Blue Team Mode
                </h1>
                <p>
                    Defensive cybersecurity perspective - Learn how to detect, prevent, and respond to ransomware attacks.
                </p>
            </PageHeader>

            <DefenseGrid>
                <DefenseCard>
                    <h3>
                        <Eye />
                        Detection Strategies
                    </h3>
                    <p>
                        Learn how security teams identify ransomware attacks in progress:
                    </p>
                    <ul>
                        <li>Network traffic anomaly detection</li>
                        <li>File system monitoring for encryption patterns</li>
                        <li>Behavioral analysis of suspicious processes</li>
                        <li>Email security and phishing detection</li>
                        <li>Endpoint detection and response (EDR)</li>
                    </ul>
                </DefenseCard>

                <DefenseCard>
                    <h3>
                        <Lock />
                        Prevention Measures
                    </h3>
                    <p>
                        Proactive security measures to prevent ransomware attacks:
                    </p>
                    <ul>
                        <li>Regular security awareness training</li>
                        <li>Patch management and vulnerability scanning</li>
                        <li>Network segmentation and access controls</li>
                        <li>Backup strategies and recovery testing</li>
                        <li>Application whitelisting and sandboxing</li>
                    </ul>
                </DefenseCard>

                <DefenseCard>
                    <h3>
                        <AlertTriangle />
                        Incident Response
                    </h3>
                    <p>
                        Steps to take when a ransomware attack is detected:
                    </p>
                    <ul>
                        <li>Immediate isolation of affected systems</li>
                        <li>Forensic analysis and evidence collection</li>
                        <li>Communication with stakeholders</li>
                        <li>Recovery from clean backups</li>
                        <li>Post-incident analysis and improvements</li>
                    </ul>
                </DefenseCard>

                <DefenseCard>
                    <h3>
                        <Shield />
                        Best Practices
                    </h3>
                    <p>
                        Industry-standard defensive practices:
                    </p>
                    <ul>
                        <li>Zero-trust security architecture</li>
                        <li>Multi-factor authentication everywhere</li>
                        <li>Regular security assessments</li>
                        <li>Threat intelligence integration</li>
                        <li>Continuous monitoring and logging</li>
                    </ul>
                </DefenseCard>
            </DefenseGrid>
        </DefenseContainer>
    )
}

export default Defense