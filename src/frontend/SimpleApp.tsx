import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #111827 50%, #1f2937 100%);
  color: #f9fafb;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`

const Header = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const StatCard = styled.div`
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(25px);
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(99, 102, 241, 0.3);
    border-color: rgba(99, 102, 241, 0.5);
  }
`

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #d1d5db;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`

const StatValue = styled.div`
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

const StatusIndicator = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.connected ? '#10b981' : '#ef4444'};
  }
`

function SimpleApp() {
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalRevenue: 0,
        successRate: '0'
    })
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        // Fetch stats from API
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                    setConnected(true)
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
                setConnected(false)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 5000) // Refresh every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <Container>
            <Header>RaaS Simulation Dashboard</Header>

            <StatusIndicator connected={connected}>
                <span className="dot"></span>
                <span>{connected ? 'Connected to Backend' : 'Disconnected'}</span>
            </StatusIndicator>

            <StatsGrid>
                <StatCard>
                    <StatTitle>Total Campaigns</StatTitle>
                    <StatValue>{stats.totalCampaigns}</StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Active Campaigns</StatTitle>
                    <StatValue>{stats.activeCampaigns}</StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Total Revenue</StatTitle>
                    <StatValue>{stats.totalRevenue} BTC</StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Success Rate</StatTitle>
                    <StatValue>{stats.successRate}%</StatValue>
                </StatCard>
            </StatsGrid>

            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <p>Modern RaaS Simulation Interface</p>
                <p>Backend: http://localhost:3000 | Frontend: http://localhost:5173</p>
            </div>
        </Container>
    )
}

export default SimpleApp