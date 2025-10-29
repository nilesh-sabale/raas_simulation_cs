import React from 'react'
import styled from 'styled-components'
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import { ChartDataPoint } from '@/types'

interface LineChartProps {
    data: ChartDataPoint[]
    title?: string
    height?: number
    color?: string
    showGrid?: boolean
    showLegend?: boolean
    animate?: boolean
}

const ChartContainer = styled.div`
  width: 100%;
  
  .recharts-tooltip-wrapper {
    .recharts-default-tooltip {
      background: var(--bg-card) !important;
      border: 1px solid var(--border) !important;
      border-radius: var(--radius-sm) !important;
      box-shadow: 0 10px 30px var(--shadow) !important;
      
      .recharts-tooltip-label {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        margin-bottom: 0.5rem !important;
      }
      
      .recharts-tooltip-item {
        color: var(--color-primary) !important;
        font-weight: 500 !important;
      }
    }
  }
  
  .recharts-legend-wrapper {
    .recharts-legend-item {
      .recharts-legend-item-text {
        color: var(--text-secondary) !important;
        font-size: 0.875rem !important;
      }
    }
  }
`

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`

export const LineChart: React.FC<LineChartProps> = ({
    data,
    title,
    height = 300,
    color = 'var(--color-primary)',
    showGrid = true,
    showLegend = false,
    animate = true
}) => {
    const formatXAxisLabel = (value: string) => {
        try {
            const date = new Date(value)
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return value
        }
    }

    const formatTooltipLabel = (value: string) => {
        try {
            const date = new Date(value)
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return value
        }
    }

    return (
        <ChartContainer>
            {title && <ChartTitle>{title}</ChartTitle>}

            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border)"
                            opacity={0.3}
                        />
                    )}

                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatXAxisLabel}
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />

                    <Tooltip
                        labelFormatter={formatTooltipLabel}
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow: '0 10px 30px var(--shadow)'
                        }}
                    />

                    {showLegend && <Legend />}

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        dot={{
                            fill: color,
                            strokeWidth: 2,
                            r: 4
                        }}
                        activeDot={{
                            r: 6,
                            stroke: color,
                            strokeWidth: 2,
                            fill: 'var(--bg-primary)'
                        }}
                        animationDuration={animate ? 1000 : 0}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}