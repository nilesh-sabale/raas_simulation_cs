import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  Shield,
  Activity,
  BarChart3,
  Lock,
  Users,
  AlertTriangle,
  ArrowRight,
  Github,
  BookOpen
} from 'lucide-react'

const LandingContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
`

const MatrixBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 204, 106, 0.03) 0%, transparent 50%);
  z-index: -1;
  /* Removed animation for better performance */
`

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-lg);
  }
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  
  .logo-icon {
    font-size: 2rem;
    color: var(--color-primary);
    text-shadow: 0 0 20px var(--color-primary);
    animation: logoGlow 2s ease-in-out infinite alternate;
  }
  
  .logo-text {
    letter-spacing: 2px;
  }
  
  .logo-subtitle {
    font-size: 0.6rem;
    color: var(--text-muted);
    letter-spacing: 3px;
    font-weight: 600;
    margin-left: var(--spacing-sm);
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled.a`
  color: var(--text-secondary);
  font-weight: 500;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-primary);
  }
`

const Main = styled.main`
  padding-top: 100px;
`

const HeroSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-xl);
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
`

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
`

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  margin-bottom: var(--spacing-xxl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--gradient-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px var(--shadow-glow);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 20px var(--shadow-glow);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const FeaturesSection = styled.section`
  padding: var(--spacing-xxl) var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
`

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
`

const FeatureCard = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px var(--shadow);
    border-color: var(--color-primary);
    
    &::before {
      transform: scaleX(1);
    }
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  
  svg {
    width: 30px;
    height: 30px;
    color: var(--bg-primary);
  }
`

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`

const FeatureLink = styled.button`
  color: var(--color-primary);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition-fast);
  
  &:hover {
    color: var(--color-secondary);
    transform: translateX(5px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const DisclaimerSection = styled.section`
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin: var(--spacing-xxl) var(--spacing-xl);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`

const DisclaimerTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-danger);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  
  svg {
    width: 24px;
    height: 24px;
  }
`

const DisclaimerText = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`

const Footer = styled.footer`
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-muted);
`

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleEnterSimulation = () => {
    navigate('/app/dashboard')
  }

  const handleVictimDemo = () => {
    navigate('/victim-portal')
  }

  const handleAffiliateDemo = () => {
    navigate('/app/affiliate')
  }

  const features = [
    {
      icon: <BarChart3 />,
      title: 'Real-time Dashboard',
      description: 'Monitor simulation statistics, campaign performance, and system activity with live updates and interactive charts.',
      action: 'View Dashboard'
    },
    {
      icon: <Lock />,
      title: 'Encryption Simulation',
      description: 'Safely simulate file encryption using reversible methods like Base64 and Caesar cipher - no real harm done.',
      action: 'Try Encryption'
    },
    {
      icon: <Users />,
      title: 'Multi-Role Experience',
      description: 'Experience different perspectives: operator, affiliate, and victim roles to understand the complete ecosystem.',
      action: 'Explore Roles'
    },
    {
      icon: <Activity />,
      title: 'Network Visualization',
      description: 'Visualize attack networks, connection patterns, and data flow with interactive network graphs.',
      action: 'View Network'
    },
    {
      icon: <Shield />,
      title: 'Blue Team Mode',
      description: 'Switch to defensive perspective to understand detection, prevention, and response strategies.',
      action: 'Defense Mode'
    },
    {
      icon: <BookOpen />,
      title: 'Educational Focus',
      description: 'Learn cybersecurity concepts through hands-on simulation without any real-world risks or consequences.',
      action: 'Learn More'
    }
  ]

  return (
    <LandingContainer>
      <MatrixBackground />

      <Header>
        <Nav>
          <Logo>
            <span className="logo-icon">⚡</span>
            <div>
              <span className="logo-text">RaaS</span>
              <span className="logo-subtitle">SIMULATION</span>
            </div>
          </Logo>
          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="https://github.com" target="_blank">
              <Github size={16} /> GitHub
            </NavLink>
          </NavLinks>
        </Nav>
      </Header>

      <Main>
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Educational RaaS Simulation
          </HeroTitle>

          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn cybersecurity through safe, hands-on simulation of ransomware-as-a-service operations.
            No real encryption, no actual harm - just pure educational value.
          </HeroSubtitle>

          <CTAButtons
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PrimaryButton onClick={handleVictimDemo}>
              👤 Try Victim Experience
              <ArrowRight />
            </PrimaryButton>
            <PrimaryButton onClick={handleAffiliateDemo} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
              💼 Try Affiliate Dashboard
              <ArrowRight />
            </PrimaryButton>
            <SecondaryButton onClick={handleEnterSimulation}>
              🖥️ Operator Control Center
              <ArrowRight />
            </SecondaryButton>
          </CTAButtons>
        </HeroSection>

        <FeaturesSection id="features">
          <SectionTitle>Simulation Features</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <FeatureLink onClick={handleEnterSimulation}>
                  {feature.action}
                  <ArrowRight />
                </FeatureLink>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <DisclaimerSection id="about">
          <DisclaimerTitle>
            <AlertTriangle />
            Educational Purpose Only
          </DisclaimerTitle>
          <DisclaimerText>
            This simulation is designed exclusively for educational and research purposes in cybersecurity.
            It does not perform real encryption, cause actual damage, or engage in any malicious activities.
          </DisclaimerText>
          <DisclaimerText>
            All "encryption" uses reversible encoding methods (Base64, Caesar cipher) on dummy text files.
            No real files are harmed, no actual payments are processed, and no genuine security threats are created.
          </DisclaimerText>
          <DisclaimerText>
            <strong>Legal Notice:</strong> This tool is intended for authorized educational use only.
            Users are solely responsible for ensuring their use complies with applicable laws and regulations.
          </DisclaimerText>
        </DisclaimerSection>
      </Main>

      <Footer>
        <p>&copy; 2024 RaaS Educational Simulation. Built for cybersecurity education and research.</p>
      </Footer>
    </LandingContainer>
  )
}

export default LandingPage