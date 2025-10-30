import React, { Suspense } from 'react'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-muted);
  font-size: 0.875rem;
`

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

interface LazyWrapperProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
    children,
    fallback = (
        <LoadingContainer>
            <LoadingSpinner />
            Loading...
        </LoadingContainer>
    )
}) => {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    )
}

export default LazyWrapper