import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { toast } from 'react-hot-toast'
import { Upload, Lock, Unlock, FileText, AlertTriangle } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { apiService } from '../../services/api'

interface EncryptionFormProps {
  onEncryptionComplete?: (result: any) => void
}

const FormContainer = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
`

const FormSection = styled.div`
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    svg {
      color: var(--color-primary);
    }
  }
`

const FileUploadArea = styled.div<{ isDragOver: boolean; hasFile: boolean }>`
  border: 2px dashed ${props =>
    props.hasFile ? 'var(--color-primary)' :
      props.isDragOver ? 'var(--color-primary)' : 'var(--border)'
  };
  border-radius: var(--radius-lg);
  padding: var(--spacing-xxl);
  text-align: center;
  background: ${props =>
    props.hasFile ? 'rgba(0, 255, 136, 0.05)' :
      props.isDragOver ? 'rgba(0, 255, 136, 0.1)' : 'var(--bg-glass)'
  };
  transition: var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-primary);
    background: rgba(0, 255, 136, 0.05);
  }
  
  .upload-icon {
    font-size: 3rem;
    color: ${props => props.hasFile ? 'var(--color-primary)' : 'var(--text-muted)'};
    margin-bottom: var(--spacing-md);
  }
  
  .upload-text {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
  
  .upload-hint {
    color: var(--text-muted);
    font-size: 0.875rem;
  }
`

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-md);
  
  .file-icon {
    color: var(--color-primary);
  }
  
  .file-details {
    flex: 1;
    
    .file-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }
    
    .file-size {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  }
`

const MethodSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`

const MethodCard = styled.div<{ selected: boolean }>`
  padding: var(--spacing-lg);
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'var(--border)'};
  border-radius: var(--radius-md);
  background: ${props => props.selected ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-glass)'};
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    border-color: var(--color-primary);
    background: rgba(0, 255, 136, 0.05);
  }
  
  .method-name {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .method-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }
`

const ShiftInput = styled.div`
  margin-top: var(--spacing-md);
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }
  
  input {
    width: 100px;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
    }
  }
`

const ResultSection = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  
  h4 {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .result-content {
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--text-secondary);
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
`

const RansomNote = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  
  .ransom-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-danger);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .ransom-details {
    color: var(--text-primary);
    line-height: 1.6;
    
    .amount {
      font-weight: 700;
      color: var(--color-danger);
      font-family: 'JetBrains Mono', monospace;
    }
    
    .address {
      font-family: 'JetBrains Mono', monospace;
      background: var(--bg-secondary);
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      margin: var(--spacing-sm) 0;
      word-break: break-all;
    }
  }
`

const DecryptSection = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-lg);
  
  h4 {
    color: var(--color-primary);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .decrypt-content {
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    line-height: 1.6;
    white-space: pre-wrap;
  }
`

export const EncryptionForm: React.FC<EncryptionFormProps> = ({ onEncryptionComplete }) => {
  const [file, setFile] = useState<File | null>(null)
  const [method, setMethod] = useState<'base64' | 'caesar'>('base64')
  const [shift, setShift] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [decrypted, setDecrypted] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 1024 * 1024) { // 1MB limit
      toast.error('File size must be less than 1MB')
      return
    }

    if (!selectedFile.type.startsWith('text/')) {
      toast.error('Please select a text file')
      return
    }

    setFile(selectedFile)
    setResult(null)
    setDecrypted(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleEncrypt = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('method', method)
      if (method === 'caesar') {
        formData.append('shift', shift.toString())
      }

      const result = await apiService.encryptFile(formData, 'demo-victim-001')
      setResult(result)

      if (onEncryptionComplete) {
        onEncryptionComplete(result)
      }

      toast.success('File encrypted successfully!')
    } catch (error) {
      toast.error('Encryption failed')
      console.error('Encryption error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!result) return

    try {
      const decryptResult = await apiService.decryptContent(
        result.method,
        result.encoded,
        method === 'caesar' ? shift : undefined
      )
      setDecrypted(decryptResult.decoded)
      toast.success('File decrypted successfully!')
    } catch (error) {
      toast.error('Decryption failed')
      console.error('Decryption error:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <FormContainer>
      <FormSection>
        <h3>
          <Upload />
          File Upload
        </h3>

        <FileUploadArea
          isDragOver={isDragOver}
          hasFile={!!file}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="upload-icon">
            {file ? <FileText /> : <Upload />}
          </div>
          <div className="upload-text">
            {file ? file.name : 'Drop your file here or click to browse'}
          </div>
          <div className="upload-hint">
            {file ? 'Click to select a different file' : 'Only text files up to 1MB are supported'}
          </div>
        </FileUploadArea>

        <input
          ref={fileInputRef}
          type="file"
          accept="text/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) {
              handleFileSelect(selectedFile)
            }
          }}
        />

        {file && (
          <FileInfo>
            <FileText className="file-icon" />
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
          </FileInfo>
        )}
      </FormSection>

      <FormSection>
        <h3>
          <Lock />
          Encryption Method
        </h3>

        <MethodSelector>
          <MethodCard
            selected={method === 'base64'}
            onClick={() => setMethod('base64')}
          >
            <div className="method-name">Base64 Encoding</div>
            <div className="method-description">
              Simple reversible encoding for demonstration purposes. Not actual encryption.
            </div>
          </MethodCard>

          <MethodCard
            selected={method === 'caesar'}
            onClick={() => setMethod('caesar')}
          >
            <div className="method-name">Caesar Cipher</div>
            <div className="method-description">
              Classic substitution cipher with configurable shift value. Educational only.
            </div>
          </MethodCard>
        </MethodSelector>

        {method === 'caesar' && (
          <ShiftInput>
            <label>Shift Value:</label>
            <input
              type="number"
              min="1"
              max="25"
              value={shift}
              onChange={(e) => setShift(parseInt(e.target.value) || 3)}
            />
          </ShiftInput>
        )}

        <Button
          variant="primary"
          onClick={handleEncrypt}
          loading={loading}
          disabled={!file}
          icon={<Lock />}
          fullWidth
        >
          Encrypt File
        </Button>
      </FormSection>

      {result && (
        <>
          <ResultSection>
            <h4>
              <Lock />
              Encrypted Content
            </h4>
            <div className="result-content">
              {result.encoded}
            </div>
          </ResultSection>

          <RansomNote>
            <div className="ransom-header">
              <AlertTriangle />
              RANSOM DEMAND (SIMULATION)
            </div>
            <div className="ransom-details">
              <p>Your file has been encrypted! To recover your data, you must pay:</p>
              <p>Amount: <span className="amount">{result.ransom.amount} BTC</span></p>
              <p>Payment Address:</p>
              <div className="address">{result.ransom.address}</div>
              <p>Payment ID: {result.ransom.payment_id}</p>
              <p><strong>This is a simulation - no real payment is required!</strong></p>
            </div>
          </RansomNote>

          <FormSection>
            <Button
              variant="secondary"
              onClick={handleDecrypt}
              icon={<Unlock />}
              fullWidth
            >
              Decrypt File (Simulation)
            </Button>
          </FormSection>

          {decrypted && (
            <DecryptSection>
              <h4>
                <Unlock />
                Decrypted Content
              </h4>
              <div className="decrypt-content">
                {decrypted}
              </div>
            </DecryptSection>
          )}
        </>
      )}
    </FormContainer>
  )
}