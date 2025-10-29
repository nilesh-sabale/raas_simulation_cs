import React from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: var(--gradient-primary);
        color: white;
        border: none;
        box-shadow: var(--shadow-md);
        
        &:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          background-size: 150% 150%;
        }
        
        &:active:not(:disabled) {
          transform: translateY(-1px);
        }
      `
    case 'danger':
      return css`
        background: var(--gradient-danger);
        color: var(--text-primary);
        border: none;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        }
      `
    case 'ghost':
      return css`
        background: transparent;
        color: var(--text-primary);
        border: none;
        
        &:hover:not(:disabled) {
          background: var(--bg-tertiary);
        }
      `
    default: // secondary
      return css`
        background: var(--gradient-card);
        color: var(--text-primary);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        box-shadow: var(--shadow-md);
        
        &:hover:not(:disabled) {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          transform: translateY(-2px);
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `
  }
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: 0.875rem;
        
        .button-icon {
          width: 16px;
          height: 16px;
        }
      `
    case 'large':
      return css`
        padding: var(--spacing-lg) var(--spacing-xl);
        font-size: 1.125rem;
        
        .button-icon {
          width: 24px;
          height: 24px;
        }
      `
    default: // medium
      return css`
        padding: var(--spacing-md) var(--spacing-lg);
        font-size: 1rem;
        
        .button-icon {
          width: 20px;
          height: 20px;
        }
      `
  }
}

const StyledButton = styled(motion.button) <{
  $variant: string
  $size: string
  $fullWidth: boolean
  $loading: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.$loading || props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.$loading || props.disabled ? 'none' : 'auto'};
  
  ${props => getVariantStyles(props.$variant)}
  ${props => getSizeStyles(props.$size)}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  icon,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <div className="button-content">
        {loading ? (
          <LoadingSpinner />
        ) : icon ? (
          <span className="button-icon">{icon}</span>
        ) : null}
        {children}
      </div>
    </StyledButton>
  )
}