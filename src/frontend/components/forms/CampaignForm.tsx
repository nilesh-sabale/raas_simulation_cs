import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Target, DollarSign, Users, Shield } from 'lucide-react'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Card } from '@components/common/Card'
import { Modal } from '@components/common/Modal'
import { CampaignFormData } from '@/types'
import { apiService } from '@services/api'

interface CampaignFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (campaign: any) => void
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`

const FormSection = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    svg {
      color: var(--color-primary);
      width: 18px;
      height: 18px;
    }
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: var(--spacing-md);
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
  }
  
  option {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`

const FormActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const PreviewCard = styled(Card)`
  background: rgba(0, 255, 136, 0.05);
  border-color: var(--color-primary);
  
  h5 {
    color: var(--color-primary);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
  
  .preview-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
    
    .label {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    
    .value {
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.875rem;
    }
  }
`

export const CampaignForm: React.FC<CampaignFormProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<CampaignFormData>()

    const watchedValues = watch()

    const onSubmit = async (data: CampaignFormData) => {
        setLoading(true)
        try {
            const result = await apiService.createCampaign(data)
            toast.success('Campaign created successfully!')

            if (onSuccess) {
                onSuccess(result)
            }

            reset()
            onClose()
        } catch (error) {
            toast.error('Failed to create campaign')
            console.error('Campaign creation error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const sectors = [
        'Healthcare',
        'Finance',
        'Education',
        'Government',
        'Manufacturing',
        'Retail',
        'Technology',
        'Energy',
        'Transportation',
        'Other'
    ]

    const encryptionMethods = [
        'AES-256',
        'RSA-2048',
        'ChaCha20',
        'Blowfish',
        'Base64 (Demo)',
        'Caesar (Demo)'
    ]

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Campaign"
            size="large"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormContainer>
                    <FormSection>
                        <h4>
                            <Target />
                            Campaign Details
                        </h4>

                        <Input
                            label="Campaign Name"
                            placeholder="Enter campaign name"
                            {...register('name', { required: 'Campaign name is required' })}
                            error={errors.name?.message}
                        />

                        <div>
                            <label style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--spacing-sm)',
                                display: 'block'
                            }}>
                                Description
                            </label>
                            <TextArea
                                placeholder="Describe the campaign objectives and target profile"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && (
                                <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                    </FormSection>

                    <FormSection>
                        <h4>
                            <Users />
                            Target Configuration
                        </h4>

                        <FormGrid>
                            <div>
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--spacing-sm)',
                                    display: 'block'
                                }}>
                                    Target Sector
                                </label>
                                <Select {...register('sector', { required: 'Sector is required' })}>
                                    <option value="">Select sector</option>
                                    {sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </Select>
                                {errors.sector && (
                                    <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>
                                        {errors.sector.message}
                                    </span>
                                )}
                            </div>

                            <Input
                                label="Target Size"
                                type="number"
                                placeholder="Number of targets"
                                {...register('targetSize', {
                                    required: 'Target size is required',
                                    min: { value: 1, message: 'Must be at least 1' }
                                })}
                                error={errors.targetSize?.message}
                            />
                        </FormGrid>
                    </FormSection>

                    <FormSection>
                        <h4>
                            <DollarSign />
                            Financial Configuration
                        </h4>

                        <FormGrid>
                            <Input
                                label="Ransom Amount (BTC)"
                                type="number"
                                step="0.0001"
                                placeholder="0.05"
                                {...register('ransomAmount', {
                                    required: 'Ransom amount is required',
                                    min: { value: 0.0001, message: 'Must be at least 0.0001 BTC' }
                                })}
                                error={errors.ransomAmount?.message}
                            />

                            <Input
                                label="Payment Deadline"
                                type="datetime-local"
                                {...register('deadline', { required: 'Deadline is required' })}
                                error={errors.deadline?.message}
                            />
                        </FormGrid>
                    </FormSection>

                    <FormSection>
                        <h4>
                            <Shield />
                            Technical Configuration
                        </h4>

                        <FormGrid>
                            <div>
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--spacing-sm)',
                                    display: 'block'
                                }}>
                                    Encryption Method
                                </label>
                                <Select {...register('encryptionMethod', { required: 'Encryption method is required' })}>
                                    <option value="">Select method</option>
                                    {encryptionMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </Select>
                                {errors.encryptionMethod && (
                                    <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>
                                        {errors.encryptionMethod.message}
                                    </span>
                                )}
                            </div>

                            <Input
                                label="Affiliate ID"
                                placeholder="affiliate-001"
                                {...register('affiliateId', { required: 'Affiliate ID is required' })}
                                error={errors.affiliateId?.message}
                            />
                        </FormGrid>
                    </FormSection>

                    {watchedValues.name && (
                        <PreviewCard>
                            <h5>Campaign Preview</h5>
                            <div className="preview-item">
                                <span className="label">Name:</span>
                                <span className="value">{watchedValues.name}</span>
                            </div>
                            <div className="preview-item">
                                <span className="label">Sector:</span>
                                <span className="value">{watchedValues.sector || 'Not selected'}</span>
                            </div>
                            <div className="preview-item">
                                <span className="label">Targets:</span>
                                <span className="value">{watchedValues.targetSize || 0}</span>
                            </div>
                            <div className="preview-item">
                                <span className="label">Ransom:</span>
                                <span className="value">{watchedValues.ransomAmount || 0} BTC</span>
                            </div>
                            <div className="preview-item">
                                <span className="label">Method:</span>
                                <span className="value">{watchedValues.encryptionMethod || 'Not selected'}</span>
                            </div>
                        </PreviewCard>
                    )}

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            icon={<Target />}
                        >
                            Create Campaign
                        </Button>
                    </FormActions>
                </FormContainer>
            </form>
        </Modal>
    )
}