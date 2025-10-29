import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Network, Users, Server, Shield, Activity } from 'lucide-react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'

const NetworkContainer = styled.div`
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg);
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
  font-size: 3rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  letter-spacing: -0.02em;
`

const NetworkCanvas = styled.canvas`
  width: 100%;
  height: 600px;
  border-radius: var(--radius-xl);
  background: var(--gradient-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`

const NetworkStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`

const StatItem = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--gradient-card);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .icon {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .value {
    font-size: 2rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--spacing-xs);
  }
  
  .label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }
`

const ControlPanel = styled(Card)`
  margin-bottom: var(--spacing-xl);
  
  .controls {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
`

interface NetworkNode {
    id: string
    type: 'operator' | 'affiliate' | 'victim' | 'server'
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
    label: string
    connections: string[]
}

const NetworkPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const [nodes, setNodes] = useState<NetworkNode[]>([])
    const [isRunning, setIsRunning] = useState(true)
    const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)

    // Initialize network nodes
    useEffect(() => {
        const initialNodes: NetworkNode[] = [
            // Operator (center)
            {
                id: 'operator-1',
                type: 'operator',
                x: 400,
                y: 300,
                vx: 0,
                vy: 0,
                radius: 25,
                color: '#6366f1',
                label: 'RaaS Operator',
                connections: ['affiliate-1', 'affiliate-2', 'affiliate-3', 'server-1']
            },
            // Affiliates
            {
                id: 'affiliate-1',
                type: 'affiliate',
                x: 200,
                y: 150,
                vx: 0,
                vy: 0,
                radius: 20,
                color: '#8b5cf6',
                label: 'Shadow_Broker',
                connections: ['victim-1', 'victim-2', 'operator-1']
            },
            {
                id: 'affiliate-2',
                type: 'affiliate',
                x: 600,
                y: 150,
                vx: 0,
                vy: 0,
                radius: 20,
                color: '#8b5cf6',
                label: 'CyberPhantom',
                connections: ['victim-3', 'victim-4', 'operator-1']
            },
            {
                id: 'affiliate-3',
                type: 'affiliate',
                x: 400,
                y: 100,
                vx: 0,
                vy: 0,
                radius: 20,
                color: '#8b5cf6',
                label: 'DarkNet_King',
                connections: ['victim-5', 'operator-1']
            },
            // Victims
            {
                id: 'victim-1',
                type: 'victim',
                x: 100,
                y: 200,
                vx: 0,
                vy: 0,
                radius: 15,
                color: '#ef4444',
                label: 'Healthcare Corp',
                connections: ['affiliate-1']
            },
            {
                id: 'victim-2',
                type: 'victim',
                x: 150,
                y: 300,
                vx: 0,
                vy: 0,
                radius: 15,
                color: '#ef4444',
                label: 'Finance Ltd',
                connections: ['affiliate-1']
            },
            {
                id: 'victim-3',
                type: 'victim',
                x: 650,
                y: 200,
                vx: 0,
                vy: 0,
                radius: 15,
                color: '#ef4444',
                label: 'Education Inc',
                connections: ['affiliate-2']
            },
            {
                id: 'victim-4',
                type: 'victim',
                x: 700,
                y: 300,
                vx: 0,
                vy: 0,
                radius: 15,
                color: '#ef4444',
                label: 'Manufacturing Co',
                connections: ['affiliate-2']
            },
            {
                id: 'victim-5',
                type: 'victim',
                x: 400,
                y: 50,
                vx: 0,
                vy: 0,
                radius: 15,
                color: '#ef4444',
                label: 'Retail Chain',
                connections: ['affiliate-3']
            },
            // Servers
            {
                id: 'server-1',
                type: 'server',
                x: 400,
                y: 450,
                vx: 0,
                vy: 0,
                radius: 18,
                color: '#06b6d4',
                label: 'C&C Server',
                connections: ['operator-1']
            }
        ]

        setNodes(initialNodes)
    }, [])

    // Animation loop
    useEffect(() => {
        if (!isRunning) return

        const animate = () => {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Set canvas size
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

            // Clear canvas
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'
            ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

            // Draw connections
            nodes.forEach(node => {
                node.connections.forEach(connectionId => {
                    const connectedNode = nodes.find(n => n.id === connectionId)
                    if (connectedNode) {
                        ctx.beginPath()
                        ctx.moveTo(node.x, node.y)
                        ctx.lineTo(connectedNode.x, connectedNode.y)
                        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
                        ctx.lineWidth = 2
                        ctx.stroke()

                        // Animate data flow
                        const progress = (Date.now() / 2000) % 1
                        const flowX = node.x + (connectedNode.x - node.x) * progress
                        const flowY = node.y + (connectedNode.y - node.y) * progress

                        ctx.beginPath()
                        ctx.arc(flowX, flowY, 3, 0, Math.PI * 2)
                        ctx.fillStyle = '#6366f1'
                        ctx.fill()
                    }
                })
            })

            // Draw nodes
            nodes.forEach(node => {
                // Node glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2)
                gradient.addColorStop(0, `${node.color}40`)
                gradient.addColorStop(1, 'transparent')
                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2)
                ctx.fill()

                // Node circle
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
                ctx.fillStyle = node.color
                ctx.fill()
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
                ctx.lineWidth = 2
                ctx.stroke()

                // Node label
                ctx.fillStyle = '#f9fafb'
                ctx.font = '12px Inter'
                ctx.textAlign = 'center'
                ctx.fillText(node.label, node.x, node.y + node.radius + 15)

                // Animate nodes slightly
                node.x += Math.sin(Date.now() / 1000 + node.id.length) * 0.5
                node.y += Math.cos(Date.now() / 1000 + node.id.length) * 0.5
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [nodes, isRunning])

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // Find clicked node
        const clickedNode = nodes.find(node => {
            const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
            return distance <= node.radius
        })

        setSelectedNode(clickedNode || null)
    }

    const toggleAnimation = () => {
        setIsRunning(!isRunning)
    }

    const resetNetwork = () => {
        // Reset node positions
        setNodes(prevNodes =>
            prevNodes.map(node => ({
                ...node,
                x: Math.random() * 600 + 100,
                y: Math.random() * 400 + 100
            }))
        )
    }

    return (
        <NetworkContainer>
            <PageHeader>
                <PageTitle>
                    <Network />
                    Network Topology
                </PageTitle>
                <div style={{ color: 'var(--text-secondary)' }}>
                    Real-time network visualization
                </div>
            </PageHeader>

            <NetworkStats>
                <StatItem>
                    <div className="icon"><Server /></div>
                    <div className="value">1</div>
                    <div className="label">C&C Servers</div>
                </StatItem>
                <StatItem>
                    <div className="icon"><Shield /></div>
                    <div className="value">1</div>
                    <div className="label">Operators</div>
                </StatItem>
                <StatItem>
                    <div className="icon"><Users /></div>
                    <div className="value">3</div>
                    <div className="label">Affiliates</div>
                </StatItem>
                <StatItem>
                    <div className="icon"><Activity /></div>
                    <div className="value">5</div>
                    <div className="label">Targets</div>
                </StatItem>
            </NetworkStats>

            <ControlPanel>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Network Controls</h3>
                <div className="controls">
                    <Button
                        variant={isRunning ? "danger" : "primary"}
                        onClick={toggleAnimation}
                    >
                        {isRunning ? 'Pause Animation' : 'Start Animation'}
                    </Button>
                    <Button variant="secondary" onClick={resetNetwork}>
                        Randomize Layout
                    </Button>
                    {selectedNode && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--gradient-card)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <strong>{selectedNode.label}</strong> ({selectedNode.type})
                        </div>
                    )}
                </div>
            </ControlPanel>

            <Card>
                <NetworkCanvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                />
            </Card>
        </NetworkContainer>
    )
}

export default NetworkPage