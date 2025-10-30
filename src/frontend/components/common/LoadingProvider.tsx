import React, { createContext, useContext, useState, ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'

interface LoadingContextType {
    isLoading: boolean
    setLoading: (loading: boolean) => void
    loadingMessage: string
    setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`

const LoadingOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease-in-out;
`

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 255, 136, 0.3);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: var(--spacing-lg);
`

const LoadingText = styled.div`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: dots 1.5s steps(4, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`

interface LoadingProviderProps {
    children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Loading')

    const setLoading = (loading: boolean) => {
        setIsLoading(loading)
        if (!loading) {
            setLoadingMessage('Loading')
        }
    }

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                setLoading,
                loadingMessage,
                setLoadingMessage,
            }}
        >
            {children}
            <LoadingOverlay show={isLoading}>
                <LoadingSpinner />
                <LoadingText>
                    {loadingMessage}
                    <LoadingDots />
                </LoadingText>
            </LoadingOverlay>
        </LoadingContext.Provider>
    )
}