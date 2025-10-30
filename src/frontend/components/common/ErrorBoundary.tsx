import { Component, ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  color: var(--text-primary);
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: var(--color-danger);
  margin-bottom: var(--spacing-lg);
  animation: pulse 2s ease-in-out infinite;
`

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  line-height: 1.6;
`

const ErrorDetails = styled.details`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  max-width: 800px;
  width: 100%;
  
  summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }
  
  pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    overflow-x: auto;
  }
`

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--gradient-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px var(--shadow-glow);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    // Reload the page as a fallback
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <div className="matrix-bg" />
          <ErrorIcon>
            <AlertTriangle size={64} />
          </ErrorIcon>

          <ErrorTitle>Something went wrong</ErrorTitle>

          <ErrorMessage>
            The RaaS simulation encountered an unexpected error. This is likely a temporary issue.
            You can try refreshing the page or contact support if the problem persists.
          </ErrorMessage>

          {this.state.error && (
            <ErrorDetails>
              <summary>Technical Details</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}

          <RetryButton onClick={this.handleRetry}>
            <RefreshCw />
            Retry Application
          </RetryButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}