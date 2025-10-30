import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled' | 'outlined'
    fullWidth?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
}

const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
`

const InputWrapper = styled.div<{ $hasIcon: boolean; $iconPosition: string }>`
  position: relative;
  display: flex;
  align-items: center;
  
  .input-icon {
    position: absolute;
    ${props => props.$iconPosition === 'left' ? 'left: var(--spacing-md)' : 'right: var(--spacing-md)'};
    color: var(--text-muted);
    pointer-events: none;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const getVariantStyles = (variant: string) => {
    switch (variant) {
        case 'filled':
            return css`
        background: var(--bg-tertiary);
        border: 1px solid transparent;
        
        &:focus {
          background: var(--bg-glass);
          border-color: var(--color-primary);
        }
      `
        case 'outlined':
            return css`
        background: transparent;
        border: 2px solid var(--border);
        
        &:focus {
          border-color: var(--color-primary);
        }
      `
        default:
            return css`
        background: var(--bg-glass);
        border: 1px solid var(--border);
        
        &:focus {
          border-color: var(--color-primary);
        }
      `
    }
}

const StyledInput = styled.input<{
    $variant: string
    $hasError: boolean
    $hasIcon: boolean
    $iconPosition: string
}>`
  width: 100%;
  padding: var(--spacing-md) ${props => {
        if (props.$hasIcon) {
            return props.$iconPosition === 'left'
                ? 'var(--spacing-md) var(--spacing-md) calc(var(--spacing-md) * 2 + 18px)'
                : 'calc(var(--spacing-md) * 2 + 18px) var(--spacing-md) var(--spacing-md)'
        }
        return 'var(--spacing-md)'
    }};
  border-radius: var(--radius-sm);
  font-size: 1rem;
  color: var(--text-primary);
  transition: var(--transition-normal);
  
  ${props => getVariantStyles(props.$variant)}
  
  ${props => props.$hasError && css`
    border-color: var(--color-danger) !important;
    box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
  `}
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const HelperText = styled.span<{ $isError: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isError ? 'var(--color-danger)' : 'var(--text-muted)'};
  margin-top: var(--spacing-xs);
`

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    variant = 'default',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className,
    ...props
}, ref) => {
    const hasIcon = Boolean(icon)
    const hasError = Boolean(error)

    return (
        <InputContainer $fullWidth={fullWidth} className={className}>
            {label && <Label>{label}</Label>}

            <InputWrapper $hasIcon={hasIcon} $iconPosition={iconPosition}>
                {hasIcon && (
                    <span className="input-icon">
                        {icon}
                    </span>
                )}

                <StyledInput
                    ref={ref}
                    $variant={variant}
                    $hasError={hasError}
                    $hasIcon={hasIcon}
                    $iconPosition={iconPosition}
                    {...props}
                />
            </InputWrapper>

            {(error || helperText) && (
                <HelperText $isError={hasError}>
                    {error || helperText}
                </HelperText>
            )}
        </InputContainer>
    )
})