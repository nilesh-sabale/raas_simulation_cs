import React from 'react'
import styled from 'styled-components'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  trend?: number
  icon: React.ReactNode
  loading?: boolean
  onClick?: () => void
  suffix?: string
  prefix?: string
}

const CardContainer = styled.div<{ $clickable: boolean }>`
  background: var(--gradient-card);
  backdrop-filter: blur(25px);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition-normal);
  position: relative;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform var(--transition-normal);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: var(--gradient-glow);
    opacity: 0;
    transition: opacity var(--transition-normal);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl), var(--shadow-glow);
    border-color: rgba(99, 102, 241, 0.5);
    
    &::before {
      transform: scaleX(1);
    }
    
    &::after {
      opacity: 0.1;
    }
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`

const IconContainer = styled.div`
  font-size: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--gradient-primary);
    border-radius: var(--radius-lg);
    z-index: -1;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover::before {
    opacity: 0.3;
  }
`

const CardTitle = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  flex: 1;
`

const CardValue = styled.div<{ $loading: boolean }>`
  font-size: 2.75rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  
  ${props => props.$loading && `
    background: linear-gradient(90deg, var(--gradient-primary) 25%, transparent 50%, var(--gradient-primary) 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  `}
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

const CardTrend = styled.div<{ $trend: number }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => {
    if (props.$trend > 0) return 'var(--color-success)'
    if (props.$trend < 0) return 'var(--color-danger)'
    return 'var(--text-secondary)'
  }};
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const LoadingSkeleton = styled.div`
  height: 2.5rem;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  loading = false,
  onClick,
  suffix = '',
  prefix = '',
}) => {
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus />
    return trend > 0 ? <TrendingUp /> : <TrendingDown />
  }

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val

    // Format large numbers
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M'
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K'
    }
    return val.toString()
  }

  const formatTrend = (trend: number) => {
    const sign = trend > 0 ? '+' : ''
    return `${sign}${trend} this session`
  }

  return (
    <CardContainer
      $clickable={Boolean(onClick)}
      onClick={onClick}
    >
      <CardHeader>
        <IconContainer>
          {icon}
        </IconContainer>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <CardValue $loading={loading}>
          {prefix}{formatValue(value)}{suffix}
        </CardValue>
      )}

      {trend !== undefined && !loading && (
        <CardTrend $trend={trend}>
          {getTrendIcon()}
          {formatTrend(trend)}
        </CardTrend>
      )}
    </CardContainer>
  )
}