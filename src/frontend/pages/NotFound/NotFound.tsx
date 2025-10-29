import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  text-align: center;
`

const MatrixBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 204, 106, 0.05) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(0, 255, 136, 0.02) 50%, transparent 70%);
  z-index: -1;
  animation: matrixShift 20s ease-in-out infinite;
`

const ErrorCode = styled(motion.div)`
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
  line-height: 1;
`

const ErrorTitle = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`

const ErrorMessage = styled(motion.p)`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
  line-height: 1.6;
`

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  
  ${props => props.variant === 'primary' ? `
    background: var(--gradient-primary);
    color: var(--bg-primary);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px var(--shadow-glow);
    }
  ` : `
    background: transparent;
    color: var(--text-primary);
    border: 2px solid var(--border);
    
    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 0 20px var(--shadow-glow);
    }
  `}
  
  svg {
    width: 20px;
    height: 20px;
  }
`

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <NotFoundContainer>
            <MatrixBackground />

            <ErrorCode
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                404
            </ErrorCode>

            <ErrorTitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Page Not Found
            </ErrorTitle>

            <ErrorMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                The page you're looking for doesn't exist in our simulation.
                It might have been moved, deleted, or you entered the wrong URL.
            </ErrorMessage>

            <ActionButtons
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <ActionButton variant="primary" onClick={handleGoHome}>
                    <Home />
                    Go to Landing
                </ActionButton>
                <ActionButton onClick={handleGoBack}>
                    <ArrowLeft />
                    Go Back
                </ActionButton>
            </ActionButtons>
        </NotFoundContainer>
    )
}

export default NotFound