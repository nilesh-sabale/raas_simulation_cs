import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, Clock, AlertCircle, Copy } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StatCard } from '../../components/charts/StatCard'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

const PaymentsContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  background: var(--gradient-bg);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-glow);
    opacity: 0.2;
    z-index: -1;
    animation: cyberShift 35s ease-in-out infinite reverse;
  }
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
    align-items: flex-start;
  }
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  animation: neonPulse 3s ease-in-out infinite;
  
  svg {
    color: var(--color-primary);
    filter: drop-shadow(0 0 10px var(--color-primary));
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`

const PaymentsTable = styled(Card)`
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
`

const Table = styled.div`
  overflow-x: auto;
`

const TableRow = styled.div<{ isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 120px 100px 150px 120px 100px;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border);
  align-items: center;
  
  ${props => props.isHeader && `
    background: var(--bg-tertiary);
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  `}
  
  &:hover:not(:first-child) {
    background: var(--bg-glass);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`

const PaymentStatus = styled.span<{ status: 'paid' | 'pending' | 'expired' }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => {
    switch (props.status) {
      case 'paid':
        return `
          background: rgba(0, 255, 136, 0.2);
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        `
      case 'pending':
        return `
          background: rgba(255, 170, 0, 0.2);
          color: var(--color-warning);
          border: 1px solid var(--color-warning);
        `
      case 'expired':
        return `
          background: rgba(255, 68, 68, 0.2);
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
        `
      default:
        return `
          background: var(--bg-tertiary);
          color: var(--text-muted);
          border: 1px solid var(--border);
        `
    }
  }}
  
  svg {
    width: 12px;
    height: 12px;
  }
`

const AddressCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  
  .address {
    color: var(--text-secondary);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .copy-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: var(--transition-normal);
    
    &:hover {
      color: var(--color-primary);
      background: var(--bg-tertiary);
    }
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: var(--spacing-xxl);
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
`

const Payments: React.FC = () => {
  const { payments, loading, fetchPayments } = useAppStore()
  const [markingPaid, setMarkingPaid] = useState<number | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const handleMarkPaid = async (paymentId: number) => {
    setMarkingPaid(paymentId)
    try {
      await apiService.markPaymentPaid(paymentId)
      toast.success('Payment marked as paid')
      fetchPayments()
    } catch (error) {
      toast.error('Failed to mark payment as paid')
    } finally {
      setMarkingPaid(null)
    }
  }

  const getPaymentStatus = (payment: any): 'paid' | 'pending' | 'expired' => {
    if (payment.paid) return 'paid'

    // Check if payment is expired (older than 7 days for demo)
    const createdAt = new Date(payment.createdAt)
    const now = new Date()
    const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysDiff > 7) return 'expired'
    return 'pending'
  }

  const getStatusIcon = (status: 'paid' | 'pending' | 'expired') => {
    switch (status) {
      case 'paid': return <CheckCircle />
      case 'pending': return <Clock />
      case 'expired': return <AlertCircle />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Unknown'
    }
  }

  const totalRevenue = payments
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = payments.filter(p => !p.paid && getPaymentStatus(p) === 'pending')
  const expiredPayments = payments.filter(p => getPaymentStatus(p) === 'expired')

  if (loading.payments) {
    return (
      <PaymentsContainer>
        <PageHeader>
          <PageTitle>
            <CreditCard />
            Payment Management
          </PageTitle>
        </PageHeader>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
          Loading payments...
        </div>
      </PaymentsContainer>
    )
  }

  return (
    <PaymentsContainer>
      <PageHeader>
        <PageTitle>
          <CreditCard />
          Payment Management
        </PageTitle>
      </PageHeader>

      <StatsGrid>
        <StatCard
          title="Total Revenue"
          value={totalRevenue.toFixed(4)}
          suffix=" BTC"
          icon={<CreditCard />}
          loading={loading.payments}
        />
        <StatCard
          title="Paid Transactions"
          value={payments.filter(p => p.paid).length}
          icon={<CheckCircle />}
          loading={loading.payments}
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments.length}
          icon={<Clock />}
          loading={loading.payments}
        />
        <StatCard
          title="Expired Demands"
          value={expiredPayments.length}
          icon={<AlertCircle />}
          loading={loading.payments}
        />
      </StatsGrid>

      <PaymentsTable>
        <TableHeader>
          <h3>Payment Transactions</h3>
          <Button variant="secondary" size="small">
            Export Data
          </Button>
        </TableHeader>

        {payments.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-icon">💰</div>
            <h3>No Payments Yet</h3>
            <p>
              Payment transactions will appear here once victims start making ransom payments.
              This includes both completed and pending payment demands.
            </p>
          </EmptyState>
        ) : (
          <Table>
            <TableRow isHeader>
              <div>Victim ID</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Address</div>
              <div>Created</div>
              <div>Actions</div>
            </TableRow>

            {payments.map((payment) => {
              const status = getPaymentStatus(payment)
              return (
                <TableRow key={payment.id}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {payment.victim}
                  </div>

                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    color: 'var(--color-primary)'
                  }}>
                    {payment.amount.toFixed(4)} BTC
                  </div>

                  <PaymentStatus status={status}>
                    {getStatusIcon(status)}
                    {status}
                  </PaymentStatus>

                  <AddressCell>
                    <span className="address">{payment.address}</span>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopyAddress(payment.address)}
                      title="Copy address"
                    >
                      <Copy />
                    </button>
                  </AddressCell>

                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {formatDate(payment.created_at)}
                  </div>

                  <div>
                    {!payment.paid && status === 'pending' && (
                      <Button
                        size="small"
                        variant="primary"
                        loading={markingPaid === payment.id}
                        onClick={() => handleMarkPaid(payment.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                    {payment.paid && (
                      <span style={{
                        color: 'var(--color-primary)',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        ✓ Paid
                      </span>
                    )}
                  </div>
                </TableRow>
              )
            })}
          </Table>
        )}
      </PaymentsTable>
    </PaymentsContainer>
  )
}

export default Payments