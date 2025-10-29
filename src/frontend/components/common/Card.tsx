import React from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'bordered' | 'elevated'
  padding?: 'none' | 'small' | 'medium' | 'large'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  className?: string
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'glass':
      return css`
        background: var(--bg-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border);
      `
    case 'bordered':
      return css`
        background: var(--bg-secondary);
        border: 2px solid var(--border);
      `
    case 'elevated':
      return css`
        background: var(--gradient-card);
        border: 1px solid var(--border);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(25px);
      `
    default:
      return css`
        background: var(--gradient-card);
        border: 1px solid var(--border);
        backdrop-filter: blur(20px);
      `
  }
}

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 'none':
      return css`padding: 0;`
    case 'small':
      return css`padding: var(--spacing-md);`
    case 'large':
      return css`padding: var(--spacing-xl);`
    default: // medium
      return css`padding: var(--spacing-lg);`
  }
}

const StyledCard = styled(motion.div) <{
  $variant: string
  $padding: string
  $hover: boolean
  $clickable: boolean
}>`
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  ${props => getVariantStyles(props.$variant)}
  ${props => getPaddingStyles(props.$padding)}
  
  ${props => props.$hover && css`
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
  `}
  
  ${props => props.$clickable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px var(--shadow);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  hover = false,
  clickable = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hover={hover}
      $clickable={clickable}
      onClick={onClick}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      {children}
    </StyledCard>
  )
}