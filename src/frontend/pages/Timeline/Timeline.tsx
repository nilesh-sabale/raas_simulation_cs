import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Clock, Filter, Calendar, Activity } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'

const TimelineContainer = styled.div`
  padding: var(--spacing-lg);
  min-height: calc(100vh - var(--header-height));
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    svg {
      color: var(--color-primary);
    }
  }
`

const TimelineContent = styled(Card)`
  padding: var(--spacing-lg);
  
  .timeline-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border);
    
    &:last-child {
      border-bottom: none;
    }
    
    .timeline-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.875rem;
    }
    
    .timeline-content {
      flex: 1;
      
      .timeline-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
      }
      
      .timeline-time {
        font-size: 0.875rem;
        color: var(--text-muted);
      }
    }
  }
`

const Timeline: React.FC = () => {
    const { logs, fetchLogs, loading } = useAppStore()

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    return (
        <TimelineContainer>
            <PageHeader>
                <h1>
                    <Clock />
                    Timeline View
                </h1>
                <Button
                    variant="secondary"
                    onClick={fetchLogs}
                    loading={loading.logs}
                    icon={<Activity />}
                >
                    Refresh
                </Button>
            </PageHeader>

            <TimelineContent>
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                        No timeline events available
                    </div>
                ) : (
                    logs.slice(0, 20).map((log, index) => (
                        <div key={log.id} className="timeline-item">
                            <div className="timeline-icon">
                                {index + 1}
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-title">{log.message}</div>
                                <div className="timeline-time">
                                    {new Date(log.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </TimelineContent>
        </TimelineContainer>
    )
}

export default Timeline