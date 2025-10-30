import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'small' | 'medium' | 'large' | 'fullscreen'
    closeOnOverlayClick?: boolean
    showCloseButton?: boolean
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
`

const getSizeStyles = (size: string) => {
    switch (size) {
        case 'small':
            return `
        max-width: 400px;
        width: 100%;
      `
        case 'large':
            return `
        max-width: 800px;
        width: 100%;
      `
        case 'fullscreen':
            return `
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        border-radius: 0;
      `
        default: // medium
            return `
        max-width: 600px;
        width: 100%;
      `
    }
}

const ModalContent = styled(motion.div) <{ $size: string }>`
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  ${props => getSizeStyles(props.$size)}
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    margin: var(--spacing-md);
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border);
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`

const ModalBody = styled.div`
  padding: var(--spacing-xl);
`

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
}

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 50
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: 0.2
        }
    }
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    closeOnOverlayClick = true,
    showCloseButton = true
}) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget && closeOnOverlayClick) {
            onClose()
        }
    }

    if (typeof window === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <Overlay
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleOverlayClick}
                >
                    <ModalContent
                        $size={size}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {(title || showCloseButton) && (
                            <ModalHeader>
                                {title && <ModalTitle>{title}</ModalTitle>}
                                {showCloseButton && (
                                    <CloseButton onClick={onClose}>
                                        <X />
                                    </CloseButton>
                                )}
                            </ModalHeader>
                        )}

                        <ModalBody>
                            {children}
                        </ModalBody>
                    </ModalContent>
                </Overlay>
            )}
        </AnimatePresence>,
        document.body
    )
}