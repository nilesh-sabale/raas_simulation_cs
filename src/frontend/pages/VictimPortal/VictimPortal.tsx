import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import {
    Lock,
    AlertTriangle,
    Clock,
    Copy,
    CheckCircle,
    FileWarning,
    XCircle,
    Bitcoin
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../../components/common/Button'
import { toast } from 'react-hot-toast'

const glitchAnimation = keyframes`
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
`

const pulseGlow = keyframes`
    0%, 100% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.5); }
    50% { box-shadow: 0 0 40px rgba(255, 68, 68, 0.8); }
`

const VictimContainer = styled.div`
    min-height: 100vh;
    background: #0a0000;
    background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%);
    padding: var(--spacing-xl);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            repeating-linear-gradient(
                0deg,
                rgba(255, 68, 68, 0.03) 0px,
                transparent 1px,
                transparent 2px,
                rgba(255, 68, 68, 0.03) 3px
            );
        pointer-events: none;
        animation: ${glitchAnimation} 8s infinite;
    }
`

const RansomNotice = styled(motion.div)`
    max-width: 900px;
    margin: var(--spacing-xxl) auto;
    background: linear-gradient(135deg, #1a0000 0%, #2a0505 100%);
    border: 3px solid #ff4444;
    border-radius: var(--radius-lg);
    padding: var(--spacing-xxl);
    box-shadow: 
        0 20px 60px rgba(255, 68, 68, 0.4),
        inset 0 0 100px rgba(255, 0, 0, 0.1);
    animation: ${pulseGlow} 3s ease-in-out infinite;
`

const AlertHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    
    svg {
        width: 60px;
        height: 60px;
        color: #ff4444;
        animation: ${glitchAnimation} 2s infinite;
    }
    
    h1 {
        font-size: 3rem;
        font-weight: 800;
        color: #ff4444;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
    }
`

const WarningText = styled.div`
    background: rgba(255, 68, 68, 0.1);
    border-left: 4px solid #ff4444;
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    color: #ffcccc;
    font-size: 1.125rem;
    line-height: 1.6;

    strong {
        color: #ff4444;
        font-weight: 700;
    }

    p {
        margin-bottom: var(--spacing-md);

        &:last-child {
            margin-bottom: 0;
        }
    }
`

const CountdownContainer = styled.div`
    background: #000000;
    border: 2px solid #ff4444;
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    text-align: center;
`

const CountdownLabel = styled.div`
    font-size: 0.875rem;
    color: #ff8888;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
`

const CountdownTimer = styled.div`
    font-size: 3.5rem;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    color: #ff4444;
    text-shadow: 0 0 30px rgba(255, 68, 68, 0.8);
    letter-spacing: 4px;
`

const EncryptedFilesSection = styled.div`
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #ff4444;
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    max-height: 300px;
    overflow-y: auto;

    h3 {
        font-size: 1.125rem;
        color: #ff8888;
        margin-bottom: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
`

const FileList = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
`

const FileItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: rgba(255, 68, 68, 0.05);
    border-radius: var(--radius-sm);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: #ffcccc;

    svg {
        width: 16px;
        height: 16px;
        color: #ff4444;
    }
`

const PaymentSection = styled.div`
    background: #000000;
    border: 2px solid #ff4444;
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);

    h3 {
        font-size: 1.5rem;
        color: #ff4444;
        margin-bottom: var(--spacing-lg);
        text-transform: uppercase;
        letter-spacing: 1px;
    }
`

const PaymentAmount = styled.div`
    text-align: center;
    padding: var(--spacing-lg);
    background: rgba(255, 68, 68, 0.1);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);

    .label {
        font-size: 0.875rem;
        color: #ff8888;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: var(--spacing-sm);
    }

    .amount {
        font-size: 3rem;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        color: #ff4444;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);

        svg {
            width: 40px;
            height: 40px;
        }
    }
`

const WalletAddress = styled.div`
    background: #0a0000;
    border: 1px solid #ff4444;
    border-radius: var(--radius-sm);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);

    .label {
        font-size: 0.75rem;
        color: #ff8888;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: var(--spacing-xs);
    }

    .address-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .address {
        flex: 1;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875rem;
        color: #ffcccc;
        word-break: break-all;
    }

    .copy-btn {
        background: rgba(255, 68, 68, 0.2);
        border: 1px solid #ff4444;
        color: #ff4444;
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: rgba(255, 68, 68, 0.4);
        }

        svg {
            width: 16px;
            height: 16px;
        }
    }
`

const InstructionsList = styled.ol`
    color: #ffcccc;
    line-height: 1.8;
    margin-bottom: var(--spacing-lg);
    padding-left: var(--spacing-xl);

    li {
        margin-bottom: var(--spacing-sm);
    }

    code {
        background: rgba(255, 68, 68, 0.2);
        padding: 2px 8px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        color: #ff8888;
    }
`

const PaymentButton = styled(Button)`
    width: 100%;
    font-size: 1.25rem;
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
    
    &:hover {
        background: linear-gradient(135deg, #ff6666 0%, #ff0000 100%);
    }
`

const SuccessMessage = styled(motion.div)`
    background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
    color: #0a0a0a;
    padding: var(--spacing-xl);
    border-radius: var(--radius-md);
    text-align: center;

    svg {
        width: 60px;
        height: 60px;
        margin-bottom: var(--spacing-md);
    }

    h2 {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: var(--spacing-md);
    }

    p {
        font-size: 1.125rem;
    }
`

const DisclaimerFooter = styled.div`
    margin-top: var(--spacing-xxl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid #ff4444;
    text-align: center;
    color: #ff8888;
    font-size: 0.875rem;
    line-height: 1.6;
`

const mockEncryptedFiles = [
    'Documents\\Financial_Report_2024.pdf.locked',
    'Documents\\Client_Database.xlsx.locked',
    'Pictures\\Family_Photos_Vacation.zip.locked',
    'Projects\\Website_Source_Code.zip.locked',
    'Documents\\Passwords_Backup.txt.locked',
    'Videos\\Wedding_Footage.mp4.locked',
    'Documents\\Tax_Returns_2023.pdf.locked',
    'Work\\Presentation_Finals.pptx.locked',
    'Database\\Customer_Records.db.locked',
    'Documents\\Thesis_Final.docx.locked',
]

const VictimPortal: React.FC = () => {
    const navigate = useNavigate()
    const { setViewMode, setVictimSessionId } = useAppStore()
    const [timeLeft, setTimeLeft] = useState(72 * 60 * 60) // 72 hours in seconds
    const [isPaid, setIsPaid] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const walletAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    const ransomAmount = 0.15

    useEffect(() => {
        // Set view mode to victim
        setViewMode('victim')
        // Generate session ID
        const sessionId = `victim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        setVictimSessionId(sessionId)

        // Countdown timer
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [setViewMode, setVictimSessionId])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddress)
        toast.success('Wallet address copied to clipboard')
    }

    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000))
        setIsPaid(true)
        setIsProcessing(false)
        toast.success('Files decrypted successfully!')

        // After showing success, redirect to dashboard
        setTimeout(() => {
            navigate('/app/dashboard')
        }, 5000)
    }

    if (isPaid) {
        return (
            <VictimContainer>
                <RansomNotice
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <SuccessMessage
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                    >
                        <CheckCircle />
                        <h2>Payment Confirmed!</h2>
                        <p>Your files have been decrypted successfully.</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                            Redirecting to dashboard...
                        </p>
                    </SuccessMessage>
                </RansomNotice>
            </VictimContainer>
        )
    }

    return (
        <VictimContainer>
            <RansomNotice
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <AlertHeader>
                    <Lock />
                    <h1>FILES ENCRYPTED</h1>
                    <Lock />
                </AlertHeader>

                <WarningText>
                    <p>
                        <strong>⚠️ ATTENTION!</strong> All your important files have been encrypted using
                        military-grade AES-256 encryption. Your documents, photos, videos, and databases
                        are now inaccessible.
                    </p>
                    <p>
                        <strong>The only way to recover your files is to purchase the decryption key.</strong>
                    </p>
                    <p>
                        Any attempt to decrypt files by third-party software will result in permanent data loss.
                    </p>
                </WarningText>

                <CountdownContainer>
                    <CountdownLabel>
                        <Clock size={16} />
                        Time Remaining to Pay Before Price Doubles
                    </CountdownLabel>
                    <CountdownTimer>{formatTime(timeLeft)}</CountdownTimer>
                </CountdownContainer>

                <EncryptedFilesSection>
                    <h3>
                        <FileWarning size={20} />
                        Encrypted Files ({mockEncryptedFiles.length})
                    </h3>
                    <FileList>
                        {mockEncryptedFiles.map((file, index) => (
                            <FileItem
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <XCircle />
                                {file}
                            </FileItem>
                        ))}
                    </FileList>
                </EncryptedFilesSection>

                <PaymentSection>
                    <h3>💰 Payment Instructions</h3>

                    <PaymentAmount>
                        <div className="label">Ransom Amount</div>
                        <div className="amount">
                            <Bitcoin />
                            {ransomAmount} BTC
                        </div>
                    </PaymentAmount>

                    <WalletAddress>
                        <div className="label">Bitcoin Wallet Address</div>
                        <div className="address-container">
                            <div className="address">{walletAddress}</div>
                            <button className="copy-btn" onClick={handleCopyAddress}>
                                <Copy />
                            </button>
                        </div>
                    </WalletAddress>

                    <InstructionsList>
                        <li>Purchase <code>{ransomAmount} BTC</code> from any cryptocurrency exchange</li>
                        <li>Send the exact amount to the wallet address above</li>
                        <li>Click the "I Have Made Payment" button below</li>
                        <li>Wait for transaction confirmation (5-15 minutes)</li>
                        <li>Your decryption key will be automatically delivered</li>
                        <li>All files will be restored to their original state</li>
                    </InstructionsList>

                    <PaymentButton
                        variant="danger"
                        onClick={handlePayment}
                        loading={isProcessing}
                    >
                        {isProcessing ? 'Verifying Payment...' : 'I Have Made Payment'}
                    </PaymentButton>
                </PaymentSection>

                <DisclaimerFooter>
                    <AlertTriangle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    <strong>EDUCATIONAL SIMULATION ONLY</strong>
                    <br />
                    This is a safe educational demonstration. No real files are encrypted,
                    no actual payments are processed, and no genuine security threats exist.
                    This simulation is designed for cybersecurity education purposes only.
                </DisclaimerFooter>
            </RansomNotice>
        </VictimContainer>
    )
}

export default VictimPortal
